'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AttendanceSchema extends Schema {
    up() {
        this.create('attendances', (table) => {
            table.increments()

            table.string('attendanceid');
            table.string('audioid');
            table.string('type');
            table.integer('duration');
            table.string('studentid');

            table.timestamps()
        })
    }

    down() {
        this.drop('attendances')
    }
}

module.exports = AttendanceSchema
