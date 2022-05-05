(function ($) {
    const infoDisplay = $('#info');

    let currentPlayer = 'user';
    let playerNum = 0;
    //let ready = false;
    //let opponentReady = false;
    //let isGameOver = false;

    /*
    TODO:
    - Make a function that sends a move to the server
        -- this needs to check if it's your turn and that it passes all the chess moves
        -- also needs to check if you've won
        -- add the move to the db list
    - Make a function that receives the move from the server
        -- check if the move was made on the correct turn (for double verification)
        -- put the move into the chessboard
        -- check if that move was a winning move 
        -- adds the move to the db list
    - Make a function that updates everything after winning
        -- Stops the game from being played
        -- Shows some sort of winner screen
        -- Adds the data to the database
    - Ends the game on a disconnect
        -- Mark the game as incomplete or delete it from the database
        -- Let the current player know that their opponent disconnected and
           that the game won't be recorded 
    */
    

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
            // TODO: change this to be the player name
            $('#chat-box').append(`Player ${parseInt(info[0]) + 1}: ${info[1]}<br/>`);
        })

        socket.on('move-made', info => {
            console.log("made a move");
            // this needs to check what player made the move and then perform the move
            if(turn){
                console.log("error, move received when not the opponent's turn");
                return;
            }

            // make the move on the chessboard
        })

    }

})(window.jQuery);