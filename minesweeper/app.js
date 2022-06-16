/**
 * app.js
 * 
 * The game display/UI.
 */

/**
 * The loader will disappear after the document is fully loaded.
 */
 window.addEventListener("load", () => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("loader-div").style.display = "none";
})

/**
 * The imports from minesweeper.js.
 */
import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose } from "./minesweeper.js";

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.getElementById("board");
const minesLeftText = document.querySelector("[data-mine-count]");
const messageText = document.getElementById("subtext");

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener("click", () => {
            revealTile(board, tile);
            checkGameEnd();
        });
        tile.element.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        });
    });
});

boardElement.style.setProperty("--size", BOARD_SIZE);
minesLeftText.textContent = NUMBER_OF_MINES;

function listMinesLeft()
{
    const markedTileCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length;
    }, 0);

    minesLeftText.textContent = NUMBER_OF_MINES - markedTileCount;
}

function checkGameEnd()
{
    const win = checkWin(board);
    const lose = checkLose(board);
    if (win || lose) {
        boardElement.addEventListener("click", stopProp, { capture: true });
        boardElement.addEventListener("contextmenu", stopProp, { capture: true });
    }
    if (win) {
        messageText.textContent = "You Win";
    }
    if (lose) {
        messageText.textContent = "You Lose";
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) {
                    markTile(tile);
                }
                if (tile.mine) {
                    revealTile(board, tile);
                }
            });
        });
    }
}

function stopProp(e)
{
    e.stopImmediatePropagation();
}
