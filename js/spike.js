class Spike{
    constructor(positionX){
        // 1. Crear el nodo y añadirlo a la caja del juego
        this.node = document.createElement("img");
        this.node.src = "./images/spike.png";
        
        gameBoxNode.append(this.node);

        // 2. configurar propiedades iniciales
        this.w = 55;
        this.h = 100;
        this.x = positionX; //posicion eje horizontal
        this.y = gameBoxNode.offsetHeight + 50; //posicion eje vertical
        
        this.node.style.position = "absolute" //para poder ubicarlo dentro de la caja del juego
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.width = `${this.w}px`;
        this.node.style.height = `${this.h}px`;
        
        // 3. añadir propiedades adicionales
        this.movementSpeed = 7;

        this.spikeMovingUp = true;
    }

    automaticMovement(){
        if (this.spikeMovingUp === true) {
            this.y -= this.movementSpeed;
        }else{
            this.y += this.movementSpeed;
        }
        if((this.y) < (gameBoxNode.offsetHeight - this.h)){
            this.spikeMovingUp = false;
        }
        this.node.style.top = `${this.y}px`;
    }
}