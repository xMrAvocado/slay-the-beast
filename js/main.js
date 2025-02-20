//* ELEMENTOS PRINCIPALES DEL DOM

// pantallas
const splashScreenNode = document.querySelector("#splash-screen")
const gameScreenNode = document.querySelector("#game-screen")
const gameOverScreenNode = document.querySelector("#game-over-screen")
const victoryScreenNode = document.querySelector("#victory-screen")

// Vidas
let healthRemaining = document.querySelector("#health-remaining");
let archerHealthRemaining = document.querySelector("#archer-health-remaining");

// Tiempo
let minutesLabel = document.querySelector("#minutes");
let secondsLabel = document.querySelector("#seconds");


// botones
const startBtnNode = document.querySelector("#start-btn")
const restartBtnNode = document.querySelector("#restart-btn")

// game box
const gameBoxNode = document.querySelector("#game-box")

//* VARIABLES GLOBALES DEL JUEGO
let totalSeconds = 0; //Contador para hacer la operación del temporizador.

let arqueroObj = null;
let beastObj = null;

let fireballArray = [];
let arrowArray = [];
let spikeArray = [];

let gameIntervalId = null;
let fireballSpawnIntervalId = null;
let spikeSpawnIntervalId = null;
let timerIntervalId = null;
let spikeSpawnTimeoutId = null; //Declarar los Interval y Timeout como variables globales.

let actualHealth = 1300; //Vida con la que empieza el enemigo y después se irá restando.
let actualHealthArcher = 300; //Vida con la que empieza el jugador y después se irá restando.

/*SOUNDS*/ 
let Hitsnd = new Audio("./sounds/hit.wav");
Hitsnd.volume = 0.05;
let Arrowsnd = new Audio("./sounds/arrow_attack.wav");
Arrowsnd.volume = 0.05;
let GameOversnd = new Audio("./sounds/game_over.mp3");
GameOversnd.volume = 0.05;
let StartButtonsnd = new Audio("./sounds/start_sound.flac");
StartButtonsnd.volume = 0.05;
let DeadBeastsnd = new Audio("./sounds/dead_beast.flac");
DeadBeastsnd.volume = 0.05;
let Ouchsnd = new Audio("./sounds/ouch_damage.flac");
Ouchsnd.volume = 0.05;
let Combatsnd = new Audio("./sounds/combat_music.mp3");
Combatsnd.volume = 0.05;
let Endingsnd = new Audio("./sounds/ending.wav");
Endingsnd.volume = 0.05;
let Spikesnd = new Audio("./sounds/spike_spawn.wav");
Spikesnd.volume = 0.05;
let SpikeWarningsnd = new Audio("./sounds/spike_warning.wav");
SpikeWarningsnd.volume = 0.10;
/**************************************************/


//* FUNCIONES GLOBALES DEL JUEGO

function startGame(){
    actualHealth = 1300;
    actualHealthArcher = 300;

    totalSeconds = 0; //Cada vez que emmpieza la partida reseteamos el temporizador a 0

    healthRemaining.style.backgroundColor = `red`;
    GameOversnd.pause(); //Se pausa la música de fin del juego.
    GameOversnd.currentTime = 0; // La musica de fin del juego empieza de 0 siempre.

    Combatsnd.currentTime = 0; //La musica de combate empieza de 0 siempre.

    StartButtonsnd.play(); //Sonido de click del botón

    healthRemaining.style.width = `1300px`
    archerHealthRemaining.style.width = `300px`

    // 1. ocultar la pantalla inicial
    splashScreenNode.style.display = "none";
    // 2. mostrar pantalla del juego
    gameScreenNode.style.display = "flex";
    // 3. ocultar la pantalla reinicio
    victoryScreenNode.style.display = "none";
    gameOverScreenNode.style.display = "none";
    // 4. añadir los elementos iniciales del juego
    arqueroObj = new Arquero();
    //console.log(arqueroObj);
    beastObj = new Beast();
    //console.log(beastObj);

    // 4. iniciar intervalo principal del juego
    gameIntervalId = setInterval(()=>{
        gameLoop();
    }, Math.round(1000/60));
    // 5. iniciaremos otros intervalos adicionales
    fireballSpawnIntervalId = setInterval(()=>{
        fireballSpawn();
    }, 790)

    //timerIntervalId = setInterval(setTime, 1000); // Intervalo del temporizador
}

