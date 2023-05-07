'use strict'

class StoreSubscription {
    get validateAll () {
        return true
    }

    get rules () {
        return {
            'name' : 'required|min:3',
            'description' : 'required|in:1 day @ GHC1.00,7 days @ GHC5.00,30 days @ GHC20.00',
            'mobileno' : 'required|regex:[0-9]{12}',
        }
    }

    /*get messages () {
        return {
            'required': 'The {{ field }} is required',
            'min:3': 'The {{ field }} must be at least 3 characters',
            'min:10': 'The {{ field }} must be at least 10 characters'
        }
    }*/

    /*async fails(error) {
        this.ctx.session.withErrors(error)
            .flashAll();

        return this.ctx.response.redirect('back')
    }*/

    /*async fails(errorMessages) {
        console.log(errorMessages)
        return this.ctx.response.send('errorMessages')
    }*/
}

module.exports = StoreSubscription
