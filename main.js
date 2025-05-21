function GameBoard(){
    let rows = 3;
    let columns = 3;
    let board = [];
    for(let i = 0; i < rows; i++){
        board[i] = [];
        for(let i = 0; i < columns; i++){
            board[i].push();
        }
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