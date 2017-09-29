const Env = use('Env')

module.exports = {
  host: Env.get('MONGO_HOST', 'localhost'),
  port: Env.get('MONGO_PORT', '27017'),
  user: Env.get('MONGO_USER', 'attenderadmin'),
  pass: Env.get('MONGO_PASS', 'adminpass'),
  db: Env.get('MONGO_DATABASE', 'attender')
}

// url: 'mongodb://bbadmin:bbpass@localhost:27017/barbeacon',
