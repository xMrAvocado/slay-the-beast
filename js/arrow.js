class Arrow{
    constructor(positionX){
        // 1. Crear el nodo y añadirlo a la caja del juego
        this.node = document.createElement("img");
        this.node.src = "./images/player-projectile.png";
        
        gameBoxNode.append(this.node);

        // 2. configurar propiedades iniciales
        this.x = positionX; //posicion eje horizontal
        this.y = 620; //posicion eje vertical
        this.w = 50;
        this.h = 50;

        this.node.style.position = "absolute" //para poder ubicarlo dentro de la caja del juego
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.width = `${this.w}px`;
        this.node.style.height = `${this.h}px`;
        
        // 3. añadir propiedades adicionales
        this.movementSpeed = 10;//ayuda a que el entorno de juego sepa que tipo de objetos estoy creando.
    }

    automaticMovement(){
        this.x += this.movementSpeed;
        this.node.style.left = `${this.x}px`;
    }
}