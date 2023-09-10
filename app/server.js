const WebSocket = require('ws')

const server = new WebSocket.Server({ port: 8080 })

let playerData = []
let rooms = {}

server.on('connection', wsClient => {
    let unicueId = null;
    wsClient.send("Connection open");

    wsClient.on('message', message => {
        try {
            const dataObject = JSON.parse(message);

            if(playerData.length != 0){
                if(playerData.some(obj => {
                    if(JSON.stringify(obj) == JSON.stringify(dataObject)){
                        return true
                    } else{
                        return false
                    }
                }) == true){
                    console.log("There is already such a user!");
                } else{
                    playerData.push(dataObject)
                }
            } else{
                playerData.push(dataObject)
            }
            unicueId = dataObject.playerId
            let roomId = `roomId_${dataObject.roomId}`
            wsClient.send(roomId)
            wsClient.send(JSON.stringify(dataObject))
            wsClient.send(`Your unicueServerID: ${unicueId}`)
            console.log(playerData);

            
            if(typeof rooms[roomId] == 'undefined'){
                rooms[roomId] = []
                rooms.roomId.push(unicueId)
            } else{
                rooms.roomId.push(unicueId)
            }
            console.log(JSON.stringify(rooms));
        } catch (error) {
            console.error('Invalid JSON:', message);
        }
    });


    // Отправка списка клиентов всем подключенным клиентам
    // server.clients.forEach(client => {
    //     if (client !== wsClient && client.readyState === WebSocket.OPEN) {
    //         // console.log(client);
    //         wsClient.send(JSON.stringify(client))
    //         wsClient.send("New client connected");
    //     }
    // });
});

