const currentPlayer = document.querySelector('.game-info');
const gridContainer = document.querySelector('.tic-tac-toe');
const btn = document.querySelector('.btn');

const boxes = document.querySelectorAll('.box');

let currPlayer;
let gameGrid;
const winningPositions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

//lets create a function to initialise the game
function initGame(){
    currPlayer = 'X';
    gameGrid = ["","","","","","","","",""];
    boxes.forEach((box,index)=>{
       box.innerHTML = "";
       box.style.pointerEvents = 'all';
       box.classList.remove('win');
       
    })
    btn.classList.remove("active");
    currentPlayer.innerText = `Current Player - ${currPlayer}`;
    
}
initGame();

function chechGameOver(){
    let answer = "";
    winningPositions.forEach((position)=>{
        
        if(gameGrid[position[0]] && gameGrid[position[1]] && gameGrid[position[2]]){
            if(gameGrid[position[0]] === gameGrid[position[1]] &&
                gameGrid[position[1]] === gameGrid[position[2]] &&
                gameGrid[position[2]] === gameGrid[position[0]]){
                    answer = gameGrid[position[0]];
                    
                    boxes[position[0]].classList.add('win');
                    boxes[position[1]].classList.add('win');
                    boxes[position[2]].classList.add('win');
                    gridContainer.style.pointerEvents = 'none';
                    boxes.forEach((box)=>{
                        box.style.pointerEvents = 'none';
                    })
                    btn.classList.add('active')

                }
        }

    })
    if(answer !== ""){
        currentPlayer.innerText = `Winning Player - ${answer}`;
         
    }
}
function chechGameDraw(){
    let draw = 0;
    gameGrid.forEach((position,index)=>{
        if(position !==""){
            draw = draw + 1;
        }
    })
    if(draw === 9){
        currentPlayer.innerText = 'Game Draw';
        btn.classList.add('active')
    }
}
function handleClick(index){
    if(gameGrid[index] ===""){
        boxes[index].innerText = currPlayer;
        //console.log(boxes[index]);
        gameGrid[index] = currPlayer;
        if(currPlayer == 'X'){
            currPlayer = 'O';
            currentPlayer.innerText = `Current Player - ${currPlayer}`;
        }else{
            currPlayer = 'X';
            currentPlayer.innerText = `Current Player - ${currPlayer}`;
        }
        boxes[index].style.pointerEvents = 'none';
        chechGameOver();
        chechGameDraw();
    }
}
boxes.forEach((box,index)=>{
    box.addEventListener('click',()=>{
        handleClick(index);
    })
});

btn.addEventListener('click',initGame)