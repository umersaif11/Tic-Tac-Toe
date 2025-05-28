function GameBoard(){

    let rows = 3;
    let columns = 3;
    let board = [];

    //make 2D board of 3*3
    for(let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < columns; j++){
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    //function to play each round by players
    const dropToken = (row, col, playerToken) => {
        //first check availability of cells in board
        const availableCells = board.map((row) => 
        row.filter((cell) => cell.getValue() === 0)
        ).flat();

        //if no cells then stop execution
        if(!availableCells.length) return;

        if(board[row][col].getValue() === 0){
            //if there are available cell then assign token
            board[row][col].addToken(playerToken);
            return true;
        } else {
            console.log(`Cell(${row}, ${col}) is already occupied!`);
            return false;
        }
    };

    //function to print all current values in board array
    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
        row.map((cell) => cell.getValue()));

        console.log(boardWithCellValues);
    };


    return {
        getBoard,
        dropToken,
        printBoard,
    }
}

function Cell(){
    let value = 0;
    
    const addToken = (playerToken) => {
        value = playerToken;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
){
    const board = GameBoard();
    let isGameActive = true;
    let rows = 3;
    let columns = 3;

    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    let getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    //function to get specific column
    const boardColumn = (col) => board.getBoard().map(row => row[col]);

    //function to check winner in a specific row
    const rowWinCheck = (row, playerToken) =>{
        for(let j = 0; j < columns; j++){
            if(board.getBoard()[row][j].getValue() !== playerToken){
                return false;
            }
        }
        return true;
    }

    //function to check winner in a specific column
    const columnWinCheck = (column, playerToken) => {
        const columnToCheck = boardColumn(column);

        for(let i = 0; i < columnToCheck.length; i++){
            if(columnToCheck[i].getValue() !== playerToken){
                return false;
            }
        }
        return true;
    }

    //function to check tie match in all rows
    const rowTieCheck = () =>{
        //first check availability of cells in board
        const availableCells = board.getBoard().map((row) => 
        row.filter((cell) => cell.getValue() === 0)
        ).flat();
        if(!availableCells.length){
            if(!rowWinCheck(0, 'X') &&
            !rowWinCheck(1, 'X') &&
            !rowWinCheck(2, 'X') &&
            !rowWinCheck(0, 'O') &&
            !rowWinCheck(1, 'O') &&
            !rowWinCheck(2, 'O')){
                return true;
            }
        }
    }

    //function to check tie match in all columns
    const colTieCheck = () =>{
        //first check availability of cells in board
        const availableCells = board.getBoard().map((row) => 
        row.filter((cell) => cell.getValue() === 0)
        ).flat();
        if(!availableCells.length){
            if(!columnWinCheck(0, 'X') &&
            !columnWinCheck(1, 'X') &&
            !columnWinCheck(2, 'X') &&
            !columnWinCheck(0, 'O') &&
            !columnWinCheck(1, 'O') &&
            !columnWinCheck(2, 'O')){
                return true;
            }
        }
    }

    const gameOver = () => {
        console.log("Game Over!");
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < columns; j++){
                board.getBoard()[i][j].addToken(0);
            }
        }
        board.printBoard();
    }
    

    const playRound = (row, col) => {
        //if isGameActive is false(tie,win) and we call playground again
        if(!isGameActive){
            console.log("The game has ended. Please start a new game.");
            board.printBoard();
            return{
                status: "Game Ended",
                message: "The game has ended. Please start a new game."
            };
        }

        console.log(`Dropping ${getActivePlayer().name}'s token
        into row ${row} and column ${col}.`);

        const moveSuccess = board.dropToken(row, col, getActivePlayer().token);

        //if player selects already occupied cell
        if(!moveSuccess){
            console.log("Invalid Move. Try Again.");
            printNewRound();
            return{
                status: "Invalid move",
                message: "Invalid Move.Cell already occupied."
            };;
        }

        //check whether current player has combination
        //in mentioned row
        if(rowWinCheck(row, getActivePlayer().token)){
            board.printBoard();
            console.log(`${getActivePlayer().name} wins at row ${row}.`);
            isGameActive = false;
            gameOver();
            return{
                status: "Row win",
                message: `${getActivePlayer().name} wins at row ${row}.`
            };
        }

        //check whether current player has combination
        //in mentioned column
        if(columnWinCheck(col, getActivePlayer().token)){
            board.printBoard();
            console.log(`${getActivePlayer().name} wins at column ${col}`);
            isGameActive = false;
            gameOver();
            return{
                status: "Column win",
                message: `${getActivePlayer().name} wins at column ${col}.`
            };
        }

        //check whether match is tied
        if(rowTieCheck() && colTieCheck()){
            board.printBoard();
            console.log("Match Tied!")
            isGameActive = false;
            gameOver();
            return{
                status: "Tie",
                message: "Match Tied."
            };
        }

        
        switchPlayerTurn();
        printNewRound();   
    }

    //starting new game
    const startGame = () => {
        console.log("Starting new game.....");
        gameOver();
        isGameActive = true;
        activePlayer = players[0];
        printNewRound();
    }

    //for starting game first time
    printNewRound();

    return{
        playRound,
        getActivePlayer,
        startGame,
        getBoard: board.getBoard
    };
}    

const ScreenController = () => {
    const game = GameController();

    const mainContainer = document.getElementById("container");
    const playerTurn = document.getElementById("turn");
    const mainBoard = document.getElementById("board");

    const updateBoard = () => {
        const board = game.getBoard();

        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board[i].length; j++){
                const button = document.createElement("button");
                button.dataset.row = i;
                button.dataset.column = j;
                button.classList.add("cell");
                const cellValue = board[i][j].getValue();
                button.textContent = cellValue === 0 ? "" : cellValue;
                mainBoard.appendChild(button);
            }
        }
    }

    const updateScreen = () => {
        mainBoard.textContent = "";

        const activePlayer = game.getActivePlayer();
    
        playerTurn.textContent = `${activePlayer.name}'s turn...`;

        updateBoard();
    }

    //event listener function
    const clickHandle = (e) => {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if(!selectedRow || !selectedColumn) return;

        const play = game.playRound(selectedRow,selectedColumn);

        if(play.status === "Game Ended"){
            playerTurn.textContent = play.message;
            updateBoard;
        }

        updateScreen();
    }
}
