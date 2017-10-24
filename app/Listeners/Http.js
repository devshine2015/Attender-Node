'use strict'

const Env = use('Env')
const Youch = use('youch')
const Http = exports = module.exports = {}

/**
 * handle errors occured during a Http request.
 *
 * @param  {Object} error
 * @param  {Object} request
 * @param  {Object} response
 */
Http.handleError = function * (error, request, response) {
  const status = error.status || 500

  /**
   * DEVELOPMENT REPORTER
   */
  if (Env.get('NODE_ENV') === 'development') {
    const youch = new Youch(error, request.request)
    const type = request.accepts('json', 'html')
    const formatMethod = type === 'json' ? 'toJSON' : 'toHTML'
    const formattedErrors = yield youch[formatMethod]()
    response.status(status).send(formattedErrors)
    return
  }

  /**
   * PRODUCTION REPORTER
   */
  console.error(error.stack)
  yield response.status(status).sendView('errors/index', {error})
}

/**
 * listener for Http.start event, emitted after
 * starting http server.
 */
Http.onStart = function () {
  const View = use('View')
  const moment = require('moment')

  View.global('yearNow', moment().format('YYYY'))
  
  View.global('formatTime', (time) => {
    return moment(time).calendar()
  })

  View.global('readableDate', (time) => {
    return moment(time).format('dddd MMM DD YYYY')
  })

  View.global('ago', (time) => {
    return moment(time).calendar()
  })
  View.global('from', (time) => {
    return moment(time).fromNow()
  })
  View.global('until', (time) => {
    return moment(time).toNow(true)
  })
  View.global('trial', (time) => {
    return moment(time).format('DD MMM')
  })
  View.global('staff_descriptions', [
    'nightowl', 'mixologist', 'hardworker', 'productive',
    'proactive', 'professional', 'quick', 'fast', 'manager',
    'outgoing', 'patient', 'hipster', 'rocker', 'fun', 'active',
    'positive', 'sporty', 'quirky', 'metalhead', 'raver', 'honest',
    'vibrant', 'funny', 'artistic', 'strong', 'sophisticated', 'suit',
    'skilled', 'flexible', 'leader', 'inventive', 'awesome', 'muso',
    'committed', 'social', 'friendly', 'traditional', 'green',
  ])
  View.global('staff_languages',[
      'English', 'German', 'French', 'Japanese', 'Spanish', 'Portuguese',
      'Chinese', 'Indian', 'Arabic', 'Korean', 'Thai', 'Filipino',
      'Indonesian', 'Swedish', 'Finnish', 'Norweigan', 'Vietnamese', 'Greek',
      'Turkish', 'Russian', 'Nepali', 'Polish', 'Dutch', 'Czech'
  ])
  View.global('staff_certificates', [
      'Driver\'s License',
      'Responsible Service of Alcohol (RSA)',
      'Responsible Conduct of Gambling (RCG)',
      'Diploma of Hospitality Management',
      'Certificate 2 in Hospitality',
      'Certificate 3 in Hospitality',
      'Certificate 4 in Hospitality',
      'Certificate 3 in Events',
      'Accredited cocktail course',
      'Accredited food handling course',
      'Accredited food safety supervision',
      'Accredited Barista course',
      'Relevant Safety Certification',
      'First Aid Certification',
      'Working with children',
      'Police check',
      'Forklift licence',
  ])
  View.global('staff_positions', [
    'bartender', 'manager', 'waiter / waitress', 'chef / kitchen hand'
  ])
  View.global('venue_types', ['cafe', 'restaurant', 'bar', 'club', 'pub'])
  View.global('venue_services', ['alcohol', 'drinks', 'food', 'pokies', 'cocktails', 'breakfast', 'lunch', 'dinner', 'hotel'])
}
