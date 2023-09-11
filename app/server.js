const WebSocket = require('ws')

const server = new WebSocket.Server({ port: 8080 })

const findArrayIndex = (array, element) => {
    return array.findIndex(obj => {
        if(JSON.stringify(obj) == JSON.stringify(element)){
            return true
        }
    })
}

let playerData = []
let rooms = {}

server.on('connection', wsClient => {
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
                rooms[roomId] = []
            }

            try{
                let idPlayer = findArrayIndex(rooms[`roomId_${dataObject.roomId}`], unicueId)
    
                if(idPlayer == -1) {
                    rooms[`roomId_${dataObject.roomId}`].push(unicueId)
                }
            } catch(error){
                console.log("error from adding id player")
            }
        } catch(error){
            console.log("There is already such a room")
        }

        wsClient.send(`Your unicueServerID: ${unicueId}`)
        console.log(playerData)
        console.log(rooms)

        wsClient["id"] = unicueId
        console.log(wsClient["id"]);
    });

    wsClient.on('close', () => {
        try {
            let dataId = findArrayIndex(playerData, dataObject)
            playerData.splice(dataId, 1)

            let dataIdInRoom = findArrayIndex(rooms[`roomId_${dataObject.roomId}`], dataObject.playerId)
            rooms[`roomId_${dataObject.roomId}`] = rooms[`roomId_${dataObject.roomId}`].splice(dataIdInRoom, 1)
        } catch(error){
            console.log("error of deleting")
        }

        console.log(playerData);
        console.log(rooms);
    })


    // Отправка списка клиентов всем подключенным клиентам
    server.clients.forEach(client => {
        if (client !== wsClient && client.readyState === WebSocket.OPEN) {
            let roomId = [`roomId_${dataObject.roomId}`]

            if(rooms[roomId].length != 0){
                
            }
        }
    });
});

// сделать чтоб айди добалялся в румы и также сделать чтоб при закрытие удалялось из playerData и комнат