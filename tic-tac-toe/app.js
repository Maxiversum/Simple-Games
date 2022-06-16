
let next = "X";
let results = ["", "", "", "", "", "", "", "", "", ""];
let winXCount = 0;
let winOCount = 0;
let drawnCount = 0;
let allowedKeysDown = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Enter", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"]
let inGame = false;
let mode = "single";
let modeTurn = "me";

/**
 * The loader will disappear after the document is fully loaded.
 */
window.addEventListener("load", () => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("loader-div").style.display = "none";
})

initSinglePlayerButton();
initMultiplayerButton();
initNewGameButton();
initResetCurrentGameButton();
initResetPointsButton();
initElements();
nextTextXO();
document.addEventListener("keydown", elementOnKeyDown);

/**
 * Initialize the single player button.
 */
function initSinglePlayerButton()
{
    let singlePlayerButton = document.getElementById("single-player");
    singlePlayerButton.innerHTML = "Single player";
    singlePlayerButton.addEventListener("click", () => singlePlayer());
}

/**
 * Initialize the multiplayer button.
 */
function initMultiplayerButton()
{
    let multiplayerButton = document.getElementById("multiplayer");
    multiplayerButton.innerHTML = "Multiplayer";
    multiplayerButton.addEventListener("click", () => multiplayer());
}

/**
 * Initialize the new game button.
 */
function initNewGameButton()
{
    let newGameButton = document.getElementById("new-game");
    newGameButton.innerHTML = "New Game";
    newGameButton.disabled = true;
    newGameButton.addEventListener("click", () => newGame());
}

/**
 * Initialize the current game button.
 */
function initResetCurrentGameButton()
{
    let resetCurrentGameButton = document.getElementById("reset-current-game");
    resetCurrentGameButton.innerHTML = "Reset Current Game";
    resetCurrentGameButton.disabled = true;
    resetCurrentGameButton.addEventListener("click", () => resetCurrentGame());
}

/**
 * Initialize the reset points button.
 */
function initResetPointsButton()
{
    let resetPointsButton = document.getElementById("reset-points");
    resetPointsButton.innerHTML = "Reset Points";
    resetPointsButton.disabled = true;
    resetPointsButton.addEventListener("click", () => resetPoints());
}

/**
 * Initialize the main grid elements.
 */
function initElements()
{
    for (let i = 1; i < 10; i++) {
        let element = document.createElement("div");
        element.setAttribute("id", i);
        element.tabIndex = 0;
        classListAddRemove(element, "add", "grid-item");
        element.addEventListener("click", () => elementOnClick(element));
        document.getElementById("grid").appendChild(element);
    }
}

/**
 * Shows who is next. It is either X or O.
 */
function nextTextXO()
{
    document.getElementById("next").innerHTML = "Next is: " + next;
}

/**
 * It will add or remove a CSS class from the give HTML element.
 * @param {HTMLElement} element - The HTMLElement where class needs to change.
 * @param {string} addRemove - Possibilities: add, remove.
 * @param {string} classCSS - The CSS class that needs to change.
 */
function classListAddRemove(element, addRemove, classCSS)
{
    if (addRemove == "add") {
        element.classList.add(classCSS);
    }
    else if (addRemove == "remove") {
        element.classList.remove(classCSS);
    }
    //else -> toggle
}

/**
 * If a number pressed between 1-9 it will select the appropriate grid element.
 * If an arrow key pressed it will move the selection in the grid (if a grid element previously was selected).
 * If the enter was pressed while in the game than the selected grid item will place your X or O, if not in the game then it will start a new game.
 * @param {KeyboardEvent} e - The keydown element (the pressed button from the user).
 */
function elementOnKeyDown(e)
{
    if (allowedKeysDown.includes(e.key)) {
        let numbers = allowedKeysDown.slice(0, 9);
        let arrows = allowedKeysDown.slice(10, 14);
        if (arrows.includes(e.key)) {
            setFocusByArrows(e.key);
        }
        else if (e.key == "Enter" && !inGame) {
            newGame();
        }
        else if (numbers.includes(e.key)) {
            //elementOnClick(document.getElementById(e.key));
            document.getElementById(e.key).focus();
        }
        else if (e.key == "Enter" && inGame && document.activeElement.innerHTML == "") {
            elementOnClick(document.getElementById(document.activeElement.id));
        }
    }
}

