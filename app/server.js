const WebSocket = require('ws')

const server = new WebSocket.Server({ port: 8080 })

const findArrayIndex = (array, element) => {
    return array.findIndex(obj => {
        if(JSON.stringify(obj) == JSON.stringify(element)){
            return true
        }
    })
}

const findArrayCount = (array, target) => {
    let count = 0
    for(element of array){
        if(element == target){
            count++
        }
    }
    return count
}

const serverClients = (server, data) => {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            let roomId = [`roomId_${data.roomId}`]

            rooms[roomId].playersId.forEach(playerID => {
                if(playerID == client.id){
                    if(rooms[roomId].serversID.length == 0){
                        rooms[roomId].serversID.push(client)
                    } else{
                        rooms[roomId].serversID.forEach(serverPlayer => {
                            if(serverPlayer != client){
                                rooms[roomId].serversID.push(client)
                            }
                        });
                    }
                }
            });

            if(rooms[roomId].playersId.length > 1){
                rooms[roomId].serversID.forEach(player => {
                    player.send(`Hi by ${player.id}`)
                });
            }
        }
    });
    console.log(playerData)
    console.log(rooms)
}

let playerData = []
let rooms = {}

server.on('connection', wsClient => {
    console.clear()
    let unicueId = 0;
    let dataObject
    wsClient.send("Connection open");


    wsClient.on('message', message => {
        try {
            dataObject = JSON.parse(message);
            unicueId = dataObject.playerId

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
        } catch (error) {
            console.error('Invalid JSON:', message);
        }

        try{
            const roomId = `roomId_${dataObject.roomId}`
            if(typeof rooms[roomId] == 'undefined'){
                rooms[roomId] = {
                    playersId : [],
                    serversID : []
                }
            }

            try{
                let idPlayer = findArrayIndex(rooms[`roomId_${dataObject.roomId}`].playersId, unicueId)
    
                if(idPlayer == -1) {
                    rooms[`roomId_${dataObject.roomId}`].playersId.push(unicueId)
                }
            } catch(error){
                console.log("error from adding id player")
            }
        } catch(error){
            console.log("There is already such a room")
        }

        wsClient.send(`Your unicueServerID: ${unicueId}`)

        wsClient["id"] = unicueId
        serverClients(server, dataObject)
    });

    wsClient.on('close', () => {
        try {
            let dataId = findArrayIndex(playerData, dataObject)
            playerData.splice(dataId, 1)

            let dataIdInRoom = findArrayIndex(rooms[`roomId_${dataObject.roomId}`].playersId, dataObject.playerId)
            rooms[`roomId_${dataObject.roomId}`].playersId = rooms[`roomId_${dataObject.roomId}`].playersId.splice(dataIdInRoom, 1)
        } catch(error){
            console.log("error of deleting")
        }
        console.clear()
        console.log(playerData);
        console.log(rooms);
    })


    // Отправка списка клиентов всем подключенным клиентам
    
});

// удалить клиента с rooms.room_NUM.serversId