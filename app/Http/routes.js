'use strict'

const Route = use('Route')

Route.get('api/staffs', 'Api/StaffController.index')
Route.get('api/venues', 'Api/VenueController.index')
Route.get('api/organizers', 'Api/OrganizerController.index')
Route.get('api/events', 'Api/EventController.index')

Route.group('api', function() {
  Route.get('auth/current', 'Api/AuthController.current')

  // STAFF API MANAGEMENT
  Route.get('user/profile/staff', 'Api/UserController.getStaffProfile')
  Route.post('user/profile/staff', 'Api/UserController.saveStaffProfile')

  // VENUE API MANAGEMENT
  Route.get('venue/notifications', 'Api/VenueController.notifications')
  Route.get('venue/interested', 'Api/VenueController.interested')
  Route.post('venue/:id/interest', 'Api/VenueController.interest')

  Route.get('user/profile/venue', 'Api/UserController.getVenueProfile')
  Route.post('user/profile/venue', 'Api/UserController.saveVenueProfile')

  // ORGANIZER API MANAGEMENT
  Route.get('user/profile/organizer', 'Api/UserController.getOrganizerProfile')
  Route.post('user/profile/organizer', 'Api/UserController.saveOrganizerProfile')

  // EVENT API MANAGEMENT
  Route.post('events', 'Api/EventController.create')
  Route.get('events/:id/interested', 'Api/EventController.interested')
  Route.post('events/:id/interest', 'Api/EventController.interest')


}).prefix('api').middleware('guard')

Route.post('api/auth/login', 'Api/AuthController.login')
Route.post('api/auth/register', 'Api/AuthController.register')
Route.post('api/auth/confirm', 'Api/AuthController.confirm')


Route.group('manage', function() {
  Route.get('/', 'Admin/HomeController.index')
  Route.get('logout', 'Admin/AuthController.logout')

  Route.resource('users', 'Admin/UserController')

  Route.resource('venues', 'Admin/VenueController')

  Route.get('organisers', 'Admin/OrganizerController.index')

  Route.get('staffs', 'Admin/StaffController.index')

  Route.get('events', 'Admin/EventController.index')

}).middleware('admin')

Route.group('nonuser', function() {
  Route.get('login', 'Admin/AuthController.login')
  Route.post('login', 'Admin/AuthController.login')
  Route.get('email/verify/:verification/:token*', 'Admin/AuthController.verification')
}).middleware('nonuser')

Route.get('seed', 'Admin/SeedController.create')
