'use strict'
const Env = use('Env')
const Moment = require('moment')
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const Subscription = use('App/Model/Subscription')
const DefaultPaymentMethod = use('App/Model/DefaultPaymentMethod')
const Validator = use('Validator')
const Notify = use('App/Serializers/Notify')
const PromisePay = use('PromisePay')
const OneSignal = use('OneSignal');

class SubscriptionController {
  * index(req, res) {
    const data = req.all();
    const employerId = req.auth.request.user.employer._id;
    const subscriptionType = data.subscriptionType;
    const subscriptions = yield Subscription.find({
      employerId,
      type: subscriptionType,
    }).populate('staffId', 'fullname');
    if (!subscriptions) {
      return res.json({status: false, messageCode: 'NO_SUBSCRIPTION', message: 'No list of Subscription'})
    }
    return res.json({status: true, subscriptions});
  }

  * test(req, res) {
    return res.json({ status: 'Hello World'});
  }

  * check(req, res) {
    const data = req.all();
    const employerId = req.auth.request.user.employer._id;
    const subscriptionType = data.subscriptionType;
    const subscription = yield Subscription.findOne({
      employerId: employerId,
      type: subscriptionType,
    });
    if (subscription) {
      const currentDate = moment();
      const dateRange = moment().range(subscription.purchaseDate, subscription.expireDate);
      const range = dateRange.contains(currentDate);
      if (!range) {
        return res.json({status: false, messageCode: 'CANCELLED_SUBSCRIPTION', message: 'Please renew subscription to access functionality.'})
      }
    }
    if (!subscription) {
      return res.json({status: false, messageCode: 'NO_SUBSCRIPTION', message: 'No list of Subscription'})
    }
    return res.json({status: true, subscription});
  }

  * checkStaff(req, res) {
    const data = req.all();
    const employerId = req.auth.request.user.employer._id;
    const subscriptionType = data.subscriptionType;
    const staffId = data.staffId;
    const subscription = yield Subscription.findOne({
      employerId: employerId,
      staffId: staffId,
      type: subscriptionType,
    });
    
    if (subscription) {
      const currentDate = moment();
      const dateRange = moment().range(subscription.purchaseDate, subscription.expireDate);
      const range = dateRange.contains(currentDate);
      if (!range) {
        return res.json({status: false, messageCode: 'CANCELLED_SUBSCRIPTION', message: 'Please renew subscription to access functionality.'})
      }
    }
    if (!subscription) {
      return res.json({status: false, messageCode: 'NO_SUBSCRIPTION', message: 'No list of Subscription'})
    }
    return res.json({status: true, subscription});
  }

  * getDefaultPayment(req, res) {
    const userId = req.auth.request.user._id;
    const defaultPaymentMethod = yield DefaultPaymentMethod.findOne({
      userId,
    });
    return res.json({ status: true, defaultPaymentMethod });
  }

  * defaultPayment(req, res) {
    const userId = req.auth.request.user._id;
    const method = req._body.method;
    const number = req._body.number;
    const promiseID = req._body.promiseID;
    
    const defaultPaymentMethod = new DefaultPaymentMethod({
      userId,
      method,
      number,
      promiseID,
    });
    try {
      yield defaultPaymentMethod.save();
      return res.json({ status: true, defaultPaymentMethod });
    } catch(err) {
      if (err.code === 11000) {
        const updateDefault = yield this.updateDefaultPayment(req);
        if (updateDefault) {
          return res.json({ status: true, defaultPaymentMethod });
        }
      }
      return res.json({status: false, messageCode: 'ERROR_DEFAULT_PAYMENT_METHOD', message: 'Error Setting Default Payment Method', err})
    }
  }

  * updateDefaultPayment(req) {
    const userId = req.auth.request.user._id;
    const method = req._body.method;
    const number = req._body.number;
    const promiseID = req._body.promiseID;

    const defaultPaymentMethod = yield DefaultPaymentMethod.findOne({
      userId,
    });

    defaultPaymentMethod.method = method;
    defaultPaymentMethod.number = number;
    defaultPaymentMethod.promiseID = promiseID;
    try {
      defaultPaymentMethod.save();
      return true;
    } catch(err) {
      return false;
    }
  }

