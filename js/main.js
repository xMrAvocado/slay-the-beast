//* ELEMENTOS PRINCIPALES DEL DOM

// pantallas
const splashScreenNode = document.querySelector("#splash-screen")
const gameScreenNode = document.querySelector("#game-screen")
const gameOverScreenNode = document.querySelector("#game-over-screen")
const victoryScreenNode = document.querySelector("#victory-screen")
let healthRemaining = document.querySelector("#health-remaining");


// botones
const startBtnNode = document.querySelector("#start-btn")
const restartBtnNode = document.querySelector("#restart-btn")

// game box
const gameBoxNode = document.querySelector("#game-box")

//* VARIABLES GLOBALES DEL JUEGO
let arqueroObj = null;
let beastObj = null;

let fireballArray = [];
let arrowArray = [];

let gameIntervalId = null;
let fireballSpawnIntervalId = null;

let HitCounter = 0;

/*SOUNDS*/ 
let Hitsnd = new Audio("../sounds/hit.wav");
let Arrowsnd = new Audio("../sounds/arrow_attack.wav");
let GameOversnd = new Audio("../sounds/game_over.mp3");
let StartButtonsnd = new Audio("../sounds/start_sound.flac");
let DeadBeastsnd = new Audio("../sounds/dead_beast.flac");


//* FUNCIONES GLOBALES DEL JUEGO

function startGame(){
    GameOversnd.pause();
    StartButtonsnd.play();
    HitCounter = 1;
    healthRemaining.style.width = `1300px`
    // 1. ocultar la pantalla inicial
    splashScreenNode.style.display = "none";
    // 2. mostrar pantalla del juego
    gameScreenNode.style.display = "flex";
    // 3. ocultar la pantalla reinicio
    victoryScreenNode.style.display = "none";
    gameOverScreenNode.style.display = "none";
    // 4. añadir los elementos iniciales del juego
    arqueroObj = new Arquero();
    console.log(arqueroObj);
    beastObj = new Beast();
    console.log(beastObj);

    // 4. iniciar intervalo principal del juego
    gameIntervalId = setInterval(()=>{
        //console.log("loop")
        gameLoop();
    }, Math.round(1000/60));
    // 5. iniciaremos otros intervalos adicionales
    fireballSpawnIntervalId = setInterval(()=>{
        console.log("fireball")
        fireballSpawn();
    }, 1500)
}

function gameLoop(){
    fireballArray.forEach((eachFireballObj)=>{
        eachFireballObj.automaticMovement();
    })

    arrowArray.forEach((eachArrowObj)=>{
        eachArrowObj.automaticMovement();
    })

    fireballDespawn();
    checkColisionArcherFireball();

    arrowDespawn();
    checkColisionArrowBeast();
}

function gameOver(){
    console.log("Game Over");
    
    GameOversnd.play();

    // 1. Detener todos los intervalos de juego
    clearInterval(gameIntervalId);
    clearInterval(fireballSpawnIntervalId);
    // 2. Ocultar la pantalla de juego
    gameScreenNode.style.display = "none";
    
    // 3. Mostrar la pantalla final
    gameOverScreenNode.style.display = "flex";
    
    arqueroObj.node.remove();
    beastObj.node.remove();

    arqueroObj = null;
    beastObj = null;
    
    fireballArray.forEach((eachFireball)=>{
        eachFireball.node.remove();
    })
    fireballArray = [];
    arrowArray.forEach((eachArrow)=>{
        eachArrow.node.remove();
    })
    arrowArray= [];
}

function gameEnd(){
    console.log("Victory");
    
    // 1. Detener todos los intervalos de juego
    clearInterval(gameIntervalId);
    clearInterval(fireballSpawnIntervalId);
    // 2. Ocultar la pantalla de juego
    gameScreenNode.style.display = "none";
    
    // 3. Mostrar la pantalla final
    victoryScreenNode.style.display = "flex";

    arqueroObj.node.remove();
    beastObj.node.remove();

    arqueroObj = null;
    beastObj = null;
    
    fireballArray.forEach((eachFireball)=>{
        eachFireball.node.remove();
    })
    fireballArray = [];
    arrowArray.forEach((eachArrow)=>{
        eachArrow.node.remove();
    })
    arrowArray= [];

}

function healthBeast(){
    healthRemaining.style.width = `${1300 - HitCounter * 100}px`;
    HitCounter ++;
    console.log("Hitcounter", HitCounter);
    if (healthRemaining.style.width === `0px`){
        DeadBeastsnd.play();
        gameEnd();
    }
}

/*FIREBALL SPAWN, DESPAWN AND COLLISION*/
function fireballSpawn(){
    let randomPositionX = Math.floor(Math.random() * 600);
    let fireballObj = new Fireball(randomPositionX);
    fireballArray.push(fireballObj);
    console.log(fireballArray.length);
}

function fireballDespawn(){
    if (fireballArray.length > 0 && fireballArray[0].y > (700 + fireballArray[0].h)){
        // 1. Si el array tiene tuberias
        // 2. si la x de la primera tuberia ha salido de la caja de juego

        // Para remover objetos del juego hay que considerar dos cosas:

        // 1. Remover el Nodo
        fireballArray[0].node.remove();
        // 2. Removerlo del JS (Array)
        fireballArray.shift();
    }
}

function checkColisionArcherFireball(){
    fireballArray.forEach((eachFireballObj)=>{

        if (
            eachFireballObj.x < arqueroObj.x + arqueroObj.w &&
            eachFireballObj.x + eachFireballObj.w > arqueroObj.x &&
            eachFireballObj.y < arqueroObj.y + arqueroObj.h &&
            eachFireballObj.h + eachFireballObj.y > arqueroObj.y
          ) {
            // ¡colisión detectada!
            gameOver();
          }

    })
}
/*******************************************************************/

/*ARROW SPAWN, DESPAWN AND COLLISION*/
window.addEventListener("keydown",(event)=>{
    if (event.code === "Space" && arqueroObj.canShoot === true){
        let positionX = arqueroObj.x;
        let arrowObj = new Arrow(positionX);
        arrowArray.push(arrowObj);
        console.log(arrowArray.length);

        arqueroObj.canShoot = false;

        Arrowsnd.play();

        setTimeout(()=>{
            arqueroObj.canShoot = true;
         }, 1000)
    }
})

function arrowDespawn(){
    if (arrowArray.length > 0 && arrowArray[0].x > ((920) - arrowArray[0].w)){
        // 1. Si el array tiene tuberias
        // 2. si la x de la primera tuberia ha salido de la caja de juego

        // Para remover objetos del juego hay que considerar dos cosas:

        // 1. Remover el Nodo
        arrowArray[0].node.remove();
        // 2. Removerlo del JS (Array)
        arrowArray.shift();
    }
}

function checkColisionArrowBeast(){
    arrowArray.forEach((eachArrowObj)=>{

        if (
            eachArrowObj.x < beastObj.x + beastObj.w &&
            eachArrowObj.x + eachArrowObj.w > beastObj.x + 130 &&
            eachArrowObj.y < beastObj.y + beastObj.h &&
            eachArrowObj.h + eachArrowObj.y > beastObj.y
          ) {
            // ¡colisión detectada!
            healthBeast();
            
            Hitsnd.play();
          }

    })
}
/*******************************************************************/


//* EVENT LISTENERS
startBtnNode.addEventListener("click", ()=>{
    startGame();
});

restartBtnNode.addEventListener("click", ()=>{
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