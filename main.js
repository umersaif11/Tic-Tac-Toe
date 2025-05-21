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

let game = GameBoard();
game.dropToken(0,2,'X');