const createBoard = (size) => {
  let borad;

  const clear = () => {
    //it was a way to set all the cell of the board null
    board = Array(size)
      .fill()
      .map(() => Array(size).fill(null));
  };

  const getBoard = () => board;

  const makeTurn = (x, y, color) => {
    board[y][x] = color;
  };

  clear();

  return { clear, getBoard, makeTurn };
};

module.exports = createBoard;
