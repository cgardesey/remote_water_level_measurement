'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestionSchema extends Schema {
    up() {
        this.create('questions', (table) => {
            table.increments()

            table.string('questionid');
            table.string('question');
            table.longText('picture');
            table.string('videopath');
            table.string('answer');
            table.integer('isfirstquestion');
            table.integer('islastquestion');
            table.integer('ismcq');
            table.integer('isfirstmcq');
            table.integer('islastmcq');
            table.integer('isendofquestion');

            table.timestamps()
        })
    }

    down() {
        this.drop('questions')
    }
}

module.exports = QuestionSchema
