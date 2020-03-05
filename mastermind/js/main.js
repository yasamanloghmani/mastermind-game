const ALL_COLORS = {
    '0' : ['#ff6500', '#ff0073', '#00ff00', '#8c00ff'],
    '1' : ['#ff6500', '#ff0073', '#00ff00', '#8c00ff', '#0080ff', '#ffff00'],
    '2' : ['#ff6500', '#ff0073', '#00ff00', '#8c00ff', '#0080ff', '#ffff00', '#00ffff', '#ffa7a7']
}

let COLORS = [];
// let COLORS = {
//     '0' : '#ff6500',
//      '1' : '#ff0073',
//      '2': '#00ff00',
//      '3' : '#8c00ff',
//      '4' :  '#ffff00',
//      '5' : '#0080ff'
// };

const difficultyLevel = [
    {
        min : '6',
    },
    {
        min : '4',
    },
    {
        min : '2',
    }
];
let difficulty = -1;
let randomColors = [];
let board, activeRow, colorId,clmn ;
let perfect = 0, almost = 0;
let timerId = 0;
let userName = "";
let randomColorsColumn;

let firstPage = document.getElementById('first-modal-page');
let secondPage = document.getElementById('second-modal-page');

document.querySelectorAll('button.difficulty-level').forEach(function(el){
    el.addEventListener('click', checkDefficulty);
});

function checkDefficulty(evt){
    let difficualtyBtn = evt.target;
    let difficultyId = difficualtyBtn.id;
    difficulty = difficultyId.replace("difficulty", "");
    difficulty = parseInt(difficulty);
    COLORS =  ALL_COLORS[difficulty];
    difficualtyBtn.style.backgroundColor = 'darkslategrey';
    difficualtyBtn.style.color = 'white';
    generateRandomColores();
    generateColorsPeg();
    init();
    document.querySelectorAll('button.difficulty-level').forEach(function(el){
        el.removeEventListener('click', checkDefficulty);
    });
}

document.getElementById("next-btn").addEventListener('click', nextModalPage);
function nextModalPage(){
    firstPage.style.display = "none";
    secondPage.style.display = "block";
}

document.getElementById('start-btn').addEventListener('click', startGame);
function startGame(){
        let getName = document.getElementById('name');
        userName =  getName.value;;
        userName = String(userName);
        if (userName != null && userName != "" ) {
            document.getElementById("name-of-user").innerHTML = `${userName}`;
        }
        else {
            let enterName = document.getElementById('enter-name');
            enterName.style.color = 'red';
            return;
        }

    if(difficulty != -1){
        let modalPAge = document.getElementById('myModal');
        modalPAge.style.display = "none";
        countDownTimer();
    }
    else {
        let selectDifficualty = document.getElementById('select-difficualty');
        selectDifficualty.style.color = 'red';

    }
}

function countDownTimer() {
    var minutes = difficultyLevel[difficulty].min;
    //console.log(minutes)
    var sec = 59;
    timerId = setInterval(function() {
      document.getElementById("timer").innerHTML = minutes + " : " + sec;
      sec--;
      if (sec == 00 && minutes != 0) {
        minutes--;
        sec = 59;
      }
      if (minutes === 0 && sec == -1 ) {
        gameOver();
    }
    }, 1000);
  }

function gameOver(){
    clearInterval(timerId);
    for(clmn = 0 ; clmn <4; clmn++){
        randomColorsColumn = document.getElementById(`col${clmn}`);
        randomColorsColumn.style.backgroundColor = COLORS[randomColors[clmn]];
        win = document.getElementById('win-status');
        win.innerHTML = "GAME OVER :(";   
    }
    document.getElementById('player-guesses').removeEventListener('click', handleColumnClicked);

}

function generateRandomColores () {
    for (let i=0; i < 4  ; i++){
        randomColors[i] = Math.floor(Math.random() * COLORS.length) ;
    }
    console.log(randomColors)
    return randomColors;
}

function generateColorsPeg (){
    for(let a = 0; a < COLORS.length; a++ ){
        let colorDiv = document.createElement("div");
        document.getElementById('colors').appendChild(colorDiv);
        colorDiv.setAttribute('id', `color${a}`);
    }
}

