var spiller;
var myObstacles = [];
var myScore;
// Spiller er min røde block,  myObstacles er mine døds blokker og er et array, myScore  er til at tælle mine point

function startGame() {
    spiller = new component(30, 30, "Fisker.jpg", 10, 120, "image");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}
// er min function til at loade min spiller og points + style

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
         window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }    
}
//Laver mit canvas/gamearea, updatere myGameArea, og registrer hvis jeg klikker på mit tastatur



function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    if (type == "image" || type == "text") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y; 
    this.gravity = 0.00001; //forhøjer min gravity med tiden, per frame update
    this.gravitySpeed = 1;  //er min start speed
    
    
    
    this.update = function() {
        ctx = myGameArea.context;
         if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } // Skulle vise min score (havde problemer med rækkefølgen, scoren skal være først)
        if (this.type == "image" )  {
        ctx.drawImage(this.image, 
        this.x, 
        this.y,
        this.width, this.height);    
        // laver min spiller om til "Fisker"
             
                
    } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
            }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        
    }    
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
// CrashWith er min fuction til at se om min spiller rammer min myObstacles

function updateGameArea() {
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (spiller.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "black", x, 0));
        myObstacles.push(new component(10, x - height - gap, "black", x, height + gap));
    } // Laver myObstacles random, med en spawn timer på 3sec.
        for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    spiller.speedX = +0;
    spiller.speedY = 0;
    if (myGameArea.key && myGameArea.key == 38) {spiller.speedY = -2; }
    if (myGameArea.key && myGameArea.key == 40) {spiller.speedY = 2; }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    spiller.newPos();    
    spiller.update();
}
// laver min function updateGameArea, som tjekker om spiller har ramt noget, og stopper spillet hvis den har, jeg tilføjer også pil op og ned, som nu kan rykke min spiller


function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