function gameLoop(){
    fireballArray.forEach((eachFireballObj)=>{
        eachFireballObj.automaticMovement();
    })

    spikeArray.forEach((eachSpikeObj)=>{
        eachSpikeObj.automaticMovement();
    })

    arrowArray.forEach((eachArrowObj)=>{
        eachArrowObj.automaticMovement();
    })

    arqueroObj.gravityEffect();

    fireballDespawn();
    checkColisionArcherFireball(); //Despawn y colision de cada bola de fuego

    checkColisionArrowBeast(); //Colision de cada flecha
    
    checkColisionArcherSpike(); //Despawn y colision del pincho
    spikeDespawn();

    arqueroObj.walkRigth();
    arqueroObj.walkLeft();
    arqueroObj.jumpEffect(); //Efectos de movimiento del jugador
}

function gameOver(){
    
    GameOversnd.play();
    Combatsnd.pause(); // Musica del game over

    // 1. Detener todos los intervalos de juego
    clearInterval(beastObj.intervalBeast); //Detener animacion del dragon
    clearInterval(gameIntervalId);
    clearInterval(fireballSpawnIntervalId);
    clearTimeout(spikeSpawnTimeoutId);
    clearInterval(spikeSpawnIntervalId);
    clearInterval(timerIntervalId);

    // 2. Ocultar la pantalla de juego
    gameScreenNode.style.display = "none";
    
    // 3. Mostrar la pantalla game over
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
    spikeArray.forEach((eachSpike)=>{
        eachSpike.node.remove();
    })
    spikeArray = []; //Limpiar todos los objetos y nodos
}

function gameEnd(){

    Endingsnd.play();
    Combatsnd.pause(); //Musica de victoria


    // 1. Detener todos los intervalos de juego
    clearInterval(beastObj.intervalBeast); //Detener animacion del dragon
    clearInterval(gameIntervalId);
    clearInterval(fireballSpawnIntervalId);
    clearTimeout(spikeSpawnTimeoutId);
    clearInterval(spikeSpawnIntervalId);
    clearInterval(timerIntervalId);

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
    spikeArray.forEach((eachSpike)=>{
        eachSpike.node.remove();
    })
    spikeArray = []; //Limpiar todos los objetos y nodos

}
/*VIDA Y DAÑO DEL DRAGÓN*/
function healthBeast(){
    actualHealth = actualHealth - 50;
    healthRemaining.style.width = `${actualHealth}px`; //Baja la barra de vida con cada flecha impactada
    
    if (healthRemaining.style.width === `0px`){
        DeadBeastsnd.play();
        gameEnd(); //Cuando la vida llega a 0 salta la pantalla de victoria
    } else if(actualHealth <= 850 && beastObj.isSecondPhase === false){
        beastObj.isSecondPhase = true;
        healthRemaining.style.backgroundColor = `#ff5c00`;
        DeadBeastsnd.play();
        spikeSpawnIntervalId = setInterval(()=>{
            SpikeWarningsnd.play();
            spikeSpawnTimeoutId = setTimeout(()=>{
                spikeSpawn();
            }, 800)    
        }, 3000)
        //Cuando llega a cierta vida, el dragón entra en segunda fase, haciendo un segundo ataque según un intervalo de tiempo.
    }
}

function damageDragon(){ // Animación del dragon recibiendo daño.
    beastObj.node.style.display = "none";
    setTimeout(()=>{
        beastObj.node.style.display = "block";
    }, 50)
}
/*********************************************/

/*VIDA Y DAÑO DEL JUGADOR*/
function healthArcher(){
    actualHealthArcher = actualHealthArcher - 100;
    archerHealthRemaining.style.width = `${actualHealthArcher}px`; //Baja la barra de vida con cada bola de fuego o pincho
    
    if (archerHealthRemaining.style.width === `0px`){
        DeadBeastsnd.play();
        gameOver(); //Cuando la vida llega a 0 salta la pantalla de game over
    }
}

function damageArcher(){ // Animación del jugador recibiendo daño.
    arqueroObj.node.style.display = "none";
    setTimeout(()=>{
        arqueroObj.node.style.display = "block";
    }, 50)
}
/*****************************************************/

/*FIREBALL SPAWN, DESPAWN AND COLLISION*/
function fireballSpawn(){ // Spawn aleatorio de las bolas de fuego
    let randomPositionX = Math.floor(Math.random() * 600);
    let fireballObj = new Fireball(randomPositionX);
    fireballArray.push(fireballObj);
    //console.log(fireballArray.length); 
}

function fireballDespawn(){ // Despawn de las bolas de fuego cuando tocan el borde inferior de la caja de juego.
    if (fireballArray.length > 0 && fireballArray[0].y > (gameBoxNode.offsetHeight - fireballArray[0].h)){

        // 1. Remover el Nodo
        fireballArray[0].node.remove();
        // 2. Removerlo del JS (Array)
        fireballArray.shift(); 
    }
}