document.getElementById('colors').addEventListener('click', pickColor);
function pickColor(eve){
    const pickedColor = eve.target;
    colorId = parseInt(pickedColor.id.replace('color', ''))
}


function handleColumnClicked(evt) {
    const idChecker = evt.target.id.includes("re");
    if(!idChecker){
        const indexes = evt.target.id.match(/\d+/g);
        const rowId = parseInt(indexes[0]);
        const columnId = parseInt(indexes[1]);
        if(isNaN(rowId) || isNaN(columnId)) {
            return;
        }
        if (rowId === activeRow){
            const marker = document.getElementById(`r${rowId}c${columnId}`);
            marker.style.backgroundColor = COLORS[colorId];
            board[activeRow][columnId] = colorId;
        }
    } 
}

document.getElementById('check-btn').addEventListener('click', checkGuesses);
function checkGuesses(){
    let checkCount = randomColors.reduce((acc, num) => {
        acc[num] = acc[num] ? acc[num] + 1 : 1
        return acc
    }, {});

    let copyOfArrey = board[activeRow];
    // let checkNullCount = copyOfArrey.reduce((acc, num) => {
    //     acc[num] = acc[num] ? acc[num] + 1 : 1
    //     return acc
    // }, {});

    if(!copyOfArrey.includes(null)) {
        copyOfArrey.forEach(function(el, idx) {
            if(randomColors.includes(el)) {
                if ( el === randomColors[idx] ) {
                    perfect++;
                    checkCount[el]--;
                    copyOfArrey[idx] = -1;
                 }
            }    
        });
        copyOfArrey.forEach(function(el, idx) {
            if(randomColors.includes(el)) {
                if ( checkCount[el] > 0) {
                    almost++;
                    checkCount[el]--;
                    copyOfArrey[idx] = -1;
                }
            }
        });      
        showResualt();
        winGame();
        resetResualt();
   }
}

function showResualt() {
    //const resualt = document.getElementById(`r${activeRow}resualt`);
    for(let i = 0; i < perfect; i++){
        const perfectDot = document.getElementById(`r${activeRow}re${i}`);
        perfectDot.style.backgroundColor = 'red';
    }
    for (let j = 0; j < almost; j++){
        almostDot = document.getElementById(`r${activeRow}re${perfect+j}`);
        almostDot.style.backgroundColor = 'black';
    }
}

function resetResualt() {
    almostDot = "";
    perfectDot = "";
    almost = 0;
    perfect = 0;
}

function winGame(){

    if(perfect === 4 ){
        clearInterval(timerId);
        for(clmn = 0 ; clmn <4; clmn++){
            randomColorsColumn = document.getElementById(`col${clmn}`);
            // was COLORS[randomColors[clmn]]
            randomColorsColumn.style.backgroundColor = COLORS[randomColors[clmn]];   
        }
        let win = document.getElementById('win-status');
        win.innerHTML = `WINNER :)`;
        var yourGuess = document.createElement("h3");
        document.getElementById('win-status').appendChild(yourGuess);

        let guessNumber = activeRow+1;
        yourGuess.innerHTML = `You won the game in your ${guessNumber} guess`;
        
        return;
    }
    else{
        activeRow++;
        if(activeRow < 10){
            for(let x = 0; x<4; x++){
                let activeRowStyle = document.getElementById(`r${activeRow}c${x}`);
                activeRowStyle.style.border = "3px solid darkslategrey";
                let previousRow = activeRow - 1;
                let resetBorder = document.getElementById(`r${previousRow}c${x}`);
                resetBorder.style.border = "1px solid black";
            }
        }
        else {
            gameOver();
        }   
    }
}
document.getElementById('reset-btn').addEventListener('click', resetGame);
function resetGame() {
    init();
    generateRandomColores();
    generateColorsPeg();
    colorId = -1 ;
    perfect = 0;
    almost = 0;
    location.reload();
}

function init() {
    board = [
        [null, null, null, null],//row0
        [null, null, null, null],//row1
        [null, null, null, null],//row2
        [null, null, null, null],//row3
        [null, null, null, null],//row4
        [null, null, null, null],//row5
        [null, null, null, null],//row6
        [null, null, null, null],//row7
        [null, null, null, null],//row8
        [null, null, null, null],//row9

    ];
    activeRow = 0;
    document.getElementById('player-guesses').addEventListener('click', handleColumnClicked);
}

