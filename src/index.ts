import { Elysia, ws } from 'elysia'

const app = new Elysia()
    .use(ws())
    .ws('/ws', {
        message(ws, message) {
            console.log('message from:', ws, message)
            if (typeof message == 'string' && message.startsWith('private')) {
                ws.send('this message was private!')
                return
            }
            ws.publish('chat', message)
        },
        close(ws) {
            console.log('a client disconnected')
            ws.close()
        },
        open(ws) {
            ws.subscribe('chat')
            ws.send('welcome to the server!')
            console.log('new connection')
        }
    })
    .listen(8080)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);