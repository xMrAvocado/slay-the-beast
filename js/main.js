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
Hitsnd.volume = 0.05;
let Arrowsnd = new Audio("../sounds/arrow_attack.wav");
Arrowsnd.volume = 0.05;
let GameOversnd = new Audio("../sounds/game_over.mp3");
GameOversnd.volume = 0.05;
let StartButtonsnd = new Audio("../sounds/start_sound.flac");
StartButtonsnd.volume = 0.05;
let DeadBeastsnd = new Audio("../sounds/dead_beast.flac");
DeadBeastsnd.volume = 0.05;
let Ouchsnd = new Audio("../sounds/ouch_damage.flac");
Ouchsnd.volume = 0.05;
let Combatsnd = new Audio("../sounds/combat_music.mp3");
Combatsnd.volume = 0.05;
let Endingsnd = new Audio("../sounds/ending.wav");
Endingsnd.volume = 0.05;

//* FUNCIONES GLOBALES DEL JUEGO

function startGame(){
    GameOversnd.pause(); //Se pausa la música de fin del juego.
    GameOversnd.currentTime = 0; // La musica de fin del juego empieza de 0 siempre.

    Combatsnd.currentTime = 0;

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

    arqueroObj.gravityEffect();
    fireballDespawn();
    checkColisionArcherFireball();

    //arrowDespawn();
    checkColisionArrowBeast();

    arqueroObj.walkRigth();
    arqueroObj.walkLeft();
    arqueroObj.jumpEffect();

    //colisionArquero()
}

function gameOver(){
    console.log("Game Over");
    
    GameOversnd.play();
    Combatsnd.pause();

    // 1. Detener todos los intervalos de juego
    clearInterval(beastObj.intervalBeast); //Detener animacion del dragon
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

    Endingsnd.play();
    Combatsnd.pause();


    // 1. Detener todos los intervalos de juego
    clearInterval(beastObj.intervalBeast); //Detener animacion del dragon
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

function damageDragon(){
    beastObj.node.style.display = "none";
    setTimeout(()=>{
        beastObj.node.style.display = "block";
    }, 50)
}

/*FIREBALL SPAWN, DESPAWN AND COLLISION*/
function fireballSpawn(){
    let randomPositionX = Math.floor(Math.random() * 600);
    let fireballObj = new Fireball(randomPositionX);
    fireballArray.push(fireballObj);
    console.log(fireballArray.length);
}

function fireballDespawn(){
    if (fireballArray.length > 0 && fireballArray[0].y > (gameBoxNode.offsetHeight - fireballArray[0].h)){
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
            eachFireballObj.x < (arqueroObj.x + arqueroObj.w - 30) &&
            eachFireballObj.x + eachFireballObj.w > arqueroObj.x &&
            eachFireballObj.y -30 < arqueroObj.y + arqueroObj.h &&
            eachFireballObj.h + eachFireballObj.y - 30 > arqueroObj.y
          ) {
            // ¡colisión detectada!
            Ouchsnd.play();
            gameOver();
          }

    })
}
/*******************************************************************/

/*ARROW SPAWN, DESPAWN AND COLLISION*/
window.addEventListener("keydown",(event)=>{
    if (event.code === "KeyK" && arqueroObj.canShoot === true){

        /*ANIMACION ATAQUE*/
        arqueroObj.arrayArcher = ["./images/Archer/Attack3.PNG", "./images/Archer/Attack1.PNG"];
        gameBoxNode.append(arqueroObj.node);
        arqueroObj.node.src = arqueroObj.arrayArcher[0];
        let counter = 1;
        arqueroObj.intervalArcher = setInterval(()=>{
            arqueroObj.node.src = arqueroObj.arrayArcher[counter]; // Añadimos el src a la imagen // La llamada se hace desde el index, por eso se pone un solo "."
            counter ++;
            if (counter > arqueroObj.arrayArcher.length - 1){
                counter = 0;
            }
            console.log("Intervalo Arquero");
        }, 380);
        setTimeout(()=>{
            clearInterval(arqueroObj.intervalArcher);
         }, 380);
        /************************************************/
        let positionX = arqueroObj.x;
        let positionY = arqueroObj.y;
        let arrowObj = new Arrow(positionX, positionY);
        arrowArray.push(arrowObj);
        console.log(arrowArray.length);

        Arrowsnd.play();

        arqueroObj.canShoot = false;

        setTimeout(()=>{
            arqueroObj.canShoot = true;
         }, 1000)
    }
})

/*function arrowDespawn(){
    if (arrowArray.length > 0 && arrowArray[0].x > ((920) - arrowArray[0].w)){
        // 1. Si el array tiene tuberias
        // 2. si la x de la primera tuberia ha salido de la caja de juego

        // Para remover objetos del juego hay que considerar dos cosas:

        // 1. Remover el Nodo
        arrowArray[0].node.remove();
        // 2. Removerlo del JS (Array)
        arrowArray.shift();
    }
}*/ //Código hecho antes del cambio hecho en la funcion checkColisionArrowBeast()

function checkColisionArrowBeast(){
    arrowArray.forEach((eachArrowObj)=>{

        if (
            eachArrowObj.x < beastObj.x + beastObj.w &&
            eachArrowObj.x + eachArrowObj.w > beastObj.x + 130 &&
            eachArrowObj.y < beastObj.y + beastObj.h &&
            eachArrowObj.h + eachArrowObj.y > beastObj.y
          ) {
            // ¡colisión detectada!
            // 1. Remover el Nodo
            arrowArray[0].node.remove();
            // 2. Removerlo del JS (Array)
            arrowArray.shift();
            /*En caso de que la flecha pudiera fallar, hay que cambiar el código de remover el nodo*/ 
            healthBeast();
            damageDragon();
            Hitsnd.play();
          }

    })
}
/*******************************************************************/

/*ARQUERO*/
/*function colisionArquero(){
    if((arqueroObj.x + arqueroObj.w) >= (gameBoxNode.offsetWidth - 600)){
        arqueroObj.isWalkingRight = false;
    }else if ((arqueroObj.x + arqueroObj.w) <= arqueroObj.w) {
        arqueroObj.isWalkingLeft = false;
    }else if (arqueroObj.y >= 0) {
        arqueroObj.isJumping = false;
    }
}
/*******************/


//* EVENT LISTENERS
startBtnNode.addEventListener("click", ()=>{
    startGame();
    Combatsnd.play();
});

restartBtnNode.addEventListener("click", ()=>{
    startGame();
    Combatsnd.play();
});

window.addEventListener("keydown",(event)=>{
    if (event.code === "KeyD"){
        arqueroObj.isWalkingRight = true;
    }else if (event.code === "KeyA"){
        arqueroObj.isWalkingLeft = true;
    }else if (event.code === "Space"  && arqueroObj.canJump === true && (arqueroObj.y + arqueroObj.h) >= (gameBoxNode.offsetHeight - 20)){
        arqueroObj.isJumping = true;
        arqueroObj.canJump = false;

        setTimeout(()=>{
            arqueroObj.isJumping = false;
            arqueroObj.canJump = true;
         }, 500)
        
    }
})

window.addEventListener("keyup",(event)=>{
    if (event.code === "KeyD"){
        arqueroObj.isWalkingRight = false;
    }else if (event.code === "KeyA"){
        arqueroObj.isWalkingLeft = false;
    }
})