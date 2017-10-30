'use strict'
const Env = use('Env')
const https = require('https')
const request = require('request')
const promiseAuth = Env.get('PROMISE_AUTH', 'dG9tQGF0dGVuZGVyLmNvbS5hdTpXM2xjb21lMQ==')
const baseUrl =  Env.get('PROMISE_BASE_URL','https://test.api.promisepay.com/')
const headers = { 'Authorization': `Basic ${promiseAuth}`, 'Content-Type': 'application/json'}


let baseReq = {
  post: (uri, payload) => {
    return new Promise((resolve, reject) => {
       request.post({url: baseUrl + uri, form: payload,  headers: headers}, (err, res, body) => {
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

  getCards: (id) => {
    return baseReq.get(`users/${id}/card_accounts`)
  },

  addBank: (payload) => {
    return baseReq.post('bank_accounts', payload)
  },

  getBanks: (id) => {
    return baseReq.get(`users/${id}/bank_accounts`)
  },

  wallet: (id) => {
    return baseReq.get(`users/${id}/wallet_accounts`)
  },

  withdraw: (id, amount, account_id) => {
    return baseReq.post(`wallet_accounts/${id}/withdraw`, {amount:amount,account_id:account_id})
  },

  deposit: (id, amount, account_id) => {
    return baseReq.post(`wallet_accounts/${id}/deposit`, {amount:amount,account_id:account_id})
  }

}
