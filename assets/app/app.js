// connecting to WebSocket
const wsServer = new WebSocket(`ws://${location.hostname}:8080`)

const styleLog = 'background: #2B2C4B; color: #F72856; padding: 6px 12px; font-size: 32px; font-weight: bold; '

// select element in document
const select = (obj) => document.querySelector(obj)

// select elements in document
const selectAll = (objs) => document.querySelectorAll(objs)

// set css properties on the object 
const setCss = (obj, params) => {for(p in params) obj.style[p] = params[p]}

// recognize/get the css properties of an object
const getCss = (obj, params) => obj.style[params]

// recognize/get the number of css properties of an object
const Num = (num, px) => Number(num.split(px))

// create element in document
const create = (element) => document.createElement(element)

// set classes of an object
const setClass = (obj, classes) => obj.classList += classes

// remove class of an object
const removeClass = (obj, classes) => obj.classList.remove(classes)

// The maximum is inclusive and the minimum is inclusive
const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
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

// create scripts and styles tags in DOM
const createScripts = () => {
    // getting time for linkinking scripts and styles
    const timeStamp = new Date().getTime()

    // creating scripts and styles
    document.querySelector("#appCss").href = `assets/app/app.css?t=${timeStamp}`
    
    document.querySelector("#gameStyles").href = `assets/styles/gameStyles.css?t=${timeStamp}`

    document.querySelector("#settingsApp").src = `assets/scripts/settingsApp.js?t=${timeStamp}`

    document.querySelector("#appJS").src = `assets/app/app.js?t=${timeStamp}`

    createRoom()
    createPlayer()
    new settingsApp()
}

// Creating room id and put it in cookie
const createRoom = () => {
    const nameRoomId = "id-room";
    const count = "count"
    let roomId = sessionStorage.getItem(nameRoomId);

    if((location.search == "" && location.href + location.search == location.href) || location.search.split(`?${nameRoomId}=`)[1].split("").length != 6){
        if (!roomId) {
            roomId = getRandomIntInclusive(100000, 999999);
            sessionStorage.setItem(count, 1)
        } else{
            sessionStorage.setItem(count, 1)
            if(sessionStorage.getItem(count) == '1'){
                sessionStorage.setItem(count, 2)
                Url = new URL(location.protocol + location.host + location.pathname);
                Url.searchParams.append("id-room", roomId);
                location.href = Url.href;
                sessionStorage.removeItem(count)
            }
        }

        if(sessionStorage.getItem(count) == '1'){
            sessionStorage.setItem(count, 2)
            Url = new URL(location.protocol + location.host + location.pathname);
            Url.searchParams.append("id-room", roomId);
            location.href = Url.href;
            sessionStorage.removeItem(count)
        }

    } else{
        roomId = location.search.split(`?${nameRoomId}=`)[1]
    }
    sessionStorage.setItem(nameRoomId, roomId);
    
    if(document.cookie.split("show-cookie=")[1] == undefined) document.cookie = encodeURIComponent("show-cookie") + "=" + encodeURIComponent("true")
    document.cookie = encodeURIComponent("id-room") + '=' + encodeURIComponent(sessionStorage.getItem(nameRoomId));
    console.log(`%c ID-Room: ${sessionStorage.getItem('id-room')} `, styleLog);
}

// Creating player id
const createPlayer = () => {
    const namePlayerId = "playerId"
    let playerId = sessionStorage.getItem(namePlayerId)

    if(!playerId){
        playerId = getRandomIntInclusive(1000000, 9999999)
        sessionStorage.setItem(namePlayerId, playerId)
    }
    console.log(`%c Your ID: ${sessionStorage.getItem('playerId')} `, styleLog);

    serverSend()
}

// WebSocket communication
const serverSend = () => {
    let infoID = {playerId: Number(sessionStorage.getItem('playerId')),roomId: Number(sessionStorage.getItem("id-room"))}
    wsServer.onopen = () => {
        // Sending a message to the server
        wsServer.send(JSON.stringify(infoID)); 
    };

    // Receiving messages from the server
    wsServer.onmessage = event => {
        try{
            const message = JSON.parse(event.data)
            console.log(message);
        } catch(error){
            console.log(`%c ${event.data}`, styleLog)
        }
    };
    
    wsServer.onclose = () => {
        console.log("Connection with server is closed");
    }
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', createScripts)