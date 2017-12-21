'use strict'
const Env = use('Env')
const moment = require('moment')
const uuidv4 = require('uuid/v4');
const AHelpers = use('AHelpers')
const PromisePay = use('PromisePay')
const Card = use('App/Model/Card')
const Bank = use('App/Model/Bank')
const StaffManagement = use('App/Model/StaffManagement')
const Timesheet = use('App/Model/Timesheet')

module.exports = class PaymentController {

  * earnings (req, res) {
    let banks = yield Bank.find({ user: req.user._id })
    let promiseWallet = yield PromisePay.wallet(req.user.promiseId)
    let wallet = {}
    if (promiseWallet.wallet_accounts) {
      let balance = promiseWallet.wallet_accounts.balance
      let label = balance / 100
      wallet = { balance: balance, label: `$${label.toLocaleString()}`, status: true }
    } else {
      wallet = { balance: 0, label: `$0`}
    }

    return res.json({ banks, wallet })
  }

  * cards (req, res) {
    let cards = yield Card.find({ user: req.user._id })
    return res.json({ status: true, cards: cards })
  }

  * addCard (req, res) {
    let card = yield PromisePay.addCard({
      user_id: req.user.promiseId,
      full_name: req.input('account_name', ''),
      number: req.input('account_number', ''),
      expiry_month: req.input('expiry_month', 1),
      expiry_year: req.input('expiry_year', 2020),
      cvv: req.input('cvv', 123)
    })
    if (card.card_accounts) {
      let existing = yield Card.findOne({ user: req.user._id })
      let currentCard = yield PromisePay.getCards(req.user.promiseId)
      yield Card.create({
        promiseId: currentCard.card_accounts.id,
        active: currentCard.card_accounts.active,
        currency: currentCard.card_accounts.currency,
        cardMeta: currentCard.card_accounts.card,
        user: req.user._id,
        primary: (existing) ? false : true
      })
      return res.json({ status: true, card: currentCard.card_accounts })
    } else {
      return res.json({ status: false, errors: card.errors })
    }

  }

  * removeCard (req, res) {
    let card = yield Card.findOne({ promiseId: req.param('id') })
    if (card) {
      card.remove()
      let redact = yield PromisePay.redactCard(card.promiseId)
      if (redact.card_account) {
        let primaryCard = yield Card.findOne({ user: req.user._id, primary: true})
        if (!primaryCard) {
          let setcard = yield Card.findOne({ user: req.user._id, primary: false })
          if (setcard) {
            setcard.primary = true
            yield setcard.save()
          }
        }
        return res.json({ status: true, message: redact.card_account, messageCode: 'SUCCESS' })
      } else {
        return res.json({ status: false, errors: redact.errors, messageCode: 'FAILED' })
      }
    }
  }

  * banks (req, res) {
    let banks = yield Bank.find({ user: req.user._id })
    return res.json({ status: true, banks: banks })
  }

  * addBank (req, res) {
    let bank = yield PromisePay.addBank({
      user_id: req.user.promiseId,
      bank_name: req.input('bank_name', ''),
      account_name: req.input('account_name', ''),
      routing_number: req.input('routing_number', ''),
      account_number: req.input('account_number', ''),
      account_type: req.input('account_type', 'savings'),
      holder_type: req.input('holder_type', 'personal'),
      country: 'AUS'
    })
    if (bank.bank_accounts) {
      let existing = yield Bank.findOne({ user: req.user._id })
      let newBank = yield Bank.create({
        promiseId: bank.bank_accounts.id,
        active: bank.bank_accounts.active,
        currency: bank.bank_accounts.currency,
        verification: bank.verification_status,
        bankMeta: bank.bank_accounts.bank,
        user: req.user._id,
        primary: (existing) ? false : true
      })
      return res.json({ status: true, bank: newBank })
    } else {
      return res.json({ status: false, errors: bank.errors })
    }

  }

  * removeBank (req, res) {
    let bank = yield Bank.findOne({ promiseId: req.param('id') })
    if (bank) {
      bank.remove()
      let redact = yield PromisePay.redactBank(bank.promiseId)
      if (redact.bank_account) {
        let primaryBank = yield Bank.findOne({ user: req.user._id, primary: true})
        if (!primaryBank) {
          let setbank = yield Bank.findOne({ user: req.user._id, primary: false })
          if (setbank) {
            setbank.primary = true
            yield setbank.save()
          }
        }
        return res.json({ status: true, message: redact.bank_account, messageCode: 'SUCCESS' })
      } else {
        return res.json({ status: false, errors: redact.errors, messageCode: 'FAILED' })
      }
    }
  }

  * transfer (req, res) {
    let transfer = yield PromisePay.transfer(
      req.user.promiseId,
      `${Env.get('PROMISE_ID_PREFIX', 'beta-v1-acc-')}${req.input('to_user', '')}`,
      req.input('amount', 0),
      req.input('from', 'bank'),
      req.input('account_id', '')
    )
    if (transfer.items) {
      return res.json({ status: true, messageCode: 'TRANSFER_PENDING' })
    } else {
      return res.json({ status: false, errors: transfer.errors })
    }
  }

  * withdraw (req, res) {
    let withdraw = yield PromisePay.withdraw(
      id=req.user.id,
      account_id=req.input('account_id', req.user.primaryAccount ),
      amount=req.input('amount', 0)
    )
    return res.json({ status: true, messageCode: 'SUCCESS' })
  }

  * deposit (req, res) {
    let withdraw = yield PromisePay.deposit(
      id=req.user.promiseId,
      account_id=req.input('account_id', req.user.primaryAccount ),
      amount=req.input('amount', 0)
    )
    return res.json({ status: true, messageCode: 'SUCCESS' })
  }

  * transactions (req, res) {
    let transactions = yield PromisePay.transactions(req.user.promiseId)
    if (transactions.items) {
      return res.json({ status:true, transactions: transactions })
    } else {
      return res.json({ status: false, messageCode: 'INTERNAL_SERVER_ERROR' })
    }
  }

  * getManagement (req) {
    let management = yield StaffManagement.findOne({ _id: req.param('id') }).populate('staff')
    return (management) ? management : false
  }

  * currentTimesheet (req, res) {
    let management = yield this.getManagement(req)
    let nextWeek = moment().isoWeekday(1).hour(0).minute(0).second(0).millisecond(0).add(1, 'weeks')
    let lastWeek = moment().isoWeekday(1).hour(0).minute(0).second(0).millisecond(0).subtract(1, 'weeks')
    let previous = yield Timesheet.findOne({ management: management._id, weekStart: lastWeek })
    let next = yield Timesheet.findOne({ management: management._id, weekStart: nextWeek })
    let actions = {
      next: (next) ? next._id : false,
      previous: (previous) ? previous._id : false
    }
    if (management) {
      let weekStart = moment().startOf('isoWeek').format()
      let weekEnd = moment().endOf('isoWeek').format()
      let timesheet = yield Timesheet.findOne({
                        management: management._id,
                        weekStart: weekStart,
                        weekEnd: weekEnd
                      })
      if (timesheet) {
        return res.json({ status: true, timesheet, actions })
      } else {
        let time = yield AHelpers.initializeTimesheet(management)
        timesheet = yield Timesheet.create(time)
        return res.json({ status: true, timesheet, actions })
      }
    } else {
      return res.json({ status: false, messageCode: 'NOT_FOUND' })
    }
  }

  * getTimesheet (req, res) {
    let timesheet = yield Timesheet.findOne({ _id: req.param('id') }).populate('staff').populate('employer')
    if (timesheet) {
      let nextWeek = moment(timesheet.weekStart).isoWeekday(1).hour(0).minute(0).second(0).millisecond(0).add(1, 'weeks')
      let lastWeek = moment(timesheet.weekStart).isoWeekday(1).hour(0).minute(0).second(0).millisecond(0).subtract(1, 'weeks')
      let weekStart = moment().startOf('isoWeek')
      let previous = yield Timesheet.findOne({ management: timesheet.management, weekStart: lastWeek })
      let next = yield Timesheet.findOne({ management: timesheet.management, weekStart: nextWeek })
      let actions = {
        next: (next) ? next._id : false,
        previous: (previous) ? previous._id : false,
        initializeNext: (weekStart == nextWeek)
      }
      return res.json({ status: true, timesheet, actions })

    } else {
      return res.json({ status: false, messageCode: 'NOT_FOUND' })
    }
  }

  * updateTimesheet (req, res) {
    let timesheet = yield Timesheet.findOne({ _id: req.param('id') }).populate('staff').populate('employer')
    if (timesheet) {
      switch (req.param('action')) {
        case 'rate':
          timesheet.rate = req.input('rate', timesheet.rate)
          timesheet.save()
          break;
        case 'payable':
          timesheet.totalPayableHours = req.input('payable', timesheet.totalPayableHours)
          timesheet.save()
          break;
        case 'hours':
          let days = JSON.parse(req.input('days', JSON.stringify(timesheet.days)))
          timesheet.days = days
          timesheet.save()
        case 'make_payment':
          let transfer = yield PromisePay.transfer(
            `${Env.get('PROMISE_ID_PREFIX', 'beta-v1-acc-')}${timesheet.venue.user}`,
            `${Env.get('PROMISE_ID_PREFIX', 'beta-v1-acc-')}${timesheet.staff.user}`,
            req.input('amount', 0),
            'bank',
            req.input('account_id', '')
          )
          if (transfer.items) {
            timesheet.transactionId = transfer.items.id
            timesheet.mutable = false
            timesheet.paymentStatus = 'pending'
            timesheet.save()
            return res.json({ status: true, messageCode: 'PAYMENT_PENDING', timesheet })
          } else {
            return res.json({ status: false, errors: transfer.errors })
          }
        default:
          return res.json({ status: false, messageCode: 'INVALID_ACTION' })
      }
      return res.json({ status: true, messageCode: 'SAVED', timesheet })
    } else {
      return res.json({ status: false, messageCode: 'NOT_FOUND' })
    }
  }




}
