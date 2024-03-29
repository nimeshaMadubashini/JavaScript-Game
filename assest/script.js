window.addEventListener('load', function () {

    /*canvas setup*/

    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', e => {
                if (((e.key === 'ArrowUp') ||
                    (e.key === 'ArrowDown')


                ) && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                } else if (e.key === ' ') {
                    this.game.player.shootTop();
                } else if (e.key == 'd') {
                    this.game.debug = !this.game.debug;
                }
            });
            window.addEventListener('keyup', e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }

            });
        }
    }

    class projectile {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markForDeletion = false;
            this.image = document.getElementById('projecttile');

        }

        update() {
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) this.markForDeletion = true;
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y);

        }
    }

   /* class particle {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('gears');
            this.frameX = Math.floor(Math.random() * 3);
            this.frameY = Math.floor(Math.random() * 3);
            this.spriteSize = 50;
            this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1);
            this.size = this.spriteSize * this.sizeModifier;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * -15;
            this.gravity = 0.5;
            this.markForDirection = false;
            this.angle = 0;
            this.va = Math.random() * 0.2 - 0.1;
            this.bounced = 0;
            this.bottomBounceBoundery = Math.random() * 80 + 60;


        }

        update() {
            this.angle += this.va;
            this.speedY += this.gravity;
            this.x -= this.speedX + this.game.speed;
            this.y += this.speedY;
            if (this.y > this.game.height + this.size || this.x < 0 - this.size) this.markForDirection = true;
            if (this.y > this.game.height - this.bottomBounceBoundery && this.bounced < 5) {
                this.bounced++;
                this.speedY *= -0.7;
            }
        }

        draw(context) {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.drawImage(this.image,
                this.frameX * this.spriteSize,
                this.frameY * this.spriteSize,
                this.spriteSize,
                this.spriteSize,
                this.size * -0.5, this.size * -0.5,
                this.size, this.size);
            context.restore();
        }
    }*/
    class particle {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('gears');
            this.frameX = Math.floor(Math.random() * 3);
            this.frameY = Math.floor(Math.random() * 3);
            this.spriteSize = 50;
            this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1);
            this.size = this.spriteSize * this.sizeModifier;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * -15;
            this.gravity = 0.5;
            this.markForDirection = false;
            this.angle = 0;
            this.va = Math.random() * 0.2 - 0.1;
            this.bounced = 0;
            this.bottomBounceBoundary = Math.random() * 100 + 60;
        }

        update() {
            this.angle += this.va;
            this.speedY += this.gravity;
            this.x -= this.speedX + this.game.speed;
            this.y += this.speedY;

            if (this.y > this.game.height + this.size || this.x < 0 - this.size) {
                this.markForDirection = true;
            }

            if (this.y > this.game.height - this.bottomBounceBoundary && this.bounced < 2) {
                this.bounced++;
                this.speedY *= -0.7;
            }
        }

        draw(context) {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.drawImage(
                this.image,
                this.frameX * this.spriteSize,
                this.frameY * this.spriteSize,
                this.spriteSize,
                this.spriteSize,
                this.size * -0.5,
                this.size * -0.5,
                this.size,
                this.size
            );
            context.restore();
        }
    }


    class player {
        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
            this.x = 20;
            this.y = 100;
            /*player move y axis*/
            this.speedY = 0;
            this.maxSpeed = 5;
            this.projecttiles = [];
            this.image = document.getElementById('player');
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerUpLimit = 10000;
        }

        update(deltaTime) {
            if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
            else this.speedY = 0;
            this.y += this.speedY;
            /*verticla boundaries*/
            if (this.y > this.game.height - this.height * 0.5) this.y = this.game.height - this.height * 0.5;
            else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;
            //handle projectiles
            this.projecttiles.forEach(projectile => {
                projectile.update();
            });
            this.projecttiles = this.projecttiles.filter(projectile => !projectile.markForDeletion)
            /*sprite animation*/
            if (this.frameX < this.maxFrame) {
                this.frameX++;

            } else {
                this.frameX = 0;
            }
            /*power Up*/
            if (this.powerUp) {
                if (this.powerUpTimer > this.powerUpLimit) {
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                    this.frameY = 0;
                } else {
                    this.powerUpTimer += deltaTime;
                    this.frameY = 1;
                    this.game.ammo += 0.1;
                }
            }
        }

        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            this.projecttiles.forEach(projectile => {
                projectile.draw(context);
            });
            context.drawImage(this.image, this.frameX * this.width,
                this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);

        }

        shootTop() {
            if (this.game.ammo > 0) {
                this.projecttiles.push(new projectile(this.game, this.x + 80, this.y + 30));
                this.game.ammo--;
            }
            if (this.powerUp) this.shootBottom();

        }

        shootBottom() {
            if (this.game.ammo > 0) {
                this.projecttiles.push(new projectile(this.game, this.x + 80, this.y + 175));
            }
        }

        enterPowerUp() {
            this.powerUpTimer = 0;
            this.powerUp = true;
            if (this.game.ammo < this.game.maxAmmo) this.game.ammo = this.game.maxAmmo;
        }
    }

    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1.5 - 0.5;
            this.markForDeletion = false;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;

        }

        update() {
            this.x += this.speedX - this.game.speed;
            if (this.x + this.width < 0) this.markForDeletion = true;
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else this.frameX = 0;
        }

        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
            if (this.game.debug) {
                context.font = '20px Helvetica'
                context.fillText(this.lives, this.x, this.y)
            }

        }
    }

    class Angler1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 228;
            this.height = 169;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random() * 3);
            this.lives = 2;
            this.score = this.lives;
        }
    }

    class Angler2 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 213;
            this.height = 165;
            this.y = Math.random() * (this.game.height * 0.95- this.height);
            this.image = document.getElementById('angler2');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 3;
            this.score = this.lives;
        }
    }
    class luckyFish extends Enemy {
        constructor(game) {
            super(game);
            this.width = 99;
            this.height = 95;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('lucky');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 3;
            this.score = 15;
            this.type = 'lucky';
        }
    }
    class HiveWhale extends Enemy {
        constructor(game) {
            super(game);
            this.width = 400;
            this.height = 227;
            this.y = Math.random() * (this.game.height * 0.95- this.height);
            this.image = document.getElementById('hiveWhale');
            this.frameY =0;
            this.lives = 15;
            this.score = this.lives;
            this.type = 'hive';
            this.speedX=Math.random()* -1.2 -0.2;
        }
    }
    class Drone extends Enemy {
        constructor(game,x,y) {
            super(game);
            this.width = 115;
            this.height = 95;
            this.x=x;
            this.y=y;
            this.image = document.getElementById('drone');
            this.frameY=Math.floor(Math.random()*2);
            this.frameY =0;
            this.lives = 3;
            this.score = this.lives;
            this.type = 'drone';
            this.speedX=Math.random()* -4.2 -0.5;
        }
    }

    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedmodifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = this.game.height - this.height;        }

        update() {
            if (this.x <= -this.width) this.x = 0;
            this.x -= this.game.speed * this.speedmodifier;
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);


        }
    }

    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');
            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.4);
            this.layer3 = new Layer(this.game, this.image3, 1);
            this.layer4 = new Layer(this.game, this.image4, 1.5);
            this.layer1.y = 0;

            // Position layer 4 at the bottom
            this.layer4.y = this.game.height - this.layer4.height;
            this.layers = [this.layer1, this.layer2, this.layer3];
        }

        update() {
            this.layers.forEach(layer => layer.update());
        }

        draw(context) {
            this.layers.forEach(layer => layer.draw(context))


        }
    }

    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Bangers';
            this.color = 'white'
        }

        draw(context) {
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';

            context.font = this.fontSize + 'px ' + this.fontFamily;
            /*score*/
            context.fillText('Score' + this.game.score, 20, 40);


            /*timer*/
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Timer:  ' + formattedTime, 20, 100);




            /*game  over masseage*/
            if (this.game.gameOver) {
                context.textAlign = 'center';
                let message1;
                let message2;
                if (this.game.score > this.game.winningScores[0] && this.game.score <= this.game.winningScores[1]) {
                    message1 = 'Level 2';
                    message2 = 'Well done explorer!';
                    this.game.speed = 2;
                } else if (this.game.score > this.game.winningScores[1] && this.game.score <= this.game.winningScores[2]) {
                    message1 = 'Level 3';
                    message2 = 'Well done explorer!';
                    this.game.speed = 3;
                } else if (this.game.score > this.game.winningScores[2] && this.game.score <= this.game.winningScores[3]) {
                    message1 = 'Level 4';
                    message2 = 'Well done explorer!';
                    this.game.speed = 4;
                } else {
                    message1 = 'Blazes!';
                    message2 = 'Get my repair kit and try again';
                }

                context.font = '100px' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 20);

                context.font = '25px' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 20);

            }
            /*ammo*/
            if (this.game.player.powerUp) context.fillStyle = '#ffffbd'
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
            context.fillText('Level: ' + (this.game.currentLevel + 1), 20, 70);

            context.restore();
        }
    }

   /* class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background = new Background(this)
            this.player = new player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];
            this.enemies = [];
            this.practicle = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.ammo = 20;
            this.maxAmmo = 50
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.gameOver = false;
            this.score = 0;
            this.winningScores = [10, 20, 30, 40]; // Define winning scores for each level
            this.currentLevel = 0; // Initialize with level 0
            this.gameTime = 0;
            this.timeLimit = 15000;
            this.speed = 1;
            this.debug = false;
        }

        update(deltaTime) {
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.gameTime > this.timeLimit) this.gameOver = true;
            this.background.update();
            this.background.layer4.update();
            this.player.update(deltaTime);
            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;

            } else {
                this.ammoTimer += deltaTime
            }
            this.practicle.forEach(particle => particle.update());
            this.practicle = this.practicle.filter(particle => !particle.markForDirection);
            this.enemies.forEach(enemy => {
                enemy.update();
                if (this.checkCollision(this.player, enemy)) {
                    enemy.markForDeletion = true;
                    for (let i = 0; i < enemy.score; i++) {
                        this.practicle.push(new particle(this, enemy.x + enemy.width * 0.5,
                            enemy.y + enemy.height * 0.5));
                    }
                    if (enemy.type === 'lucky') this.player.enterPowerUp();
                    else this.score--;
                }
                this.player.projecttiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        enemy.lives--;
                        projectile.markForDeletion = true;
                        this.practicle.push(new particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                        if (enemy.lives <= 0) {
                            for (let i = 0; i < enemy.score; i++) {
                                this.practicle.push(new particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                            }
                            enemy.markForDeletion = true;
                            if(enemy.type ==='hive'){
                                for (let i = 0; i < 5; i++) {
                                    this.enemies.push(new  Drone(this,
                                        enemy.x+Math.random()*enemy.width,
                                        enemy.y+Math.random()*
                                        enemy.height*0.5));
                                }

                            }
                            if (!this.gameOver) this.score += enemy.score;
                            /!*according to score game ove and level up*!/
                            if (this.score > this.winningScore) {
                                this.gameOver = true;
                            }
                        }
                    }
                })
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markForDeletion);
            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer = 0;

            } else {
                this.enemyTimer += deltaTime;
            }
            if (this.score >= this.winningScores[this.currentLevel]) {
                this.currentLevel++;
                // Adjust game properties based on the current level
                switch (this.currentLevel) {
                    case 1:
                        this.speed = 2;
                        // Add any other level-specific adjustments
                        break;
                    case 2:
                        this.speed = 3;
                        // Add any other level-specific adjustments
                        break;
                    // Add more cases for additional levels
                }
                this.enemyTimer = 0;

            }
        }

        draw(context) {
            this.background.draw(context);
            this.ui.draw(context);
            this.player.draw(context);
            this.practicle.forEach(particle => particle.draw(context));
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.background.layer4.draw(context);
        }

        addEnemy() {
            const randomize = Math.random();
            if (randomize < 0.3) this.enemies.push(new Angler1(this));
            else if (randomize < 0.6) this.enemies.push(new Angler2(this));
            else if (randomize < 0.8) this.enemies.push(new HiveWhale(this));
            this.enemies.push(new luckyFish(this));
        }


        checkCollision(rect1, rect2) {
            return (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y
            )
        }

    }*/
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];
            this.enemies = [];
            this.practicle = [];
            this.enemyTimer = 0;
            this.enemyInterval = 2000;
            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.gameOver = false;
            this.score = 0;
            this.winningScores = [10, 15, 20, 20]; // Define winning scores for each level
            this.currentLevel = 0; // Initialize with level 0
            this.gameTime = 0;
            this.timeLimit = 16000;
            this.speed = 0.5;
            this.debug = false;
        }

        update(deltaTime) {
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.gameTime > this.timeLimit) this.gameOver = true;
            this.background.update();
            this.background.layer4.update();
            this.player.update(deltaTime);
            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }
            this.practicle.forEach(particle => particle.update());
            this.practicle = this.practicle.filter(particle => !particle.markForDirection);
            this.enemies.forEach(enemy => {
                enemy.update();
                if (this.checkCollision(this.player, enemy)) {
                    enemy.markForDeletion = true;
                    for (let i = 0; i < enemy.score; i++) {
                        this.practicle.push(new particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                    }
                    if (enemy.type === 'lucky') this.player.enterPowerUp();
                    else this.score--;
                }
                this.player.projecttiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        enemy.lives--;
                        projectile.markForDeletion = true;
                        this.practicle.push(new particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                        if (enemy.lives <= 0) {
                            for (let i = 0; i < enemy.score; i++) {
                                this.practicle.push(new particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                            }
                            enemy.markForDeletion = true;
                            if (enemy.type === 'hive') {
                                for (let i = 0; i < 5; i++) {
                                    this.enemies.push(new Drone(this,
                                        enemy.x + Math.random() * enemy.width,
                                        enemy.y + Math.random() * enemy.height * 0.5));
                                }
                            }
                            if (!this.gameOver) this.score += enemy.score;
                            if (this.score > this.winningScores[this.currentLevel]) {
                                this.gameOver = true;
                            }
                        }
                    }
                });
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markForDeletion);
            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            if (this.score >= this.winningScores[this.currentLevel]) {
                this.currentLevel++;
                switch (this.currentLevel) {
                    case 1:
                        this.speed = 0.75;
                        this.enemyInterval=2000;
                        this.addEnemy();
                        break;
                    case 2:
                        this.enemyInterval=2500;

                        this.speed = 1;
                        this.addEnemy();

                        break;
                    case 3:
                        this.enemyInterval=3000;

                        this.speed = 1.05;
                        this.addEnemy();

                        break;
                }
                this.enemyTimer = 0;
            }
        }

        draw(context) {
            this.background.draw(context);
            this.ui.draw(context);
            this.player.draw(context);
            this.practicle.forEach(particle => particle.draw(context));
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.background.layer4.draw(context);
        }

       /* addEnemy() {
            const randomize = Math.random();
            if (randomize < 0.3) this.enemies.push(new Angler1(this));
            else if (randomize < 0.6) this.enemies.push(new Angler2(this));
            else if (randomize < 0.8) this.enemies.push(new HiveWhale(this));
            this.enemies.push(new luckyFish(this));
        }*/
        addEnemy() {
            const randomize = Math.random();
            let numEnemies = 1; // Default number of enemies to add

            // Increase the number of enemies based on the current level
            switch (this.currentLevel) {
                case 0:
                    numEnemies = 1;
                    break;
                case 1:
                    numEnemies = 2;
                    break;
                case 2:
                    numEnemies = 3;
                    break;
                // Add more cases for additional levels
            }

            // Add the specified number of enemies
            for (let i = 0; i < numEnemies; i++) {
                if (randomize < 0.3) this.enemies.push(new Angler1(this));
                else if (randomize < 0.6) this.enemies.push(new Angler2(this));
                else if (randomize < 0.8) this.enemies.push(new HiveWhale(this));
                this.enemies.push(new luckyFish(this));
            }
        }

        checkCollision(rect1, rect2) {
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y
            );
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    /*animation loop*/

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        console.log(deltaTime);
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate)
    }

    animate(0);
});
