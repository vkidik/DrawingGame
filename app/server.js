const WebSocket = require('ws')

const server = new WebSocket.Server({ port: 8080 })

let players = []

server.on('connection', ws => {
    ws.send("new connection")

    ws.on('open', event => {
        server.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN){
                players.push({playerId: ~~sessionStorage.getItem("playerId")})
                players.forEach(player => {
                    ws.send(player)
                });
            }
        });
    })
})