/**
 * Click one of the empty grid elements that will place your X or O.
 * @param {HTMLElement} element - The clicked grid item.
 */
function elementOnClick(element)
{
    if (element.parentElement.id == "grid") {
        inGame = true;
        classListAddRemove(element, "add", "pointer-events-none");
        let span = document.createElement("span");
        classListAddRemove(span, "add", "grid-span");
        if (next == "X") {
            span.innerHTML = "X";
            next = "O";
            results[element.id] = "X";
        }
        else {
            span.innerHTML = "O";
            next = "X";
            results[element.id] = "O";
        }
        element.appendChild(span);
        nextTextXO();
        document.getElementById("reset-current-game").disabled = false;
        if (mode == "single") {
            document.getElementById("multiplayer").disabled = true;
        }
        else if (mode == "multi") {
            document.getElementById("single-player").disabled = true;
        }
        checkGameOver();
    }    
}

/**
 * Checks if the game has ended or not. It will fire after every elementOnClick(element).
 */
function checkGameOver()
{
    let row1 = results[1] == results[2] && results[2] == results[3] && results[1] != "";
    let column1 = results[1] == results[4] && results[4] == results[7] && results[1] != "";
    let diagonal1 = results[1] == results[5] && results [5] == results[9] && results[1] != "";
    let row2 = results[4] == results[5] && results[5] == results[6] && results[4] != "";
    let column2 = results[2] == results[5] && results[5] == results[8] && results[2] != "";
    let diagonal2 = results[3] == results[5] && results [5] == results[7] && results[3] != "";
    let row3 = results[7] == results[8] && results[8] == results[9] && results[7] != "";
    let column3 = results[3] == results[6] && results[6] == results[9] && results[3] != "";
    let drawn = results[1] != "" && results[2] != "" && results[3] != "" && results[4] != "" && results[5] != "" && results[6] != "" && results[7] != "" && results[8] != "" && results[9] != "" && !row1 && !row2 && !row3 && !column1 && !column2 && !column3 && !diagonal1 && !diagonal2;

    if (row1 || row2 || row3 || column1 || column2 || column3 || diagonal1 || diagonal2 || drawn) {
        inGame = false;
        if (drawn) {
            document.getElementById("result").innerHTML = "Draw!";
            drawnCount++;
            document.getElementById("drawn-count").innerHTML = drawnCount;
        }
        else {
            let nextResult = "";
            if (next == "X") {
                nextResult = "O";
                winOCount++;
                document.getElementById("win-o-count").innerHTML = winOCount;
            }
            else {
                nextResult = "X";
                winXCount++;
                document.getElementById("win-x-count").innerHTML = winXCount;
            }
            document.getElementById("result").innerHTML = nextResult + " wins!";
        }
        classListAddRemove(document.getElementById("grid"), "add", "pointer-events-none");
        document.getElementById("new-game").disabled = false;
        document.getElementById("reset-current-game").disabled = true;
        document.getElementById("multiplayer").disabled = false;
        document.getElementById("single-player").disabled = false;
        if (!(winXCount == 0 && winOCount == 0 && drawnCount == 0)) {
            document.getElementById("reset-points").disabled = false;
        }
    }
    else if (mode == "single" && modeTurn == "me") {
        modeTurn = "not me";
        singlePlayerMode();
    }
    else if (mode == "single" && modeTurn == "not me") {
        modeTurn = "me";
    }
}

/**
 * Starts a new game.
 */
function newGame()
{
    modeTurn = "me";
    next = "X";
    nextTextXO();
    inGame = true;
    classListAddRemove(document.getElementById("grid"), "remove", "pointer-events-none");
    document.getElementById("new-game").disabled = true;
    document.getElementById("result").innerHTML = "";
    for (let i = 1; i < 10; i++) {
        let element = document.getElementById(i);
        classListAddRemove(element, "remove", "pointer-events-none");
        element.innerHTML = "";
        results[i] = "";
    }
}

/**
 * The game will randomly place a X or O to an empty grid item when the gamemode is on single player and this is not the players turn.
 */
function singlePlayerMode()
{
    let done = false;
    let random = 0;
    let element = null;
    do {
        random = Math.floor(Math.random() * 9) + 1;
        element = document.getElementById(random);
        if (element.innerHTML == "") {
            done = true;
        }
    } while (!done);
    elementOnClick(element);
}

