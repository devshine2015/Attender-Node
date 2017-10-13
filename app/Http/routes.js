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

}).prefix('manage').middleware('admin')



Route.group('profile', function() {
  Route.get('/', 'Web/GeneralController.index')
  Route.get('verify-email', 'Web/AuthController.verify')
  Route.get('profile-setup', 'Web/AuthController.setupProfile')
  Route.post('profile-setup', 'Web/AuthController.saveProfile')
  Route.post('save-staff-profile', 'Web/StaffController.save')
  Route.post('save-venue-profile', 'Web/VenueController.save')
  Route.get('logout', 'Web/AuthController.logout')

  Route.post('/conversation/:convo', 'Web/GeneralController.conversation')
  Route.get('/messages', 'Web/GeneralController.messages')
  Route.post('/new-staff-message', 'Web/GeneralController.sendStaffMsg')
  Route.post('/new-venue-message', 'Web/GeneralController.sendVenueMsg')

  Route.get('job-seekers', 'Web/StaffController.index')

  Route.get('venues', 'Web/VenueController.index')
  Route.get('my-staffs', 'Web/VenueController.myStaffs')
  Route.get('events', 'Web/EventController.index')

  Route.post('/staff-messages/:token*', 'Web/StaffController.messages')

  Route.get('venue/:id', 'Web/VenueController.select')
  Route.post('/venue-messages/:token*', 'Web/VenueController.messages')
  Route.post('venue/:id/interest', 'Web/VenueController.interest')
  Route.get('events/create', 'Web/EventController.create')
  Route.post('events/create', 'Web/EventController.store')
  Route.post('event/:id/interest', 'Web/EventController.interest')

}).middleware('user')



Route.group('nonuser', function() {

  Route.get('register', 'Web/AuthController.getRegister')
  Route.post('register', 'Web/AuthController.register')

  Route.get('login', 'Web/AuthController.login')
  Route.post('login', 'Web/AuthController.login')

  Route.get('email/verify/:verification/:token*', 'Admin/AuthController.verification')

  Route.get('manage/login', 'Admin/AuthController.login')
  Route.post('manage/login', 'Admin/AuthController.login')

}).middleware('nonuser')

Route.get('seed', 'Admin/SeedController.create')
