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

    //function to get specific column
    const boardColumn = (col) => board.map(row => row[col]);

    //function to check winner in a specific row
    const rowWinCheck = (row, playerToken) =>{
        for(let j = 0; j < columns; j++){
            if(board[row][j].getValue() !== playerToken){
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
        const availableCells = board.map((row) => 
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
        const availableCells = board.map((row) => 
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
                board[i][j].addToken(0);
            }
        }
        printBoard();
    }

    return {
        getBoard,
        dropToken,
        printBoard,
        rowWinCheck,
        columnWinCheck,
        rowTieCheck,
        colTieCheck,
        gameOver
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

    const playRound = (row, col) => {
        //if isGameActive is false(tie,win) and we call playground again
        if(!isGameActive){
            console.log("The game has ended. Please start a new game.");
            board.printBoard();
            return;
        }

        console.log(`Dropping ${getActivePlayer().name}'s token
        into row ${row} and column ${col}.`);

        const moveSuccess = board.dropToken(row, col, getActivePlayer().token);

        //if player selects already occupied cell
        if(!moveSuccess){
            console.log("Invalid Move. Try Again.");
            printNewRound();
            return;
        }

        //check whether current player has combination
        //in mentioned row
        if(board.rowWinCheck(row, getActivePlayer().token)){
            board.printBoard();
            console.log(`${getActivePlayer().name} wins at row ${row}.`);
            isGameActive = false;
            board.gameOver();
            return;
        }

        //check whether current player has combination
        //in mentioned column
        if(board.columnWinCheck(col, getActivePlayer().token)){
            board.printBoard();
            console.log(`${getActivePlayer().name} wins at column ${col}`);
            isGameActive = false;
            board.gameOver();
            return;
        }

        //check whether match is tied
        if(board.rowTieCheck() && board.colTieCheck()){
            board.printBoard();
            console.log("Match Tied!")
            isGameActive = false;
            board.gameOver();
            return;
        }

        
        switchPlayerTurn();
        printNewRound();   
    }

    //starting new game
    const startGame = () => {
        console.log("Starting new game.....");
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

const game = GameController();
