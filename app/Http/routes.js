'use strict'

const Route = use('Route')

Route.get('api/staffs', 'Api/StaffController.index')
Route.get('api/venues', 'Api/VenueController.index')
Route.get('api/organizers', 'Api/OrganizerController.index')
Route.get('api/events', 'Api/EventController.index')

Route.group('api', function() {
  Route.get('auth/current', 'Api/AuthController.current')

  // PAYMENT MANAGEMENT
  Route.get('earnings', 'Api/PaymentController.earnings')
  Route.get('transactions', 'Api/PaymentController.transactions')

  Route.get('cards', 'Api/PaymentController.cards')
  Route.post('add-card', 'Api/PaymentController.addCard')
  Route.post('remove-card/:id', 'Api/PaymentController.removeCard')

  Route.get('banks', 'Api/PaymentController.banks')
  Route.post('add-bank', 'Api/PaymentController.addBank')
  Route.post('remove-bank/:id', 'Api/PaymentController.removeBank')

  Route.post('withdraw', 'Api/PaymentController.withdraw')
  Route.post('deposit', 'Api/PaymentController.deposit')

  Route.post('transfer', 'Api/PaymentController.transfer')

  // MESSAGING API MANAGEMENT
  Route.get('conversation/:convo', 'Api/GeneralController.conversation')
  Route.get('open-convo/:id', 'Api/GeneralController.openConvo')
  Route.post('new-initial-message', 'Api/VenueController.sendInitialMsg')
  Route.post('new-staff-message', 'Api/VenueController.sendStaffMsg')
  Route.post('new-venue-message', 'Api/StaffController.sendVenueMsg')

  // STAFF API MANAGEMENT
  Route.get('user/profile/staff', 'Api/UserController.getStaffProfile')
  Route.post('user/profile/staff', 'Api/UserController.saveStaffProfile')
  Route.get('staff-messages', 'Web/StaffController.messages')
  Route.get('trial-staffs', 'Api/VenueController.trialStaffs')
  Route.get('active-staffs', 'Api/VenueController.activeStaffs')

  Route.post('trial/:id', 'Api/StaffController.trial')
  Route.post('direct-hire/:id', 'Api/StaffController.directHire')
  Route.post('hire/:id', 'Api/StaffController.hire')
  Route.post('remove-staff/:id', 'Api/StaffController.removeStaff')

  Route.post('add-task/:id', 'Api/StaffController.addTask')
  Route.post('add-suggestion/:id', 'Api/StaffController.addSuggestion')

  Route.post('task/:id/edit', 'Web/StaffController.editTask')
  Route.post('task/:id/delete', 'Web/StaffController.deleteTask')

  Route.post('suggestion/:id/edit', 'Web/StaffController.editSuggestion')
  Route.post('suggestion/:id/delete', 'Web/StaffController.deleteSuggestion')

  Route.post('add-rating/:type/:id', 'Api/StaffController.addRating')
  Route.post('rating/:id/edit', 'Api/StaffController.editRating')

  Route.post('save-staff-sched/:id', 'Api/StaffController.saveStaffSchedule')
  Route.post('save-staff-assignment/:id', 'Api/StaffController.saveAssignment')

  Route.post('add-staff/:id/event/:eid', 'Api/StaffController.addStaffToEvent')
  Route.post('remove-staff/:id/event/:eid', 'Api/StaffController.removeStaffFromEvent')

  Route.post('pay-staff/:id', 'Api/StaffController.payStaff')
  Route.get('management/:id/timesheet/current', 'Api/PaymentController.currentTimesheet')
  Route.get('timesheet/:id', 'Api/PaymentController.getTimesheet')
  Route.post('timesheet/:id/rate', 'Api/PaymentController.updateTimesheetRate')
  Route.post('timesheet/:id/hours', 'Api/PaymentController.updateTimesheetHours')
  Route.post('timesheet/:id/payable', 'Api/PaymentController.updatePayableHours')



  // VENUE API MANAGEMENT
  Route.get('my-staffs', 'Api/VenueController.myStaffs')
  Route.get('venue/notifications', 'Api/VenueController.notifications')
  Route.post('venue/notification/:id/delete', 'Api/VenueController.removeNotif')
  Route.get('venue/interested', 'Api/VenueController.interested')
  Route.post('venue/:id/interest', 'Api/VenueController.interest')
  Route.get('venue-messages', 'Web/VenueController.messages')

  Route.get('user/profile/venue', 'Api/UserController.getVenueProfile')
  Route.post('user/profile/venue', 'Api/UserController.saveVenueProfile')

  // ORGANIZER API MANAGEMENT
  Route.get('user/profile/organizer', 'Api/UserController.getOrganizerProfile')
  Route.post('user/profile/organizer', 'Api/UserController.saveOrganizerProfile')

  // EVENT API MANAGEMENT
  Route.get('events', 'Api/EventController.index')
  Route.get('my-events', 'Api/EventController.myEvents')
  Route.post('events', 'Api/EventController.create')
  Route.get('events/:id/interested', 'Api/EventController.interested')
  Route.post('events/:id/interest', 'Api/EventController.interest')


}).prefix('api').middleware('guard')

