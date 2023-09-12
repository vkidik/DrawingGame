const WebSocket = require('ws')
const server = new WebSocket.Server({ port: 8080 })

let playerData = []
let rooms = {}

// function for another class
const findArrayIndex = (array, element) => {
    return array.findIndex(obj => {
        if(JSON.stringify(obj) == JSON.stringify(element)){
            return true
        }
    })
}

server.on('connection', wsClient => {
    new serverWsClient(wsClient)
})

class serverWsClient{
    constructor(wsClient){
        console.clear()
        this.dataObject
        this.unicueId
        this.wsClient = wsClient

        wsClient.on('message', message => {
            try {
                this.dataObject = JSON.parse(message)
                this.unicueId = this.dataObject.playerId
            } catch (error) {
                console.error(`Invalid JSON: ${message}`)
            }
            
            this.getMessage(this.dataObject, wsClient)
        })

        wsClient.on('close', () => {this.onDisconnectPlayer(this.dataObject)})
    
        
    }

    getMessage(dataObject, wsClient){
        this.createServerPlayer(dataObject)
        wsClient["id"] = this.unicueId
        wsClient.send(`Your unicueServerID: ${this.unicueId}`)
    }
    
    createServerPlayer(dataObject){
        if(playerData.some(obj => {
            if(JSON.stringify(obj) == JSON.stringify(dataObject)){
                return true
            } else{
                return false
            }
        }) == true){
            console.error("There is already such a user!");
            console.log(playerData)
            console.log(rooms)
        } else{
            playerData.push(dataObject)

            this.createServerRoom(dataObject)
        }
    }

    createServerRoom(dataObject){
        const roomId = `roomId_${dataObject.roomId}`

        try {
            if(typeof rooms[roomId] == 'undefined'){
                rooms[roomId] = {
                    playersId : [],
                    serversID : []
                }
            }
        } catch (error) {
            console.error("There is already such a room")
        }
        
        this.createServerClients(roomId)
    }

    createServerClients(room){
        let idPlayer = findArrayIndex(rooms[room].playersId, this.unicueId)

        if(idPlayer == -1){
            rooms[room].playersId.push(this.unicueId)
            if(rooms[room].playersId.length == rooms[room].serversID.length + 1){
                rooms[room].serversID.push(this.wsClient)
            }
        }

        console.log(playerData);
        this.chatWithPlayers(room)
    }

    chatWithPlayers(room){
        console.log(rooms);
        if(rooms[room].playersId >= 2){
            rooms[room].serversID.forEach(client => {
                client.send(`Messages by ${this.unicueId}`)
            });
        }
    }

    onDisconnectPlayer(dataObject){
        const room = `roomId_${dataObject.roomId}`

        let dataIndex = findArrayIndex(playerData, dataObject)
        playerData = playerData.splice(dataIndex, 1)

        let dataIdInRoom = findArrayIndex(rooms[room].playersId, this.unicueId)
        rooms[room].playersId = rooms[room].playersId.splice(dataIdInRoom, 1)
        rooms[room].serversID = rooms[room].serversID.splice(dataIdInRoom, 1)

        if(rooms[room].playersId.length == 0){
            delete rooms[room]
        }

        console.clear()
        console.log(playerData);
        console.log(rooms)
    }
}