  * subscribe(req, res) {
    const employerId = req.auth.request.user.employer._id;
    const staffId = req._body.staffId;
    const subscriptionType = req._body.subscriptionType;
    const account_id = req._body.account_id;
    const email = req.user.email;
    const user_id = `${Env.get('PROMISE_ID_PREFIX', 'beta-v1-acc-')}${req.user._id}`;
    const zip = 4500;
    const country = 'AUS';
    let price = 49;
    if (subscriptionType === 'MANAGE_STAFF') {
      price = 3;
    }
    const currentDate = moment();
    const subscription = new Subscription({
      type: subscriptionType,
      employerId: employerId,
      staffId: staffId,
      purchaseDate: currentDate,
      expireDate: moment(currentDate).add(1, 'M').add(1, 'd'),
      status: 'subscribe',
      history: [
        {
          purchaseDate: currentDate,
          expireDate: moment(currentDate).add(1, 'M').add(1, 'd'),
          status: 'subscribe',
        }
      ],
      price: price,
    });
    try {
      const promiseCharge = yield PromisePay.chargeSubscription(account_id, price, email, zip, country, subscriptionType, user_id);
      if (!promiseCharge.errors) {
        yield subscription.save();
        return res.json({status: true, subscription });
      } else {
        return res.json({status: false, promiseCharge });
      }
      
    } catch(err) {
      if (err.code === 11000) {
        const resub = yield this.reSubscribe(req);
        if (resub) {
          return res.json({status: false, messageCode: 'ALREADY_SUBSCRIBE', message: 'You already Subscribe for the month'})
        }
        return res.json({status: true, message: 'Successfully Resubscribe'});
      }
      return res.json({status: false, messageCode: 'NO_SUBSCRIPTION', message: 'No list of Subscription', err})
    }
  }

  * reSubscribeStatus(req, res) {
    const employerId = req.auth.request.user.employer._id;
    const staffId = req._body.staffId;
    const subscriptionType = req._body.subscriptionType;
    const subscription = yield Subscription.findOne({
      employerId: employerId,
      staffId: staffId, // '5abb2e50f4c0ff128c4ddad5'
      type: subscriptionType,
    });
    yield Subscription.update({
      employerId: employerId,
      staffId: staffId,
      type: subscriptionType,
    },
    {
      $set: {
        status: 'subscribe',
      },
    }).then(d => {
      return res.json({status: true, d});
    }).catch(err => {
      return res.json({status: false, messageCode: 'NO_SUBSCRIPTION', message: 'No Subscription'})
    });
  }

  * reSubscribe(req) {
    let sub = false;
    const employerId = req.auth.request.user.employer._id;
    const staffId = req._body.staffId;
    const subscriptionType = req._body.subscriptionType;
    const currentDate = moment();
    const subscription = yield Subscription.findOne({
      employerId: employerId,
      staffId: staffId, // '5abb2e50f4c0ff128c4ddad5'
      type: subscriptionType,
    });
    const dateRange = moment().range(subscription.purchaseDate, subscription.expireDate);
    const range = dateRange.contains(currentDate);
    const indexDup = subscription.history.findIndex(x=> x.status === 'subscribe' && moment(x.purchaseDate).format('MM-DD-YYYY') === moment(currentDate).format('MM-DD-YYYY'));
    if (!range && indexDup === -1) {
      const promiseCharge = yield PromisePay.chargeSubscription(account_id, price, email, zip, country, subscriptionType, user_id);
      if (promiseCharge.errors) {
        return true;
      }
      sub = yield Subscription.update({
        employerId: employerId,
        staffId: staffId,
        type: subscriptionType,
      },
      {
        $addToSet: {
          history: {
            purchaseDate: currentDate,
            expireDate: moment(currentDate).add(1, 'M').add(1, 'd'),
            status: 'subscribe',
          }
        },
        $set: {
          purchaseDate: currentDate,
          expireDate: moment(currentDate).add(1, 'M').add(1, 'd'),
          status: 'subscribe',
        },
      }).then(d => {
        return false;
      }).catch(err => {
        return true;
      });
      return sub;
    } else {
      return true;
    }
    
  }

  * cancel(req, res) {
    const employerId = req.auth.request.user.employer._id;
    const staffId = req._body.staffId;
    const subscriptionType = req._body.subscriptionType;
    const currentDate = moment();
    const subscription = yield Subscription.findOne({
      employerId: employerId,
      staffId: staffId,
      type: subscriptionType,
    });
    if (!subscription || subscription.length <= 0) {
      return res.json({status: false, messageCode: 'NO_SUBSCRIPTION', message: 'No Subscription'})
    }
    // const indexDup = subscription.history.findIndex(x=> x.status === 'cancel' && moment(x.cancelDate).format('MM-DD-YYYY') === moment(currentDate).format('MM-DD-YYYY'));
    if (subscription.status === 'cancel') {
      return res.json({status: false, messageCode: 'SUBSCRIPTION_ALREADY_CANCELED', message: 'You already canceled your subscription'})
    } 
    yield Subscription.update({
      employerId: employerId,
      staffId: staffId,
      type: subscriptionType,
    },
    {
      $addToSet: {
        history: {
          purchaseDate: subscription.purchaseDate,
          expireDate: subscription.expireDate,
          cancelDate: currentDate,
          status: 'cancel',
        }
      },
      $set: {
        status: 'cancel',
      },
    }).then(d => {
      return res.json({status: true, d});
    }).catch(err => {
      return res.json({status: false, messageCode: 'NO_SUBSCRIPTION', message: 'No Subscription'})
    });
  }
}

module.exports = SubscriptionController
