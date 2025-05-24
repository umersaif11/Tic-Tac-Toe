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

        //if there are available cell then assign token
        board[row][col].addToken(playerToken);
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
            if(board[row][j] !== playerToken){
                return false;
            }
            return true;
        }
    }

    //function to check winner in a specific column
    const columnWinCheck = (column, playerToken) => {
        const columnToCheck = boardColumn(column);

        for(let i = 0; i < columnToCheck.length; i++){
            if(columnToCheck[i] !== playerToken){
                return false;
            }
            return true;
        }
    }

    return {
        getBoard,
        dropToken,
        printBoard
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
        console.log(`Dropping ${getActivePlayer().name}'s token
        into row ${row} and column ${col}.`);

        board.dropToken(row, col, getActivePlayer().token);



        switchPlayerTurn();
        printNewRound();
    }
    printNewRound();

    return{
        playRound,
        getActivePlayer
    }
}    
