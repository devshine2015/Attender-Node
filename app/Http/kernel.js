'use strict'

const Middleware = use('Middleware')

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on every request and must be defined
| inside below array.
|
*/
const globalMiddleware = [
  'Adonis/Middleware/Cors',
  'Adonis/Middleware/BodyParser',
  'Adonis/Middleware/Shield',
  'Adonis/Middleware/Flash',
  'Adonis/Middleware/AuthInit',
  'App/Http/Middleware/MongoJWTMiddleware',
  'App/Http/Middleware/ViewUrl'
]

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware are key/value pairs. Keys are later used on routes
| which binds middleware to specific routes.
|
*/
const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
  guard: 'App/Http/Middleware/JwtGuard',
  admin: 'App/Http/Middleware/AdminGuard',
  nonuser: 'App/Http/Middleware/NonUserGuard',
  nav: 'App/Http/Middleware/Nav',
  user: 'App/Http/Middleware/UserGuard',
  profile: 'App/Http/Middleware/ProfileGuard'
}

/*
|--------------------------------------------------------------------------
| Register Middleware
|--------------------------------------------------------------------------
|
| Here we finally register our defined middleware to Middleware provider.
|
*/
Middleware.global(globalMiddleware)
Middleware.named(namedMiddleware)
