'use strict'

class HomeController {

  * index (req, res) {
    yield res.sendView('master', { welcome: true })
  }

}

module.exports = HomeController
