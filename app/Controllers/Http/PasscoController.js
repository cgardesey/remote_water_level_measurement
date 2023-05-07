'use strict'
const Database = use('Database')
const Ws = use('Ws')
const sleep = require('system-sleep');

class PasscoController {

    passco({view, auth, response, session}) {
        return view.render('past_questions/passco')
    }

    async courses({view, auth, response, session}) {
        const coursepaths_objs = await Database
            .select('courses.coursepath')
            .from('enrolments')
            .innerJoin('instructor_courses', 'enrolments.instructorcourseid', 'instructor_courses.instructorcourseid')
            .innerJoin('courses', 'instructor_courses.courseid', 'courses.courseid')
            .where('enrolments.studentid', auth.user.userid)

        let courses = {}
        for (const coursepath_obj of coursepaths_objs){
            let coursepath = coursepath_obj.coursepath

            const results = await Database
                .raw(`SELECT DISTINCT(SUBSTRING_INDEX(SUBSTRING_INDEX(filtered_past_questions.questionid, \" >> \", 3), \" >> \", -1)) AS Years FROM (SELECT * FROM past_questions WHERE questionid LIKE '%${coursepath}%' ) AS filtered_past_questions`)

            if (results[0].length > 0) {
                let years = []
                for (const result of results[0]){
                    if (results.length > 0) {
                        years.push(result.Years)
                    }
                }
                courses[coursepath] = years;
            }
        }

        const instructor_course_ids = await Database
            .select('instructor_courses.instructorcourseid')
            .from('enrolments')
            .innerJoin('instructor_courses', 'enrolments.instructorcourseid', 'instructor_courses.instructorcourseid')
            .innerJoin('courses', 'instructor_courses.courseid', 'courses.courseid')
            .where('enrolments.studentid', auth.user.userid)

        let assignments = {}
        for (const instructor_course_id of instructor_course_ids){

            const results = await Database
                .select('courses.coursepath', 'assignments.title', 'assignments.url', 'assignments.submitdate')
                .from('assignments')
                .innerJoin('instructor_courses', 'assignments.instructorcourseid', 'instructor_courses.instructorcourseid')
                .innerJoin('courses', 'instructor_courses.courseid', 'courses.courseid')
                .where('instructor_courses.instructorcourseid', instructor_course_id.instructorcourseid)

            if (results.length > 0 ) {
                assignments[results[0].coursepath] = results[0];
            }
        }
        console.log({
            courses: courses,
            assignments: assignments
        })

        return {
            courses: courses,
            assignments: assignments
        }
    }
}

module.exports = PasscoController
