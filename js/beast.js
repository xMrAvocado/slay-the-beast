class Beast {
    constructor(){

        // 1. Crear el nodo y añadirlo a la caja del juego
        this.node = document.createElement("img"); // creamos nodo del pollito <img/>
        this.node.src = "./images/beast.png" // Añadimos el src a la imagen // La llamada se hace desde el index, por eso se pone un solo "."
        gameBoxNode.append(this.node); //añadimos el nodo a la caja del juego

        // 2. configurar propiedades iniciales
        this.w = 520;
        this.h = 700;
        this.x = gameBoxNode.offsetHeight; //posicion eje horizontal
        this.y = 0; //posicion eje vertical
        

        this.node.style.position = "absolute" //para poder ubicarlo dentro de la caja del juego
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.width = `${this.w}px`;
        this.node.style.height = `${this.h}px`;
        
        // 3. añadir propiedades adicionales

    }
}