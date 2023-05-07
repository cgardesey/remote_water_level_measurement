'use strict'
const User = use('App/Models/User')
const Database = use('Database')
const {v4: uuidv4} = require('uuid');

class ChatController {
    constructor({socket, request, auth}) {
        this.socket = socket
        this.request = request
        this.auth = auth
        this.starttime = new Date()
        this.type = request.header('type')
        this.studentid = request.header('studentid')
        this.sessionid = request.header('sessionid')
        console.log(`Token: ${request.header('sessionid')}`)
    }

    async onUserConnected() {

    }


    onMessage(message) {
        this.socket.broadcastToAll('message', message)
    }

    async onClose() {
        if (typeof this.type !== 'undefined' && typeof this.studentid !== 'undefined' && typeof this.sessionid !== 'undefined') {
            console.log(`User disconnected!`)
            const currentDate = new Date()
            let date = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate();
            const attendances = await Database.from('attendances')
                .where('sessionid', this.sessionid)
                .where('type', this.type)
                .where('created_at', 'like', `${date}%`)
            // console.log(`${attendances.length > 0} ${attendances[0].length > 0} ${attendances[0].sessionid}`)
            let duration = (new Date() - this.starttime) / 1000;

            if (attendances.length > 0 && attendances[0].sessionid == this.sessionid) {
                // console.log('if')
                const affectedRows = await Database
                    .table('attendances')
                    .where('sessionid', this.sessionid)
                    .where('type', this.type)
                    .where('created_at', 'like', `${date}%`)
                    /*.where(
                        {
                            sessionid: this.sessionid,
                            type: this.type
                        }
                    )*/
                    .update('duration', attendances[0].duration + duration)
            } else {
                // console.log('else')
                const id = await Database
                    .table('attendances')
                    .insert({
                        attendanceid: uuidv4(),
                        sessionid: this.sessionid,
                        type: this.type,
                        studentid: this.studentid,
                        duration: duration,
                        created_at: date + " " + currentDate.getHours() + "-" + (currentDate.getMinutes()) + "-" + currentDate.getSeconds(),
                        updated_at: date + " " + currentDate.getHours() + "-" + (currentDate.getMinutes()) + "-" + currentDate.getSeconds()
                    })
            }

        } else if (typeof this.sessionid !== 'undefined') {
            let table = this.type == 'video' ? 'class_video_sessions' : 'class_audio_sessions'

            const affectedRows = await Database
                .table(table)
                .where('sessionid', this.sessionid)
                .delete()
        }

    }
}

module.exports = ChatController
