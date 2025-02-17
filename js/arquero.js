class Arquero {
    constructor(){

        // 1. Crear el nodo y añadirlo a la caja del juego
        this.node = document.createElement("img"); // creamos nodo del arquero <img/>
        this.node.src = "./images/archer.png" // Añadimos el src a la imagen // La llamada se hace desde el index, por eso se pone un solo "."
        gameBoxNode.append(this.node); //añadimos el nodo a la caja del juego

        // 2. configurar propiedades iniciales
        this.w = 100;
        this.h = 100;
        this.x = 60; //posicion eje horizontal
        this.y = gameBoxNode.offsetHeight - this.w; //posicion eje vertical
        
        this.node.style.position = "absolute" //para poder ubicarlo dentro de la caja del juego
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.width = `${this.w}px`;
        this.node.style.height = `${this.h}px`;
        
        // 3. añadir propiedades adicionales
        this.walkSpeed = 5;

        this.canShoot = true;
    }

    //metodos del arquero

    walkRigth(){
        if((this.x + this.w)<= (gameBoxNode.offsetWidth - 600)){
            this.x += this.walkSpeed;
            this.node.style.left = `${this.x}px`;
        }
    }

    walkLeft(){
        if((this.x + this.w) >= this.w){
            this.x -= this.walkSpeed;
            this.node.style.left = `${this.x}px`;
        }
    }
}