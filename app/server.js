const WebSocket = require('ws')

const server = new WebSocket.Server({ port: 8080 })

let players = []

server.on('connection', wsClient => {
    wsClient.send("Connection open");

    wsClient.on('message', message => {
        try {
            const dataObject = JSON.parse(message);

            if(players.length != 0){
                if(players.some(obj => {
                    if(JSON.stringify(obj) == JSON.stringify(dataObject)){
                        return true
                    } else{
                        return false
                    }
                }) == true){
                    console.log("There is already such a user!");
                } else{
                    players.push(dataObject)
                }
            } else{
                players.push(dataObject)
            }
            console.log(players);
        } catch (error) {
            console.error('Invalid JSON:', message);
        }
    });

    // Отправка списка клиентов всем подключенным клиентам
    server.clients.forEach(client => {
        if (client !== wsClient && client.readyState === WebSocket.OPEN) {
            client.send("New client connected");
        }
    });
});

