# Attender API
____

### GUIDE

**Url** - https://attender.com.au/api/

**Platform** - `NodeJs`

**Framework** - `AdonisJs 3.2`

**Type** - `JSON`

**API Token** - an authentication token used on some api endpoints to validate user request with header key `x-request-token` or parameter `token`

**Response** - `status(bool)` indicates if the request is successful or not, usually partnered with `messageCode(string)` or `message(string)`. `error(obj)` indicates server error.


---
## AUTHENTICATION AND REGISTRATION


`GET` **auth/current**
> Get user data, includes staff,organiser, and venue data

###### Optional Parameters

* `deviceToken` - Device token, used for push notification purposes

* `deviceType` - Device type, used to identify the user's device type. `ios` for iOS Devices and `android` for Android Devices

`POST` **auth/login**
> Default login

###### Payload
* `email` - User email

* `password` - User password

###### Optional Payload

* `deviceToken` - Device token, used for push notification purposes

* `deviceType` - Device type, used to identify the user's device type. `ios` for iOS Devices and `android` for Android Devices


`POST` **auth/login/facebook**
> Login using facebook credentials

###### Payload
* `id` - Facebook user id

`POST` **auth/login/google**
> Login using google credentials

###### Payload
* `id` - Google user id

* `email` - Google user email


`POST` **auth/register**
> Default user registration

###### Payload
* `email` - User's email, must be unique.

* `password` - User's password

* `fullname` - User's fullname

* `mobile` - User's mobile number


