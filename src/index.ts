import { Elysia, t } from 'elysia'

const app = new Elysia()
    .ws('/ws', {
        body: t.Object({
            content: t.String(),
            username: t.String(),
            group: t.String()
        }),
        message(ws, message) {     
            console.log(message)
            if (!(message.content == "SWITCH GROUP" && message.username == "SYSTEM")) {
                ws.publish(`${message.group}`, JSON.stringify({ 
                    content: message.content, 
                    username: message.username, 
                    group: message.group 
                }))
                return
            }
            ws.send(JSON.stringify({ 
                content: `There are currently no groups to switch to!`,
                username: 'SERVER', 
                group: 'System'
           }))
        },
        close(ws) {
            console.log('a client disconnected')
            ws.close()
        },
        open(ws) {
            ws.subscribe('Global')
            ws.subscribe('Match')
            ws.subscribe('Team')
            ws.send(JSON.stringify({ 
                 content: 'welcome to the server!',
                 username: 'SERVER', 
                 group: 'System'
                }))
            console.log('new connection')
        }
    })
    .listen(8080)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);