function checkColisionArcherFireball(){ //Colisión de las bolas de fuego con el jugador
    fireballArray.forEach((eachFireballObj)=>{

        if (
            eachFireballObj.x < (arqueroObj.x + arqueroObj.w - 30) &&
            eachFireballObj.x + eachFireballObj.w> arqueroObj.x + 10 &&
            eachFireballObj.y < (arqueroObj.y + arqueroObj.h  - 45) &&
            eachFireballObj.h + eachFireballObj.y > arqueroObj.y + 15
          ) {
            // ¡colisión detectada!
            Ouchsnd.play();
            // 1. Remover el Nodo
            fireballArray[0].node.remove();
            // 2. Removerlo del JS (Array)
            fireballArray.shift(); 
            healthArcher();
            damageArcher();
          }

    })
}
/*******************************************************************/

/*SPIKE SPAWN, DESPAWN AND COLLISION*/
function spikeSpawn(){ // Spawn del pincho en la posición x del jugador
        Spikesnd.play();
        let spikeObj = new Spike(arqueroObj.x);
        spikeArray.push(spikeObj);
        //console.log(spikeArray.length);
    
}

function spikeDespawn(){ //Despawn del pincho cuando desaparece
    if (spikeArray.length > 0 && spikeArray[0].y > (gameBoxNode.offsetHeight + 50)){
        // 1. Remover el Nodo
        spikeArray[0].node.remove();
        // 2. Removerlo del JS (Array)
        spikeArray.shift();
    }
}

function checkColisionArcherSpike(){ // Colisión del pincho con el jugador
    spikeArray.forEach((eachSpikeObj)=>{

        if (
            eachSpikeObj.x < (arqueroObj.x + arqueroObj.w - 30) &&
            eachSpikeObj.x + eachSpikeObj.w > arqueroObj.x &&
            eachSpikeObj.y -30 < arqueroObj.y + arqueroObj.h &&
            eachSpikeObj.h + eachSpikeObj.y - 30 > arqueroObj.y
          ) {
            // ¡colisión detectada!
            Ouchsnd.play();
            // 1. Remover el Nodo
            spikeArray[0].node.remove();
            // 2. Removerlo del JS (Array)
            spikeArray.shift();
            healthArcher();
            damageArcher();
          }

    })
}
/*******************************************************************/

/*ARROW SPAWN, DESPAWN AND COLLISION*/
window.addEventListener("keydown",(event)=>{ // Spawn de la flecha en la posicion X e Y del jugador
    if (event.code === "KeyK" && arqueroObj.canShoot === true){

        /*ANIMACION ATAQUE*/
        arqueroObj.arrayArcher = ["./images/Archer/Attack3.PNG", "./images/Archer/Attack1.PNG"];
        gameBoxNode.append(arqueroObj.node);
        arqueroObj.node.src = arqueroObj.arrayArcher[0];
        let counter = 1;
        arqueroObj.intervalArcher = setInterval(()=>{
            arqueroObj.node.src = arqueroObj.arrayArcher[counter];
            counter ++;
            if (counter > arqueroObj.arrayArcher.length - 1){
                counter = 0;
            }
            //console.log("Intervalo Arquero");
        }, 380);
        setTimeout(()=>{
            clearInterval(arqueroObj.intervalArcher);
         }, 380);
        /************************************************/

        let positionX = arqueroObj.x;
        let positionY = arqueroObj.y;
        let arrowObj = new Arrow(positionX, positionY);
        arrowArray.push(arrowObj);
        //console.log(arrowArray.length);

        Arrowsnd.play(); // Sonido de la flecha

        arqueroObj.canShoot = false;

        setTimeout(()=>{
            arqueroObj.canShoot = true;
         }, 1000) // Cooldown del disparo
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

function checkColisionArrowBeast(){ // Colisión de la flecha con el dragón
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

/*TEMPORIZADOR*/
function setTime() {
    totalSeconds++;
    minutesLabel.innerHTML = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    secondsLabel.innerHTML = (totalSeconds % 60).toString().padStart(2, "0");
  }
/****************************************/

//* EVENT LISTENERS
startBtnNode.addEventListener("click", ()=>{ //Botón de empezar a jugar
    startGame();
    Combatsnd.play();
});

restartBtnNode.addEventListener("click", ()=>{ // Botón de reiniciar
    startGame();
    Combatsnd.play();
});

window.addEventListener("keydown",(event)=>{ // Botones de movimiento del jugador
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
         }, 500) //Cooldown del salto
        
    }
})

window.addEventListener("keyup",(event)=>{ // El jugador no se mueve si el boton del movimiento no está pulsado
    if (event.code === "KeyD"){
        arqueroObj.isWalkingRight = false;
    }else if (event.code === "KeyA"){
        arqueroObj.isWalkingLeft = false;
    }
})