const WebSocket = require('ws')

const server = new WebSocket.Server({ port: 8080 })

let players = []

server.on('connection', wsClient => {
    wsClient.send("Connection open");

    wsClient.on('message', message => {
        try {
            const dataObject = JSON.parse(message);
            players.push(dataObject)

            players.forEach(player => {
                if(JSON.stringify(player) == JSON.stringify(dataObject)){
                    console.log("There is already such a user!") 
                    
                } else{
                    players.push(dataObject)
                }
            });
            // это фиксить

            console.log(players);
        } catch (error) {
            console.error('Invalid JSON:', message);
        }
    });

    // // Отправка списка клиентов всем подключенным клиентам
    // server.clients.forEach(client => {
    //     if (client !== wsClient && client.readyState === WebSocket.OPEN) {
    //         client.send("New client connected");
    //     }
    // });
});

