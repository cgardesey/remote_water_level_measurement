'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')


// Route.on('/').render('home').as('home')
// Route.on('/sample').render('past_questions/sample').as('sample')
// Route.on('/passco').render('past_questions/passco').as('passco').middleware(['auth'])

Route.get('/', 'PasscoController.passco').as('passco')
Route.get('/courses', 'PasscoController.courses').middleware(['auth'])

Route.get('register', 'Auth/RegisterController.showRegisterForm').middleware(['authenticated'])
Route.post('register', 'Auth/RegisterController.register').as('register')
Route.get('register/confirm/:token', 'Auth/RegisterController.confirmEmail')
Route.get('login', 'Auth/LoginController.showLoginForm').middleware(['authenticated'])
Route.post('login', 'Auth/LoginController.login').as('login')
Route.get('logout', 'Auth/AuthenticatedController.logout')
Route.get('password/reset', 'Auth/PasswordResetController.showLinkRequestForm')
Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail')
Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm')
Route.post('password/reset', 'Auth/PasswordResetController.reset')


Route.get('/year-past-questions/:path', 'PastQuestionController.getYearPastQuestions')


Route.post('/subscriptions', 'SubscriptionController.store').middleware(['auth']).validator('StoreSubscription')
Route.patch('/subscriptions/:paymentid', 'SubscriptionController.update')
Route.get('subscriptions', 'SubscriptionController.show').as('subscription').middleware(['auth'])

Route.get('/store-measurement', 'MeasurementController.store')
Route.get('/measurements', 'MeasurementController.index')
Route.get('/latest-measurement', 'MeasurementController.latestMeasurement')
Route.get('/measurement-schema', 'MeasurementController.schema')
Route.get('/chart', 'MeasurementController.chart')
