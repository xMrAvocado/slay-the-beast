# SLAY THE BEAST

## [Play the Game!](https://xmravocado.github.io/slay-the-beast/)

![Game Logo](./images/logo.png)


# Description

Slay the Beast is a game where the player tries to kill a big bad monster while trying to avoid all his attacks. The game ends when the player kills the monster. After the game ends, a board is shown with all the times that took to kill it, ordered from least to greatest.


# Main Functionalities

- The player can move by clicking `a` and `d`.
- The player can jump by clicking `space`.
- The player can shoot by clicking `k`.
- A countup of the game is shown.
- A counter of the arrows left in the quiver is shown.
- Fireballs attacks appear at the top of the screen from random locations and a certain frequency.
- Arrows appear in a certain part of the screen that the player has the possibility to reach, from random locations and a certain frequency, to refill his quiver.
- Once the monster reached a certain health left, it enters in second phase, noticible by the change in the health color and the roar.
- Once entered in second phase, a spike attack appear at the bootom of the screen from the player location and a certain frequency, noticible by the roar made before the attack.
- The game ends when the monster´s health reach zero.
- Each timing is tracked and saved locally.
- A board is shown with the times ordered from least to greatest.

# Backlog Functionalities

- Add a tracking system with player names and times to do a global leaderboard.
- Improving the animations.
- Add a way for the boss to defend himself, like a barrier.

# Technologies used

- HTML
- CSS
- Javascript
- DOM Manipulation
- Local Storage
- JS Classes
- JS Audio

# States

- Start Screen
- Game Screen
- Game Over Screen
- Victory Screen

# Proyect Structure

## main.js

- startGame()
- gameLoop()
- gameOver()
- gameEnd()
- healthBeast()
- damageDragon()
- healthArcher()
- damageArcher()
- fireballSpawn()
- fireballDespawn()
- checkColisionArcherFireball()
- returnArrowSpawn()
- checkColisionArcherReturnArrow()
- spikeSpawn()
- spikeDespawn()
- checkColisionArcherSpike()
- window.addEventListener("keydown") => KeyK
- checkColisionArrowBeast()
- setTime()
- startBtnNode.addEventListener("click")
- restartBtnNode.addEventListener("click")
- window.addEventListener("keydown") => KeyD / KeyA / Space
- window.addEventListener("keyup") => KeyD / KeyA

## arquero.js

- Arquero () {
    this.node;

    this.x;
    this.y;
    this.w;
    this.h;

    this.walkSpeed;
    this.jumpSpeed;
    this.gravitySpeed;
    this.canShoot;
    this.canJump;

    this.isWalkingRight;
    this.isWalkingLeft;
    this.isJumping;
}
- walkRigth() {}
- walkLeft() {}
- jumpEffect() {}
- gravityEffect() {}

## arrow.js

- Arrow (positionX, positionY) {
    this.node;

    this.x;
    this.y;
    this.w;
    this.h;

    this.movementSpeed;
}
- automaticMovement() {}

## beast.js

- Beast () {
    this.node;

    this.x;
    this.y;
    this.w;
    this.h;

    this.isSecondPhase;
}

## fireball.js

- Fireball (positionX) {
    this.node;

    this.x;
    this.y;
    this.w;
    this.h;

    this.movementSpeed;
}
- automaticMovement() {}

## returnArrow.js

- ReturnArrow (positionX, positionY) {
    this.node;

    this.x;
    this.y;
    this.w;
    this.h;

    this.movementSpeed;
}

## spike.js

- Spike (positionX) {
    this.node;

    this.x;
    this.y;
    this.w;
    this.h;

    this.movementSpeed;
    this.spikeMovingUp;
}
- automaticMovement() {}

# Extra Links 

### Sketch
[Link](https://excalidraw.com/#json=LsaLGKDZrwfoLyKbjBz35,e83yk9KUhv9I9JGuuI--Nw)

### Slides
[Link](https://www.canva.com/design/DAGful7zNcQ/qdRZEfKI8PzOAfr5eF7eGw/view?utm_content=DAGful7zNcQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h7e132bde44)

## Deploy
[Link](https://xmravocado.github.io/slay-the-beast/)