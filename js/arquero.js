class Arquero {
    constructor(){

        // 1. Crear el nodo y añadirlo a la caja del juego
        this.node = document.createElement("img");
        this.node.src = "./images/Archer/Attack1.PNG";// La llamada se hace desde el index, por eso se pone un solo "."
        gameBoxNode.append(this.node); //añadimos el nodo a la caja del juego


        // 2. configurar propiedades iniciales
        this.w = 81;
        this.h = 123;
        this.x = 60; //posicion eje horizontal
        this.y = gameBoxNode.offsetHeight - this.h; //posicion eje vertical
        
        this.node.style.position = "absolute" //para poder ubicarlo dentro de la caja del juego
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.width = `${this.w}px`;
        this.node.style.height = `${this.h}px`;
        
        // 3. añadir propiedades adicionales
        this.walkSpeed = 6;
        this.jumpSpeed = 11;
        this.gravitySpeed = 6;
        this.canShoot = true;
        this.canJump = true;

        this.isWalkingRight = false;
        this.isWalkingLeft = false;
        this.isJumping = false;
    }

    //metodos del arquero

    walkRigth(){
        if(this.isWalkingRight === true && (this.x + this.w) <= (gameBoxNode.offsetWidth - 600)){
            this.x += this.walkSpeed;
            this.node.style.left = `${this.x}px`;
        }
    }

    walkLeft(){
        if(this.isWalkingLeft === true && (this.x + this.w) >= this.w){
            this.x -= this.walkSpeed;
            this.node.style.left = `${this.x}px`;
        }
    }

    jumpEffect(){
        if(this.isJumping === true){
            this.y -= this.jumpSpeed;
            this.node.style.top = `${this.y}px`;
        }
        
    }

    gravityEffect(){
        if((this.y + this.h) < gameBoxNode.offsetHeight){
            this.y += this.gravitySpeed;
            this.node.style.top = `${this.y}px`;
        }
    }
}