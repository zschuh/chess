(function ($) {
    const infoDisplay = $('#info');

    let currentPlayer = 'user';
    let playerNum = 0;
    let orientation = 'white';
    let boardCreated = false;
    let turn = false;

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
    /**********************CHESS FUNCTIONS**********************/
    //initialization
    var board = null
    //var gamestate = ['start']; //temporary pseudo-db used in my testing
    //var curPos = 0;
    var game = new Chess();
    var whiteSquareGrey = '#a9a9a9';
    var blackSquareGrey = '#696969';

    //functions for highlighting legal moves
    function removeGreySquares () {
        $('#board1 .square-55d63').css('background', '')
      }
      
    function greySquare (square) {
        var $square = $('#board1 .square-' + square)
      
        var background = whiteSquareGrey
        if ($square.hasClass('black-3c85d')) {
          background = blackSquareGrey
        }
        $square.css('background', background)
    }
    /*Event Functions*/
    //prevents white from moving on black's turn
    //and vice versa
    //will have to edit this to prevent white from 
    //moving blacks pieces at all and vice versa
    function onDragStart (source, piece, position, orientation) {
        // do not pick up pieces if the game is over
        if (game.game_over()) return false;
    
        /*if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
           (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }*/

        //only pick up pieces for your side
        //playerNum 0 = white
        //playerNum 1 = black
        if(playerNum == 0){
            if(piece.search(/^b/) !== -1) return false;
        } else if (playerNum == 1) {
            if(piece.search(/^w/) !== -1) return false;
        }
    }

    //validate the move, if it's legal push it to the database
    //this function will be edited a bit when
    //dbstuff finishes
    function onDrop (source, target, piece, newPos) {
        removeGreySquares();
        console.log('Source: ' + source);
        console.log('Target: ' + target);
        // see if the move is legal
        var move = game.move({
          from: source,
          to: target,
          promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        
        // illegal move
        if (move === null) return 'snapback';
        //legal, push to db these 2 lines are temporary until db stuff is done
        curPos++;
        gamestate.push(Chessboard.objToFen(newPos));
        //after this will have to pull most recent move from black from db
        //then make the move on the board
    }

    //next 2 functions are just for highlighting the legal moves
    function onMouseoverSquare (square, piece) {
        // get list of possible moves for this square
        var moves = game.moves({
          square: square,
          verbose: true
        })
      
        // exit if there are no moves available for this square
        if (moves.length === 0) return
      
        // highlight the square they moused over
        greySquare(square)
      
        // highlight the possible squares for this piece
        for (var i = 0; i < moves.length; i++) {
          greySquare(moves[i].to)
        }
    }
      
    function onMouseoutSquare (square, piece) {
        removeGreySquares()
    }

    function onSnapEnd () {
        board.position(game.fen())
    }
    function updateStatus () {
        var status = ''
      
        var moveColor = 'White'
        if (game.turn() === 'b') {
          moveColor = 'Black'
        }
      
        // checkmate?
        if (game.in_checkmate()) {
          status = 'Game over, ' + moveColor + ' is in checkmate.'
        }
      
        // draw?
        else if (game.in_draw()) {
          status = 'Game over, drawn position'
        }
      
        // game still on
        else {
          status = moveColor + ' to move'
      
          // check?
          if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
          }
        }
      
        // $status.html(status)
        console.log(status); // I don't have an html element for the status
      }

    /*Going to need a function to get the most recent move
      made by the opposite player from the db, then make the move
      on the other player's screen*/

    /*End Event Functions*/

    /* Config and set up for the board
       This will have to be moved to wherever 
       we check if both players are ready then
       start the game.*/
    /*var config = {
        draggable: true,
        position: 'start',
        orientation: orientation,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };
    var board = Chessboard('board', config);

    updateStatus(); */
    /***********************************************************/

    function initBoard(){
        // show the chessboard; should probably put this in another function
        console.log("Creating the board...");
        if(boardCreated){
            console.log("Board already created. Stopping.");
            return;
        }
        var config = {
            draggable: true,
            position: 'start',
            orientation: orientation,
            onDragStart: onDragStart,
            onDrop: onDrop,
            onMouseoutSquare: onMouseoutSquare,
            onMouseoverSquare: onMouseoverSquare,
            onSnapEnd: onSnapEnd
        };
        var board = Chessboard('board', config);

        updateStatus();
    }

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
                if (playerNum === 1) {
                    currentPlayer = "opponent";
                    orientation = 'black'
                    socket.emit('both-connected'); // trigger the board to show for the other player
                    initBoard();
                }

                console.log(playerNum);

                // get other player status
                socket.emit('check-players');
            }
        })

        socket.on('show-chessboard', () => {
            initBoard();
            // then like start the game logic or something
        })

        // another player connects
        socket.on('player-connection', num => {
            console.log(`Player number ${num} has connected or disconnected`);
            playerConnectedOrDisconnected(num);
        })

        // TODO: Implement a ready up system for the game if I want to, I can also just have it start immediately once both players have connected
        // on opponent ready
        // this part is not neccessary at this point in time - create game first
        // socket.on('opponent-ready', num => {
        //     opponentReady = true;
        //     playerReady(num);
        //     if (ready) playgame
        // })

        // check player status
        // Marco - afaik this is only done on connection
        socket.on('check-players', players => {
            let allReady = true;
            players.forEach((p, i) => {
                if (p.connected) { 
                    playerConnectedOrDisconnected(i) 
                }
                allReady &= p.connected;
                /* Do something like this once the game is implemented
                if (p.ready) {
                    playerReady(i);
                    if (i !== playerReady) opponentReady = true;
                }
                */
            })
            // This doesn't work, this only works to display the player that joined second
            // if(allReady){
            //     initBoard();
            // }
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