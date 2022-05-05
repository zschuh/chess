(function ($) {
    const infoDisplay = $('#info');

    let currentPlayer = 'user';
    let playerNum = 0;
    //let ready = false;
    //let opponentReady = false;
    //let isGameOver = false;
    

    $('#start-button').on('click', function (event) {
        event.preventDefault();

        startMultiplayer();
    });

    function startMultiplayer() {
        const socket = io();

        // receive client's player number
        socket.on('player-number', num => {
            if (parseInt(num) === -1) {
                infoDisplay.html("Sorry, the server is full");
            }
            else {
                $('#game').show().siblings('section').hide();
                playerNum = parseInt(num);
                if (playerNum === 1) { currentPlayer = "opponent"}

                console.log(playerNum);

                // get other player status
                socket.emit('check-players');
            }
        })

        // another player connects
        socket.on('player-connection', num => {
            console.log(`Player number ${num} has connected or disconneted`);
            playerConnectedOrDisconnected(num);
        })

        // on opponent ready
        /* this part is not neccessary at this point in time - create game first
        socket.on('opponent-ready', num => {
            opponentReady = true;
            playerReady(num);
            if (ready) then playgame
        }) */

        // check player status 
        socket.on('check-players', players => {
            players.forEach((p, i) => {
                if (p.connected) { playerConnectedOrDisconnected(i) }
                /* Do something like this once the game is implemented
                if (p.ready) {
                    playerReady(i);
                    if (i !== playerReady) opponentReady = true;
                }
                */
            })
        })

        // on timeout
        socket.on('timeout', () => {
            infoDisplay.html = "You have reached the 10 minute time limit";
        })

        // toggle the <span> element next to connected status between red and green
        function playerConnectedOrDisconnected(num) {
            let player = `.p${parseInt(num) + 1}`;
            $(`${player} .connected span`).toggleClass('green');
        }

        // event listener for sending chats
        $('#chat-form').submit(function (event) {
            event.preventDefault();
    
            var chatMessage = $('#chat-input').val().trim();
    
            if (chatMessage) {
                // find way to empty input field if possible. .val() = '' not working
                socket.emit('chat', chatMessage);
                $('#chat-box').append(`Player ${parseInt(playerNum) + 1}: ${chatMessage}<br/>`);
            }
            else {
                return;
            }
        })

        // on receiving chat
        socket.on('chat', info => {
            $('#chat-box').append(`Player ${parseInt(info[0]) + 1}: ${info[1]}<br/>`);
        })

    }

})(window.jQuery);