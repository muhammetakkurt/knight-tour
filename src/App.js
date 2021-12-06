import { useState } from "react";
import { makeDimensionalArray } from "./helpers";
import Cell from "./components/item";

let N = 8;
let board = makeDimensionalArray(8, 8, 0);
let bottomX = Array(8).fill(0);
let bottomY = Array(8).fill(0);
let bottomExit = Array(8).fill(0);
let differenceX = [-2, -1, 1, 2, 2, 1, -1, -2];
let differenceY = [1, 2, 2, 1, -1, -2, -2, -1];

function App() {
  const [fakeBoard, setFakeBoard] = useState(board);
  const [locations, setLocations] = useState(0);

  const handleClickCell = (locationX, locationY) => {
    board = makeDimensionalArray(8, 8, 0);
    let i,
      count = 1,
      indicator;

    async function loop() {
      while (!board[locationX][locationY]) {
        await new Promise((r) => setTimeout(r, 200));
        setLocations(`${locationX + 1}, ${locationY + 1}`);
        board[locationX][locationY] = count++;
        findAlternative(locationX, locationY);
        bottomLineCalculate();
        indicator = findNewLocation();
        if (indicator !== -1) {
          locationX = bottomX[indicator];
          locationY = bottomY[indicator];
        }
        resetBottomArray();
        await new Promise((r) => setTimeout(r, 200));
      }
      await new Promise((r) => setTimeout(r, 200));

      for (i = 0; i < 8; i++)
        if (
          locationX + differenceX[i] > -1 &&
          locationX + differenceX[i] < N &&
          locationY + differenceY[i] > -1 &&
          locationY + differenceY[i] < N &&
          board[locationX + differenceX[i]][locationY + differenceY[i]] === 0
        ) {
          board[locationX + differenceX[i]][locationY + differenceY[i]] = count;
          setFakeBoard(board);
        }
    }
    loop();
  };

  return (
    <div className="wrapper">
      <div className="board animate__animated animate__zoomInUp">
        {board.map((boardX, X) =>
          boardX.map((boardY, Y) => (
            <Cell
              key={`${X}_${Y}`}
              className={`item ${(X + Y) % 2 === 0 ? " odd" : " even"} ${
                board[X][Y] !== 0 && "active animate__animated animate__flipInX"
              }`}
              onClick={() => handleClickCell(X, Y)}
            >
              {board[X][Y] !== 0 ? board[X][Y] : -1}
            </Cell>
          ))
        )}
      </div>
    </div>
  );
}

const bottomLineCalculate = () => {
  let i, j, tmpX, tmpY;
  for (i = 0; i < 8; i++)
    if (
      bottomX[i] > -1 &&
      bottomY[i] > -1 &&
      bottomX[i] < N &&
      bottomY[i] < N &&
      !board[bottomX[i]][bottomY[i]]
    )
      for (j = 0; j < 8; j++) {
        tmpX = bottomX[i] + differenceX[j];
        tmpY = bottomY[i] + differenceY[j];
        if (
          tmpX > -1 &&
          tmpY > -1 &&
          tmpX < N &&
          tmpY < N &&
          !board[tmpX][tmpY]
        )
          bottomExit[i]++;
      }
};

const findAlternative = (x, y) => {
  for (let i = 0; i < 8; i++) {
    bottomX[i] = x + differenceX[i];
    bottomY[i] = y + differenceY[i];
  }
};

const findNewLocation = () => {
  let sayi = 9,
    ind = -1;
  for (let i = 0; i < 8; i++)
    if (bottomExit[i])
      if (sayi > bottomExit[i]) {
        sayi = bottomExit[i];
        ind = i;
      }
  return ind;
};

const resetBottomArray = () => {
  for (let i = 0; i < 8; i++) bottomExit[i] = 0;
};

export default App;
