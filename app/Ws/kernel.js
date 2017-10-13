'use strict'

const Ws = use('Ws')

const globalMiddleware = [
  'Adonis/Middleware/AuthInit'
]

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
  wsuser: 'App/Http/Middleware/WsGuard'
}



Ws.global(globalMiddleware)
Ws.named(namedMiddleware)
