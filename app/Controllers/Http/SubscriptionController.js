'use strict'

const Subscription = use('App/Models/Subscription')
const randomString = require('random-string')
const axios = require('axios');
const sha256 = require('js-sha256');
const Ws = use('Ws')
const SubscriptionApiPath = 'http://136.243.33.155:8080/2ctv/examdebit';

class SubscriptionController {

    async show({view, auth, response}) {
        if (auth.user.timeremaining === 0) {
            const subscription = await Subscription.query().where('subscriptionstatus', 'pending approval').first()
            const pending_subscription_exists = subscription === null ? false : true
            return view.render('subscription/show', {pending_subscription_exists: pending_subscription_exists})
        } else {
            return response.route('passco')
        }
    }

    async store({view, request, response, session, auth}) {
        let desciption = request.input('description');

        let chargeamount = desciption.substr(desciption.indexOf('C') + 1)
        let time = (desciption.substr(0, desciption.indexOf(' '))) * 24 * 3600;

        const subscription = await Subscription.create({
            name: request.input('name'),
            description: request.input('description'),
            mobileno: request.input('mobileno'),
            user_id: auth.user.id,
            paymentid: randomString({length: 8}),
            chargeamount: chargeamount,
            time: time
        });

        let token = sha256(subscription.$attributes.id + request.input('mobileno') + chargeamount + 'test@123')
        const res = await axios.post(`${SubscriptionApiPath}?mobileno=${request.input('mobileno')}&customername=${request.input('name')}&description=${request.input('description')}&amount=${chargeamount}&paymentid=${subscription.$attributes.id}&token=${token}&token=${token}&vendorid=exampay`)
        const retrieved_subscription = await Subscription.find(subscription.$attributes.id)
        retrieved_subscription.message = res.data.responseMessage
        console.log(res.data)

        try {
            if (JSON.parse(res.data.responseMessage).responseMessage === 'Processing payment') {
                retrieved_subscription.subscriptionstatus = 'pending approval'
            }
        } catch (e) {
            session.flash({
                notification: {
                    type: 'danger',
                    message: res.data.responseMessage
                }
            })
            retrieved_subscription.subscriptionstatus = 'failed'
        } finally {
            await retrieved_subscription.save()
            return response.redirect('back')
        }
    }

    /*async examdebit({request}) {
        return request.post();
    }*/

    async update({response, request, params, auth}) {
        const value = await Subscription
            .query()
            .where('paymentid', params.paymentid)
            .update(request.post())

        /*if ('message' in request.post()) {
            Ws
                .getChannel('timer')
                .topic('timer')
                .broadcast('subscription-response_' + auth.user.id, request.input('description'))
        }*/
        return request.post();
    }
}

module.exports = SubscriptionController
