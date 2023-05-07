'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')
const Database = use('Database')

class LoginController {
  showLoginForm ({ view }) {
    return view.render('auth.login')
  }

  async login ({ request, auth, session, response }) {
    // get form data
    const req = request.all()

    // retrieve user base on the form data
    const user = await User.query()
      .where('email', req.email)
      .where('active', true)
      .first()

    if (user) {
      // verify password

      const passwordVerified = await Hash.verify(req.password, user.password)

      if (passwordVerified) {
        // login user
        await auth.remember(!!req.remember).login(user)

        return response.route('passco')
      }
    }

    // display error message
    session.flash({
      notification: {
        type: 'danger',
        message: `Incorrect email and/or password.`
      }
    })

    return response.redirect('back')
  }
}

module.exports = LoginController
