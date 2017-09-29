'use strict'

class HomeController {

  * index (req, res) {
    yield res.sendView('master')
  }

}

module.exports = HomeController
