'use strict'
const Env = use('Env')
const https = require('https')
const uuidv4 = require('uuid/v4');
const request = require('request')
const promiseAuth = Env.get('PROMISE_AUTH', 'dG9tQGF0dGVuZGVyLmNvbS5hdTpXM2xjb21lMQ==')
const baseUrl =  Env.get('PROMISE_BASE_URL','https://test.api.promisepay.com/')
const headers = { 'Authorization': `Basic ${promiseAuth}`, 'Content-Type': 'application/json'}


let baseReq = {
  post: (uri, payload) => {
    return new Promise((resolve, reject) => {
       request.post({url: baseUrl + uri, form: payload,  headers: headers}, (err, res, body) => {
         console.log(err, res)
         resolve(JSON.parse(body))
       })
    })
  },
  get: (uri) => {
    return new Promise((resolve, reject) => {
      request.get({ url: baseUrl + uri, headers: headers}, (err, res, body) => {
        resolve(JSON.parse(body))
      })
    })
  },
  delete: (uri) => {
    return new Promise((resolve, reject) => {
      request.delete({ url: baseUrl + uri, headers: headers}, (err, res, body) => {
        resolve(JSON.parse(body))
      })
    })
  },
  patch: (uri, payload) => {
    return new Promise((resolve, reject) => {
      request.patch({ url: baseUrl + uri, form: payload, headers: headers}, (err, res, body) => {
        resolve(JSON.parse(body))
      })
    })
  }
}


module.exports = {

  createUser: (payload) => {
    return baseReq.post('users', payload)
  },

  getUsers: () => {
    return baseReq.get('users')
  },

  getUser: (id) => {
    return baseReq.get(`users/${id}`)
  },

  addCard: (payload) => {
    return baseReq.post('card_accounts', payload)
  },

  redactCard: (id) => {
    return baseReq.delete(`card_accounts/${id}`)
  },

  getCard: (id) => {
    return baseReq.get(`card_accounts/${id}`)
  },

  getCards: (id) => {
    return baseReq.get(`users/${id}/card_accounts`)
  },

  addBank: (payload) => {
    return baseReq.post('bank_accounts', payload)
  },

  redactBank: (id) => {
    return baseReq.delete(`bank_accounts/${id}`)
  },

  getBanks: (id) => {
    return baseReq.get(`users/${id}/bank_accounts`)
  },

  wallet: (id) => {
    return baseReq.get(`users/${id}/wallet_accounts`)
  },

  withdraw: (id, amount, account_id) => {
    return baseReq.post(`wallet_accounts/${id}/withdraw`, {amount:(amount * 100),account_id})
  },

  deposit: (id, amount, account_id) => {
    return baseReq.post(`wallet_accounts/${id}/deposit`, {amount:(amount * 100),account_id:account_id})
  },

  transactions: (id) => {
    return baseReq.get(`users/${id}/items`)
  },

  transfer: (from_user, to_user, amount, from, account_id) => {
    let transactionId = `TN-${uuidv4()}`
    let transactionAmount = (amount * 100)
    if (from == 'card') {
      return false
    } else if (from == 'bank') {
      return new Promise((resolve, reject) => {
        baseReq.post('direct_debit_authorities', {account_id:account_id, amount:transactionAmount}).then((res) => {
          resolve(res)
        })
      }).then((res) => {
        if (!res.errors) {
          let payload = {
            amount: transactionAmount,
            currency: 'AUD',
            payment_type: 4,
            seller_id: to_user,
            buyer_id: from_user,
            id: transactionId,
            name: 'Transfer of Funds',
            description: 'Transfer from'
          }
          return new Promise((resolve, reject) => {
             baseReq.post('items', payload).then((res) => {
               resolve(res)
             })
          }).then((res) => {
            if (!res.errors) {
              return baseReq.patch(`items/${transactionId}/make_payment`, {account_id:account_id})
            } else {
              return res
            }
          })
        } else {
          return res
        }
      })
    } else {
      return false
    }
  }

}
