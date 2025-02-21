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

//leaderboard
let leaderboardNode = document.querySelector("#leaderboard");

// Flechas
let arrowsLeftLabel = document.querySelector("#arrows-left");

// botones
const startBtnNode = document.querySelector("#start-btn")
const restartBtnNode = document.querySelector("#restart-btn")

// game box
const gameBoxNode = document.querySelector("#game-box")

//* VARIABLES GLOBALES DEL JUEGO
let totalSeconds = 0; //Contador para hacer la operación del temporizador.

let totalArrows = 10;

let arqueroObj = null;
let beastObj = null;

let fireballArray = [];
let arrowArray = [];
let spikeArray = [];
let returnArrowArray = [];

let gameIntervalId = null;
let fireballSpawnIntervalId = null;
let spikeSpawnIntervalId = null;
let timerIntervalId = null;
let returnArrowSpawnIntervalId = null;
let spikeSpawnTimeoutId = null; //Declarar los Interval y Timeout como variables globales.

let actualHealth = 1300; //Vida con la que empieza el enemigo y después se irá restando.
let actualHealthArcher = 400; //Vida con la que empieza el jugador y después se irá restando.

// Leaderboard
let username;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')); // Para más adelante extraer la info del localStorage

if(leaderboard === null){
    leaderboard = [];
}

/*
let leaderboard;
if(JSON.parse(localStorage.getItem('leaderboard')) === null){
leaderboard = [];
}else{
leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
}*/

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
let PickArrowsnd = new Audio("./sounds/pick_arrow.mp3");
PickArrowsnd.volume = 0.05;
/**************************************************/


//* FUNCIONES GLOBALES DEL JUEGO

