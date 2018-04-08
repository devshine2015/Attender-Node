'use strict'
const Moment = require('moment')
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const Subscription = use('App/Model/Subscription')
const Validator = use('Validator')
const Notify = use('App/Serializers/Notify')

class SubscriptionController {
  * index(req, res) {
    const employerId = req.auth.request.user.employer._id;
    const subscriptionType = req._body.subscriptionType;
    const subscriptions = yield Subscription.find({
      employerId,
      type: subscriptionType,
    }).populate('staffId', 'fullname');
    if (!subscriptions) {
      return res.json({status: false, messageCode: 'NO_SUBSCRIPTION', message: 'No list of Subscription'})
    }
    return res.json({status: true, subscriptions});
  }

  * check(req, res) {
    const employerId = req.auth.request.user.employer._id;
    const subscription = yield Subscription.findOne({
      employerId: employerId,
      type: 'ACCOUNT_PREMIUM',
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

  * subscribe(req, res) {
    const employerId = req.auth.request.user.employer._id;
    const staffId = req._body.staffId;
    const subscriptionType = req._body.subscriptionType;
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
      yield subscription.save();
      return res.json({status: true, subscription});
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
    const indexDup = subscription.history.findIndex(x=> x.status === 'cancel' && moment(x.cancelDate).format('MM-DD-YYYY') === moment(currentDate).format('MM-DD-YYYY'));
    if (indexDup !== -1) {
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