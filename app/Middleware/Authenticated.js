'use strict'

class Authenticated {
  async handle ({ request, auth, response }, next) {
    try {
      await auth.check()

      // return response.redirect('back')
      return response.route('passco')
    } catch (error) {
      await next()
    }
  }
}

module.exports = Authenticated