Route.post('api/auth/login/facebook', 'Api/AuthController.facebookAuth')
Route.post('api/auth/login/google', 'Api/AuthController.googleAuth')
Route.post('api/auth/login', 'Api/AuthController.login')

Route.post('api/auth/register', 'Api/AuthController.register')
Route.post('api/auth/register/google', 'Api/AuthController.googleReg')
Route.post('api/auth/register/facebook', 'Api/AuthController.facebookReg')

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

  Route.post('/conversation/:convo', 'Web/GeneralController.conversation')
  Route.get('/messages', 'Web/GeneralController.messages')
  Route.post('/new-staff-message', 'Web/GeneralController.sendStaffMsg')
  Route.post('/new-venue-message', 'Web/GeneralController.sendVenueMsg')
  Route.post('/staff-messages', 'Web/StaffController.messages')

  Route.get('job-seekers', 'Web/StaffController.index')
  Route.get('my-staffs', 'Web/VenueController.renderMyStaffs')

  Route.post('my-staffs', 'Web/VenueController.myStaffs')
  Route.post('interested-staffs', 'Web/VenueController.interestedStaffs')
  Route.post('/direct-hire/:id', 'Web/StaffController.directHire')
  Route.post('/hire/:id', 'Web/StaffController.hire')

  Route.post('/task/:id/edit', 'Web/StaffController.editTask')
  Route.post('/task/:id/delete', 'Web/StaffController.deleteTask')

  Route.post('/suggestion/:id/edit', 'Web/StaffController.editSuggestion')
  Route.post('/suggestion/:id/delete', 'Web/StaffController.deleteSuggestion')

  Route.get('venues', 'Web/VenueController.index')
  Route.get('venue/:id', 'Web/VenueController.select')
  Route.post('/venue-messages', 'Web/VenueController.messages')
  Route.post('venue/:id/interest', 'Web/VenueController.interest')

  Route.get('events', 'Web/EventController.index')
  Route.get('events/create', 'Web/EventController.create')
  Route.post('events/create', 'Web/EventController.store')
  Route.post('event/:id/interest', 'Web/EventController.interest')

  Route.post('trial/:id', 'Web/StaffController.trial')
  Route.post('add-task/:id', 'Web/StaffController.addTask')
  Route.post('add-suggestion/:id', 'Web/StaffController.addSuggestion')
  Route.post('/remove-staff/:id', 'Api/StaffController.removeStaff')


}).middleware('user','profile')

Route.group('user', function(){
  Route.get('logout', 'Web/AuthController.logout')
  Route.get('verify-email', 'Web/AuthController.verify')
  Route.get('profile-setup', 'Web/AuthController.setupProfile')
  Route.post('profile-setup', 'Web/AuthController.saveProfile')
  Route.post('save-staff-profile', 'Web/StaffController.save')
  Route.post('save-venue-profile', 'Web/VenueController.save')
  Route.post('save-organiser-profile', 'Web/OrganizerController.save')
}).middleware('user')


Route.group('nonuser', function() {
  Route.get('register', 'Web/AuthController.getRegister')
  Route.post('register', 'Web/AuthController.register')
  Route.get('forgot-password', 'Web/AuthController.forgotPass')
  Route.post('forgot-password', 'Web/AuthController.forgot')
  Route.get('login', 'Web/AuthController.login')
  Route.post('login', 'Web/AuthController.login')
  Route.get('reset-password/:token*', 'Web/AuthController.reset')
  Route.post('reset-password/:token*', 'Web/AuthController.resetPost')
  Route.get('email/verify/:verification/:token*', 'Admin/AuthController.verification')
}).middleware('nonuser')

Route.group('nonadmin', function() {
  Route.get('manage/login', 'Admin/AuthController.login')
  Route.post('manage/login', 'Admin/AuthController.login')
}).middleware('nonadmin')

Route.get('seed', 'Admin/SeedController.create')
Route.get('calendar', 'Api/EventController.calendar')
Route.post('send-test', 'Api/GeneralController.sendNotif')
Route.get('staffs', 'Api/GeneralController.staffs')
Route.get('management/:id/timesheet/current', 'Api/PaymentController.currentTimesheet')
Route.get('timesheet/:id', 'Api/PaymentController.getTimesheet')
Route.post('save-staff-assignment/:id', 'Api/StaffController.saveAssignment')
