'use strict'

const PastQuestion = use('App/Models/PastQuestion')

class PastQuestionController {

    async index() {
        // response.json(await PastQuestion.all())
        return await PastQuestion.all()
    }

    async getYearPastQuestions({params}) {

        return await PastQuestion.query().where('questionid', 'LIKE', `%${decodeURIComponent(params.path)}%`).fetch()
    }

    async getCourses() {
        // response.json(await PastQuestion.all())
        return await PastQuestion.all()
    }

    /*async store({ request, response, session, auth}) {
        const job = request.all();

        const posted = await auth.user.jobs().create({
            title: job.title,
            link: job.link,
            description: job.description
        });

        session.flash({ message: 'Your job has been posted!' });
        return response.redirect('back');
    }

    async delete({ response, session, params}) {
        const job = await Job.find(params.id);

        await job.delete();
        session.flash({ message: 'Your job has been removed'});
        return response.redirect('back');
    }

    async edit({ params, view }) {
        const job = await Job.find(params.id);
        return view.render('edit', { job: job });
    }

    async update ({ response, request, session, params }) {
        const job = await Job.find(params.id);

        job.title = request.all().title;
        job.link = request.all().link;
        job.description = request.all().description;

        await job.save();

        session.flash({ message: 'Your job has been updated. '});
        return response.redirect('/post-a-job');
    }*/
}

module.exports = PastQuestionController
