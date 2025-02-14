//* ELEMENTOS PRINCIPALES DEL DOM

// pantallas
const splashScreenNode = document.querySelector("#splash-screen")
const gameScreenNode = document.querySelector("#game-screen")
const gameOverScreenNode = document.querySelector("#game-over-screen")
const victoryScreenNode = document.querySelector("#victory-screen")

// botones
const startBtnNode = document.querySelector("#start-btn")
const restartBtnNode = document.querySelector("#restart-btn")

// game box
const gameBoxNode = document.querySelector("#game-box")

//* VARIABLES GLOBALES DEL JUEGO
let arqueroObj;
let beastObj;

//* FUNCIONES GLOBALES DEL JUEGO

function startGame(){
    // 1. ocultar la pantalla inicial
    splashScreenNode.style.display = "none";
    // 2. mostrar pantalla del juego
    gameScreenNode.style.display = "flex";
    // 3. añadir los elementos iniciales del juego
    arqueroObj = new Arquero();
    console.log(arqueroObj);
    arqueroObj = new Beast();
    console.log(beastObj);

    // 4. iniciar intervalo principal del juego
    gameIntervalId = setInterval(()=>{
        gameLoop();
    }, Math.round(1000/60));
    // 5. iniciaremos otros intervalos adicionales

}

function gameLoop(){
    
}

//* EVENT LISTENERS
startBtnNode.addEventListener("click", ()=>{
    startGame();
});

window.addEventListener("keydown",(event)=>{
    if (event.code === "KeyD"){
        arqueroObj.walkRigth();
    }
})

window.addEventListener("keydown",(event)=>{
    if (event.code === "KeyA"){
        arqueroObj.walkLeft();
    }
})