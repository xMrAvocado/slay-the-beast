class Beast {
    constructor(){

        // 1. Crear el nodo y añadirlo a la caja del juego
        this.node = document.createElement("img"); // creamos nodo del pollito <img/>
        this.arrayDragon = ["./images/Dragon/dragon0.PNG", "./images/Dragon/dragon1.PNG", "./images/Dragon/dragon2.PNG", "./images/Dragon/dragon1.PNG"];
        gameBoxNode.append(this.node);
        this.node.src = this.arrayDragon[0];
        let counter = 1;
        this.intervalBeast = setInterval(()=>{
            this.node.src = this.arrayDragon[counter]; // Añadimos el src a la imagen // La llamada se hace desde el index, por eso se pone un solo "."
            counter ++;
            if (counter > this.arrayDragon.length - 1){
                counter = 0;
            }
            console.log("Intervalo Dragon");
        }, 500);

        // 2. configurar propiedades iniciales
        this.w = 800;
        this.h = 400;
        this.x = 80 + gameBoxNode.offsetHeight; //posicion eje horizontal
        this.y = 315; //posicion eje vertical
        

        this.node.style.position = "absolute" //para poder ubicarlo dentro de la caja del juego
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.width = `${this.w}px`;
        this.node.style.height = `${this.h}px`;
        
        // 3. añadir propiedades adicionales
    }
}