/**
 * Clicking on the reset points button will reset all of the points.
 */
function resetPoints()
{
    winXCount = 0;
    winOCount = 0;
    drawnCount = 0;
    document.getElementById("win-x-count").innerHTML = winXCount;
    document.getElementById("win-o-count").innerHTML = winOCount;
    document.getElementById("drawn-count").innerHTML = drawnCount;
    document.getElementById("reset-points").disabled = true;
}

/**
 * Clicking on the reset current game button will reset the current game.
 */
function resetCurrentGame()
{
    inGame = false;
    next = "X";
    nextTextXO();
    results = ["", "", "", "", "", "", "", "", "", ""];
    for (let i = 1; i < 10; i++) {
        let element = document.getElementById(i);
        classListAddRemove(element, "remove", "pointer-events-none");
        element.innerHTML = "";
        results[i] = "";
    }
    document.getElementById("reset-current-game").disabled = true;
    document.getElementById("single-player").disabled = false;
    document.getElementById("multiplayer").disabled = false;
}

/**
 * Clicking on the single player button will set the gamemode to single player and execute the singlePlayerMode() method.
 */
function singlePlayer()
{
    mode = "single";
    classListAddRemove(document.getElementById("multiplayer"), "add", "button-mode-inactive");
    classListAddRemove(document.getElementById("single-player"), "remove", "button-mode-inactive");
}

/**
 * Clicking on the multiplayer button will set the gamemode to multiplayer and the two players on the same computer will play so both X and O will be controlled by the player.
 */
function multiplayer()
{
    mode = "multi";
    classListAddRemove(document.getElementById("single-player"), "add", "button-mode-inactive");
    classListAddRemove(document.getElementById("multiplayer"), "remove", "button-mode-inactive");
}

/**
 * Pressing the arrows will allow you to move in the main grid.
 * @param {KeyboardEvent} key - One of the arrow keys.
 */
function setFocusByArrows(key)
{
    let selectedElementId = document.activeElement.id;
    if (selectedElementId == 1) {
        if (key == "ArrowRight") {
            document.getElementById(2).focus();
        }
        else if (key == "ArrowDown") {
            document.getElementById(4).focus();
        }
    }
    else if (selectedElementId == 2) {
        if (key == "ArrowRight") {
            document.getElementById(3).focus();
        }
        else if (key == "ArrowDown") {
            document.getElementById(5).focus();
        }
        else if (key == "ArrowLeft") {
            document.getElementById(1).focus();
        }
    }
    else if (selectedElementId == 3) {
        if (key == "ArrowDown") {
            document.getElementById(6).focus();
        }
        else if (key == "ArrowLeft") {
            document.getElementById(2).focus();
        }
    }
    else if (selectedElementId == 4) {
        if (key == "ArrowUp") {
            document.getElementById(1).focus();
        }
        else if (key == "ArrowRight") {
            document.getElementById(5).focus();
        }
        else if (key == "ArrowDown") {
            document.getElementById(7).focus();
        }
    }
    else if (selectedElementId == 5) {
        if (key == "ArrowUp") {
            document.getElementById(2).focus();
        }
        else if (key == "ArrowRight") {
            document.getElementById(6).focus();
        }
        else if (key == "ArrowDown") {
            document.getElementById(8).focus();
        }
        else if (key == "ArrowLeft") {
            document.getElementById(4).focus();
        }
    }
    else if (selectedElementId == 6) {
        if (key == "ArrowUp") {
            document.getElementById(3).focus();
        }
        else if (key == "ArrowDown") {
            document.getElementById(9).focus();
        }
        else if (key == "ArrowLeft") {
            document.getElementById(5).focus();
        }
    }
    else if (selectedElementId == 7) {
        if (key == "ArrowUp") {
            document.getElementById(4).focus();
        }
        else if (key == "ArrowRight") {
            document.getElementById(8).focus();
        }
    }
    else if (selectedElementId == 8) {
        if (key == "ArrowUp") {
            document.getElementById(5).focus();
        }
        else if (key == "ArrowRight") {
            document.getElementById(9).focus();
        }
        else if (key == "ArrowLeft") {
            document.getElementById(7).focus();
        }
    }
    else if (selectedElementId == 9) {
        if (key == "ArrowUp") {
            document.getElementById(6).focus();
        }
        else if (key == "ArrowLeft") {
            document.getElementById(8).focus();
        }
    }
}
