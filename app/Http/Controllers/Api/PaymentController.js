'use strict'

const PromisePay = use('PromisePay')
const Card = use('App/Model/Card')
const Bank = use('App/Model/Bank')


module.exports = class PaymentController {

  * cards (req, res) {
    let cards = yield Card.find({ user: req.user._id })
    return res.json({ status: true, cards: cards })
  }

  * addCard (req, res) {
    let card = yield PromisePay.addCard({
      user_id: `test-acc-${req.user._id}`,
      full_name: req.input('account_name', ''),
      number: req.input('account_number', ''),
      expiry_month: req.input('expiry_month', 1),
      expiry_year: req.input('expiry_year', 2020),
      cvv: req.input('cvv', 123)
    })
    let existing = yield Card.findOne({ user: req.user._id })
    yield Card.create({
      promiseId: card.card_accounts.id,
      active: card.card_accounts.active,
      currency: card.card_accounts.currency,
      cardMeta: card.card_accounts.card,
      user: req.user._id,
      primary: (existing) ? false : true
    })
    return res.json({ status: true, card: card.card_accounts })
  }

  * banks (req, res) {
    let banks = yield Bank.find({ user: req.user._id })
    return res.json({ status: true, banks: banks })
  }

  * addBank (req, res) {
    let bank = yield PromisePay.addBank({
      user_id: `test-acc-${req.user._id}`,
      bank_name: req.input('bank_name', ''),
      account_name: req.input('account_name ', ''),
      routing_number: req.input('routing_number ', ''),
      account_number: req.input('account_number', ''),
      account_type: req.input('account_type', 'savings'),
      holder_type: req.input('holder_type', 'personal'),
      country: 'AUS'
    })
    let existing = yield Bank.findOne({ user: req.user._id })
    yield Bank.create({
      promiseId: bank.bank_accounts.id,
      active: bank.bank_accounts.active,
      currency: bank.bank_accounts.currency,
      verification: bank.verification_status,
      bankMeta: bank.bank_accounts.bank,
      user: req.user._id,
      primary: (existing) ? false : true
    })
    return res.json({ status: true, bank: bank.bank_accounts })
  }

  * transfer (req, res) {
    let transfer = yield PromisePay.deposit(
      id=req.param('id'),
      amount=req.input('amount', 0),
      account_id=req.input('account_id', '')
    )
    return res.json({ status: true, messageCode: 'SUCCESS' })
  }

  * withdraw (req, res) {
    let withdraw = yield PromisePay.withdraw(
      id=req.user.id,
      account_id=req.input('account_id', req.user.primaryAccount ),
      amount=req.input('amount', 0)
    )
    return res.json({ status: true, messageCode: 'SUCCESS' })
  }

  * transactions (req, res) {

  }

}
