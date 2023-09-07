// const { log } = require("console")

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

// connecting to WebSocket
const ws = new WebSocket(`ws://localhost:8080`)

// The maximum is inclusive and the minimum is inclusive
const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
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
}

// Creating room id and put it in cookie
const createRoom = () => {
    const nameRoomId = "id-room";
    const count = "count"
    let roomId = sessionStorage.getItem(nameRoomId);

    if (!roomId) {
        roomId = getRandomIntInclusive(100000, 999999);
        sessionStorage.setItem(nameRoomId, roomId);
        sessionStorage.setItem(count, 1)
    }

    if(sessionStorage.getItem(count) == '1'){
        sessionStorage.setItem(count, 2)
        Url = new URL(location.protocol + location.host + location.pathname);
        Url.searchParams.append("id-room", roomId);
        location.href = Url.href;
        sessionStorage.removeItem(count)
    }
    document.cookie = encodeURIComponent("id-room") + '=' + encodeURIComponent(sessionStorage.getItem(nameRoomId));
    console.log(`%c ID-Room: ${sessionStorage.getItem('id-room')} `, 'background: #2B2C4B; color: #F72856; padding: 6px 12px; font-size: 64px; font-weight: bold; ');
}

// Creating player id
const createPlayer = () => {
    const namePlayerId = "playerId"
    let playerId = sessionStorage.getItem(namePlayerId)

    if(!playerId){
        playerId = getRandomIntInclusive(100, 999)
        sessionStorage.setItem(namePlayerId, playerId)
    }
    console.log(`%c Your ID: ${sessionStorage.getItem('playerId')} `, 'background: #2B2C4B; color: #F72856; padding: 6px 12px; font-size: 64px; font-weight: bold; ');
}

const getPlayers = (object) => {
    console.log(object);

    let obj = create("div")
    setClass(obj, `player playerId_${object.playerId}`)
    select("#field").appendChild(obj) 
}

ws.onopen = () => console.log("hi!");
ws.onmessage = response => {
    if(typeof response.data == 'string'){
        console.log(response.data);
    } else{
        getPlayers(response)
    }
}  

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', event => {
    createScripts()
    new settingsApp()
})