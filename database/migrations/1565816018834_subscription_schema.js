'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubscriptionSchema extends Schema {
    up() {
        this.create('subscriptions', (table) => {
            table.increments()
            table.integer('user_id');

            table.string('paymentid')
            table.string('name')
            table.string('mobileno')
            table.float('chargeamount')
            table.string('description')
            table.text('message')
            table.string('subscriptionstatus');
            table.bigInteger('time', false, true).default(0);
            table.boolean('expired').default(false);
            
            table.timestamps()
        })
    }

    down() {
        this.drop('subscriptions')
    }
}

module.exports = SubscriptionSchema
