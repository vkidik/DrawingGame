// class Settings for data of game
class settingsApp{
    constructor(){
        // inputs
        this.inputName = select("#username")
        this.inputColor = select("#color")
        this.inputID = select("#id-room")
        // buttons
        this.connectBtn = select("#game > div.game > div.form > form.connect > button")
        this.createBtn = select("#game > div.game > div.form > form.create > button")
        this.cookieBtn = select(".cookie .btn")
        // start Inner function for data input
        createRoom()
        select(".id-room").innerHTML = `ID ROOM: ${sessionStorage.getItem("id-room")}`
        this.checkInputs()
        // creating an obj of player
        createPlayer()

        this.namePlayerId = "playerId"
        this.playerId = sessionStorage.getItem(this.namePlayerId)

        if(!this.playerId){
            this.playerId = getRandomIntInclusive(100, 999)
            sessionStorage.setItem(this.namePlayerId, this.playerId)
        }
        this.createPlayer(this.namePlayerId)

        serverSend()
    }
    checkInputs(){
        // check input id_room
        this.inputID.addEventListener("keypress", event => {
            if(this.inputID.value.length + 1 > 6 || event.keyCode < 48 || event.keyCode > 57) event.preventDefault()
        })
        
        selectAll("input").forEach(input => {
            input.addEventListener("input", event => {
                if(input == this.inputName){
                    select(`.${this.namePlayerId}_${sessionStorage.getItem(this.namePlayerId)} span`).innerHTML = input.value
                    if(input.value === '') select(`.${this.namePlayerId}_${sessionStorage.getItem(this.namePlayerId)} span`).innerHTML = "PLAYER"
                }
                if(input == this.inputColor){
                    setCss(select(`.${this.namePlayerId}_${sessionStorage.getItem(this.namePlayerId)}`), {backgroundColor: input.value})
                    setCss(select(`.color-player_${sessionStorage.getItem(this.namePlayerId)}`), {backgroundColor: input.value})
                }
            })
        });

        // chech inputs for disabled button
        selectAll(".input").forEach(input => {
            input.addEventListener("input", () => {
                if((this.inputName.value.length >= 3 && this.inputName.value.length <= 8) && (this.inputID.value.length == 6 && ~~this.inputID.value != 0)){
                    this.connectBtn.disabled = false
                } else{
                    this.connectBtn.disabled = true
                }
            })
        });

        // event listener for button connection
        this.connectBtn.addEventListener("click", event => {
            if((this.inputName.value.length >= 3 && this.inputName.value.length <= 8 && this.inputName.value != '') && (this.inputID.value.length == 6 && ~~this.inputID.value != 0)){
                event.preventDefault()
                let newUser = {
                    playerId: ~~sessionStorage.getItem(this.namePlayerId),
                    player: this.inputName.value,
                    color: this.inputColor.value,
                }
                JSON.parse(JSON.stringify(newUser))
                console.log(newUser);
            } else{
                event.preventDefault()
                alert("WRONG DATA FORMAT")
            }
        })

        // event listener for button create
        this.createBtn.addEventListener("click", event => {
            event.preventDefault()
            
            const nameRoomId = "id-room"
            let roomId = getRandomIntInclusive(100000, 999999)
            document.cookie = encodeURIComponent(nameRoomId) + '=' + encodeURIComponent(roomId)
            sessionStorage.setItem(nameRoomId, roomId)

            let Url = new URL(location.protocol + location.host + location.pathname);
            Url.searchParams.append("id-room", roomId);
            location.href = Url.href;
        })

        this.cookieBtn.addEventListener("click", ()=>{
            select(".cookie").remove()
        })
    }
    createPlayer(namePlayerId){
        let player = create("div")
        setClass(player, `player ${namePlayerId}_${sessionStorage.getItem(namePlayerId)}`)
        
        let namePlayer = create("span")
        namePlayer.setAttribute("trnaslate", "no")
        namePlayer.innerHTML = "PLAYER"
        setClass(namePlayer, "name-player")
        player.appendChild(namePlayer)
        select("#field").appendChild(player)

        let dataColor = create("span")
        setClass(dataColor, `data-color color-player_${sessionStorage.getItem(namePlayerId)}`)
        select("label[for=color]").appendChild(dataColor)
    }
}