function startGame(){
    actualHealth = 1300;
    actualHealthArcher = 400;//Cada vez que emmpieza la partida reseteamos las vidas al máximo

    healthRemaining.style.width = `${actualHealth}px`
    archerHealthRemaining.style.width = `${actualHealthArcher}px`

    totalSeconds = 0;
    
    minutesLabel.innerHTML = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    secondsLabel.innerHTML = (totalSeconds % 60).toString().padStart(2, "0");           //Cada vez que emmpieza la partida reseteamos el temporizador a 0

    totalArrows = 10;
    arrowsLeftLabel.innerHTML = totalArrows.toString().padStart(2, "0");    //Cada vez que emmpieza la partida reseteamos el total de flechas a 10

    healthRemaining.style.backgroundColor = `red`;
    GameOversnd.pause(); //Se pausa la música de fin del juego.
    GameOversnd.currentTime = 0; // La musica de fin del juego empieza de 0 siempre.

    Combatsnd.currentTime = 0; //La musica de combate empieza de 0 siempre.

    StartButtonsnd.play(); //Sonido de click del botón

    // 1. ocultar la pantalla inicial
    splashScreenNode.style.display = "none";

    // 2. mostrar pantalla del juego
    gameScreenNode.style.display = "flex";

    // 3. ocultar la pantalla reinicio
    victoryScreenNode.style.display = "none";
    gameOverScreenNode.style.display = "none";

    // 4. añadir los elementos iniciales del juego
    arqueroObj = new Arquero();
    beastObj = new Beast();

    // 5. iniciar intervalo principal del juego
    gameIntervalId = setInterval(()=>{
        gameLoop();
    }, Math.round(1000/60));

    // 6. iniciaremos otros intervalos adicionales
    fireballSpawnIntervalId = setInterval(()=>{
        fireballSpawn();
    }, 790)

    returnArrowSpawnIntervalId = setInterval(()=>{
        returnArrowSpawn();
    }, 3000)

    timerIntervalId = setInterval(setTime, 1000); // Intervalo del temporizador
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

    checkColisionArcherReturnArrow();

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
    clearInterval(returnArrowSpawnIntervalId);

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
    returnArrowArray.forEach((eachArrowReturn)=>{
        eachArrowReturn.node.remove();
    })
    returnArrowArray = [];
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
    clearInterval(returnArrowSpawnIntervalId);

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
    returnArrowArray.forEach((eachArrowReturn)=>{
        eachArrowReturn.node.remove();
    })
    returnArrowArray = [];
    arrowArray.forEach((eachArrow)=>{
        eachArrow.node.remove();
    })
    arrowArray= [];
    spikeArray.forEach((eachSpike)=>{
        eachSpike.node.remove();
    })
    spikeArray = []; //Limpiar todos los objetos y nodos

    /*PARA LEADERBOARD*/

    //1. Extraer el score de usuario.
    let actualTime = totalSeconds;

    //2. Almacenarlo en el array
    leaderboard.push(actualTime);

    //3. Ordenar el array (de menor a mayor en este caso)
    leaderboard.sort((elem1, elem2)=>{
        // agregamos una condicion de orden para que el sistema sepa si los va a ordenar numericamente, alfabeticamente, descendiente o ascendente.
    
        if(elem1 > elem2){
            return 1; //valor negativo indica que el primero va primero
        }else if(elem2 > elem1){
            return -1; //valor positivo indica que el primero va despues
        }else{
            return 0; //indica que los elemento no deben cambiar su orden
        }
    });

    //4. Imprimirlo en la pantalla con manip. de DOM
    leaderboard.forEach((eachTime)=>{
        leaderboardNode.innerHTML += `<p>${Math.floor(eachTime / 60).toString().padStart(2, "0")}:${(eachTime % 60).toString().padStart(2, "0")} mins</p>`;
    })

    //5. Almacenar el array en el localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

/*VIDA Y DAÑO DEL DRAGÓN*/
function healthBeast(){
    actualHealth = actualHealth - 50;
    healthRemaining.style.width = `${actualHealth}px`; //Baja la barra de vida con cada flecha impactada
    
    if (healthRemaining.style.width === `0px`){
        DeadBeastsnd.play();
        gameEnd(); //Cuando la vida llega a 0 salta la pantalla de victoria
    } else if(actualHealth <= 750 && beastObj.isSecondPhase === false){
        beastObj.isSecondPhase = true;
        healthRemaining.style.backgroundColor = `#ff5c00`;
        DeadBeastsnd.play();
        spikeSpawnIntervalId = setInterval(()=>{
            SpikeWarningsnd.play();
            spikeSpawnTimeoutId = setTimeout(()=>{
                spikeSpawn();
            }, 1000)    
        }, 3500)
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

/*RETURN ARROW SPAWN, DESPAWN AND COLLISION */
function returnArrowSpawn(){ // Spawn aleatorio de la recuperacion de flechas
    let randomPositionX = Math.floor(Math.random() * 600);
    let randomPositionY = Math.floor(Math.random() * ((gameBoxNode.offsetHeight - 100) - 400 + 1) + 400);
    let returnArrowObj = new ReturnArrow(randomPositionX, randomPositionY);
    returnArrowArray.push(returnArrowObj);
}

function checkColisionArcherReturnArrow(){ //Colisión de las bolas de fuego con el jugador
    returnArrowArray.forEach((eachReturnArrowObj, i)=>{

        if (
            eachReturnArrowObj.x < (arqueroObj.x + arqueroObj.w) &&
            eachReturnArrowObj.x + eachReturnArrowObj.w> arqueroObj.x &&
            eachReturnArrowObj.y < (arqueroObj.y + arqueroObj.h) &&
            eachReturnArrowObj.h + eachReturnArrowObj.y > arqueroObj.y
          ) {
            // ¡colisión detectada!
            PickArrowsnd.play();

            totalArrows++//Sumar una flecha al contador
            arrowsLeftLabel.innerHTML = totalArrows.toString().padStart(2, "0");

            // 1. Remover el Nodo
            eachReturnArrowObj.node.remove();
            // 2. Removerlo del JS (Array)
            returnArrowArray.splice(i, 1);
          }
    })
}
/************************************/

/*SPIKE SPAWN, DESPAWN AND COLLISION*/
function spikeSpawn(){ // Spawn del pincho en la posición x del jugador
        Spikesnd.play();
        let spikeObj = new Spike(arqueroObj.x);
        spikeArray.push(spikeObj);
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
    if (event.code === "KeyK" && arqueroObj.canShoot === true && totalArrows > 0){

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
        }, 380);
        setTimeout(()=>{
            clearInterval(arqueroObj.intervalArcher);
         }, 380);
        /************************************************/

        let positionX = arqueroObj.x;
        let positionY = arqueroObj.y;
        let arrowObj = new Arrow(positionX, positionY);
        arrowArray.push(arrowObj);

        Arrowsnd.play(); // Sonido de la flecha

        totalArrows--//Restar una flecha del contador
        arrowsLeftLabel.innerHTML = totalArrows.toString().padStart(2, "0");

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