`POST` **auth/register/facebook**
> Register user using [Facebook](https://facebook.com) credentials

###### Payload
* `id` - Facebook user ID

* `name` - Facebook user name

* `gender` - Facebook user gender

* `accessToken` - Facebook user token

`POST` **auth/register/google**
> Register user using [Google](https://google.com) credentials

###### Payload
* `id` - Google user ID

* `idToken` - Google user id token

* `accessToken` - Google user access token

* `accessTokenExpirationDate` -

* `email` - Google user email

* `name` - Google user complete name

* `givenName` - Google user first / given name

* `familyName` - Google user last name / surname


`POST` **auth/confirm**
> Check if the email is already verified. Can only be used once.

###### Payload
* `email` = User email


`POST` **api/auth/verify**
> Email verification using mobile device

##### Payload
* `token` - Verification token

* `verification` - Verification code

`POST` **api/auth/resend**
> Resend email verification

---

## USERS

`GET` **users**
> List all users

`GET` **user/profile/staff**  
> Get staff profile

`POST` **user/profile/staff**  
> Save or update staff profile

###### Payload

* `avatar` *(String)* - Avatar url from cloudinary

* `description` *(String/Joined Array)* - Staff's description in 3 word. Example `Mixology,Hard Working,Nightology`

* `position` *(String/Joined Array)* - Staff's positions. Example `bartender,waiter`

* `skills` *(String/Joined Array)* - Staff's Skills

* `experiences` *(String/JSON Stringified)* - Staff's Work Experiences. Example `"[{'company': 'Jollibee'...}]"`

* `certificates` *(String/Joined Array)* - Staff's certificates

* `licenses` *(String/Joined Array)* - Staff's licenses

* `languages` *(String/Joined Array)* - Staff's licenses

* `availability` *(String/JSON Stringified)* - Staff's availability. Example `"{'Monday': {'morning': true, 'afternoon': false, 'evening': false}...}"`

* `birthdate` *(String/Date)* - Staff's birthdate. Example format `DD/MM/YYYY`


`GET` **user/profile/venue**
> Get venue profile

`POST` **user/profile/venue**
> Save or update venue profile

###### Payload

* `name` *(String)* - Venue name

* `managerName` *(String)* - Manager's name

* `image` *(String)* - Venue image url from cloudinary

* `info` *(String)* - Venue info

* `tag1` *(String)* - Venue tag 1

* `tag2` *(String)* - Venue tag 2

* `numberEmployees` *(String)* - Venue number of numberEmployees

* `locationName` *(String)* - Venue location name

* `location` *(String/Joined Array)* - Venue location coordinates. Example format `longitude,latitude`

* `services` *(String/Joined Array)* - Venue services. Example `breakfast,dinner,lunch`

* `socialMedia` *(String/JSON Stringified)* - Not yet implemented

* `staffOfInterest` *(String/JSON Stringified)* - Not yet implemented


`GET` **user/profile/organizer**
> Get organiser profile

`POST` **user/profile/organizer**
> Save or update organiser profile

###### Payload

* `name` *(String)* - Organiser name

* `isCompany` *(String)* - Indicator if the organiser is run by company. Example, `1` - true, `0` - false

* `companyName` *(String)* - Event organiser company name

* `locationName` *(String)* - Event organiser location name

* `about` *(String)* - Event organiser info

* `image` *(String)* - Event organiser image url from cloudinary

* `location` *(String/Joined Array)* - Event organiser location. Example format `longitude,latitude`

* `eventType` *(String/Joined Array)* - Event type. Example `Wedding,Conference`

---

## STAFFS

`GET` **staffs**
> List all staffs

`GET` **staff/{staff_id}/show**
> Get staff data

`GET` **staff/{staff_id}/managements**
> List all staff Attender employment history

`GET` **staff/{staff_id}/reviews**
> List all staff Attender employment reviews

`GET` **staff-notifications**
> List all staff notifications

`GET` **trial-staffs**
> List all employer staffs that are on trial mode

`GET` **active-staffs**
> List all employer staffs that are currently active

`POST` **trial/{staff_id}**
> Set staff into trial mode

`POST` **direct-hire/{staff_id}**
> Hire staff directly

`POST` **hire/{staff_id}**
> Hire staff from trial mode

`POST` **remove-staff/{staff_id}**
> Permanently delete staff record from employer management.

`POST` **add-task/{management_id}**
> Add task to staff

###### Payload
* `description` *(String)* - Task description

* `management_id` *(Url Param)* - Employer's staff management id

`POST` **task/{task_id}/edit**
> Edit staff task

###### Payload
* `description` *(String)* - Task description

* `task_id` *(Url Param)* - Staff's task id

`POST` **task/{task_id}/delete**
> Delete staff task

###### Payload
* `task_id` *(Url Param)*  - Staff's task id

`POST` **add-suggestion/{management_id}**
> Add suggestion to staff

###### Payload
* `description` *(String)* - Suggestion description

* `management_id` *(Url Param)*  - Employer's staff management id

`POST` **suggestion/{suggestion_id}/edit**
> Edit staff suggestion

###### Payload
* `description` *(String)* - Suggestion description

* `suggestion_id` *(Url Param)*  - Staff's suggestion id

`POST` **suggestion/{suggestion_id}/delete**
> Delete staff suggestion

###### Payload
* `suggestion_id` *(Url Param)*  - Staff's suggestion id


`POST` **add-rating/{type}/{management_id}**
> Add staff rating

###### Payload
* `overall` *(String)* - Over all rating

* `review` *(String)* - Review message (Optional)

* `items` *(String/JSON Stringified)* - Monthly review items

* `type` *(Url Param)*  - `monthly` or `daily`

* `management_id` *(Url Param)*  - Staff's management id

`POST` **rating/{rating_id}/edit**
> Edit staff rating

###### Payload
* `overall` *(String)* - Overall rating

* `items` *(String/JSON Stringified)* - Monthly review items

* `rating_id` *(Url Param)*  - Rating id

`POST` **save-staff-sched/{management_id}**
> Save or update staff schedule

##### Payload
* `schedules` *(String/JSON Stringified)* - Staff schedule

* `management_id` *(Url Param)*  - Staff's management id

`POST` **save-staff-assignment/{management_id}**
> Save or update staff assignments (Task and Suggestion)

##### Payload
* `assignments` *(String/JSON Stringified)* - Staff tasks and suggestions

* `management_id` *(Url Param)*  - Staff's management id


`POST` **add-staff/{staff_id}/event/{event_id}**
> Add staff to employer's event

##### Payload
* `staff_id` *(Url Param)*  - Staff's id

* `event_id` *(Url Param)*  - Event's id


`POST` **remove-staff/{management_id}/event/{event_id}**
> Remove staff from employer's event

##### Payload
* `staff_id` *(Url Param)*  - Staff's id

* `event_id` *(Url Param)*  - Event's id

`GET` **my-managements**
> Get all staff current Attender employment

---

## EMPLOYER (EVENT ORGANISER / VENUE)

`GET` **my-staffs**
> List all active and trial mode employer staffs

`GET` **venue/notifications**
> List all venue notifications

`POST` **venue/notification/{notification_id}/delete**
> Delete a notification

##### Payload
* `notification_id` *(Url Param)*  - Notification id

`GET` **venue/interested**
> List all interested staff on employers venue

`POST` **venue/{venue_id}/interest**
> Point an interest on a venue using user with a staff profile

##### Payload
* `venue_id` *(Url Param)*  - Venue id

---

## EVENTS

`GET` **events**
> List all events

`POST` **my-events**
> List all employers event

##### Payload
* `date` *(String/Date)* - Event target date. Example format (DD/MM/YYYY)

`POST` **events**
> Create an event

##### Payload
* `name` *(String)* - Event name

* `description` *(String)* - Event description

* `image` *(String)* - Event image url from cloudinary

* `staffInterest` *(String/JSON Stringified)* - List of target staff position in event

* `date` *(String/Date)* - Event target date. Example format (DD/MM/YYYY)

* `startTime` *(String/Time)* - Event start time. Example format (HH:MM A)

* `endTime` *(String/Time)* - Event end time. Example format (HH:MM A)

`GET` **events/{event_id}/interested**
> List all interested staffs on an event

##### Payload
* `event_id` *(Url Param)* - Event id

`POST` **events/{event_id}/interest**
> Point an interest on an event

---

## MESSAGING

`GET` **conversation/{conversation_id}**
> List all messages in a conversation (Staff <-> Employer)

##### Payload
* `conversation_id` *(Url Param)* - Conversation id

`POST` **conversation/{conversation_id}/delete**
> Delete all user's copy of messages in a conversation (Staff <-> Employer)

##### Payload
* `conversation_id` *(Url Param)* - Conversation id


`POST` **conversation/{conversation_id}/archive**
> Archive all user's copy of messages in a conversation (Staff <-> Employer)

##### Payload
* `conversation_id` *(Url Param)* - Conversation id


`POST` **conversation/{conversation_id}/restore**
> Restore all archived messages in a conversation (Staff <-> Employer)

##### Payload
* `conversation_id` *(Url Param)* - Conversation id

`GET` **open-convo/{staff_user_id}**
> Get conversation id for staff and check if staff is already employed in employer's managment

##### Payload
* `staff_user_id` *(Url Param)* - Staff's user id

`POST` **new-staff-message**
> Send staff a message using employer profile

##### Payload
* `receiver` - Staff user id

* `staff` - Staff id

* `message` - Message body

`POST` **new-venue-message**
> Send employer a message using staff profile

##### Payload
* `receiver` - Staff user id

* `venue` - Employer id

* `message` - Message body

`GET` **staff-messages**
> List all staff conversations

`GET` **venue-messages**
> List all employer conversations

`GET` **staff-archives**
> List all staff archives

`GET` **venue-archives**
> List all employer archives



---
## PAYMENT AND STAFF MANAGEMENT

`GET` **earnings**
> Get staff's current earnings

`GET` **transactions**
> List all user promisepay transactions

`GET` **cards**
> List all user credit cards

`POST` **add-card**
> Enroll credit card on a user

##### Payload
* `account_name` *(String)* - Full name of card holder. (Must include space)

* `account_number` *(String)* - Card number

* `expiry_month` *(String/Month)* - Card expiration month. Example `1` for January

* `expiry_year` *(String/Year)* - Card expiration year. Example format (YYYY)

* `cvv` *(String)* - Card CVV/CVC

`POST` **remove-card/{card_promise_id}**
> Remove card from attender record and redact credit card on promisepay

##### Payload
* `card_promise_id` *(Url Param)* - Card id provided by promisepay

`GET` **banks**
> List all user banks

`POST` **add-bank**
> Enroll bank on a user

##### Payload
* `bank_name` *(String)* - Bank name

* `account_name` *(String)* - Full name of bank account holder. (Must include space)

* `account_number` *(String)* - Bank account number

* `routing_number` *(String)* - Bank account routing Number

* `account_type` *(String)* - Bank account type. Example: `savings`

* `holder_type` *(String)* - Bank account holder type. Example `personal` or `business`

`POST` **remove-bank/{bank_promise_id}**
> Remove bank from attender record and redact bank account on promisepay

##### Payload
* `bank_promise_id` *(Url Param)* - Bank id provided by promisepay

`POST` **withdraw**
> Withdraw funds from promisepay

##### Payload
* `account_id` *(String)* - Bank account promise id. (Optional) Will use user's primary account if not set.

* `amount` *(String/Number)* - Amount to withdraw

`POST` **transfer**
> Transfer funds on promisepay user

##### Payload
* `to_user` *(String)* - Target user id to transfer funds

* `amount` *(String)* - Target amount to transfer

* `from` *(String)* - Account type to use. Example `bank` for bank account, `card` for credit card.

* `account_id` *(String)* - Account id provided by promisepay

`GET` **management/{management_id}/timesheet/current**
> Get the current timesheet of the week for staff management. Will initialize new timesheet if not found

`GET` **timesheet/{timesheet_id}**
> Get timesheet data

##### Payload
* `timesheet_id` *(Url Param)* - Timesheet id

`POST` **timesheet/{timesheet_id}/{action}**
> Update staff management timesheet

##### Payload
* `timesheet_id` *(Url Param)* - Timesheet id

* `action` *(Url Param)* - Action to be used to update. Example `rate` - update payment rate, `payable` - update staff's payable hours, `hours` - update payable days, `make_payment` - create a payment for the timesheet

* `amount` *(String/Number)* - If action is `make_payment`, amount will be needed to proceed on payment.

* `account_id` *(String)* - If action is `make_payment`, account id will be needed to proceed on payment. Bank account id provided by promise pay

---
## REFERENCE


[AdonisJs 3.2](https://adonisjs.com/docs/3.2/overview)

[Mongoose API](http://mongoosejs.com/)

[Promisepay / Assembly API Documentation](reference.assemblypayments.com/)

---
## SERVER AND INSTALLATION

Required packages for deployment
* **pm2** (Serve's node application)

* **nginx**

* **node/npm**



Install node packages
```bash
$ npm install
```

Start node server
```bash
$ pm2 start server.js
```

Restart node server. (Used if server is already running)
```bash
$ pm2 restart server.js
```

Check node server status
```bash
$ pm2 status
```
