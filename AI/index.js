const can = document.getElementById('c');
const ctx = can.getContext('2d');

can.width = (document.documentElement.clientWidth) / 1;
can.height = (document.documentElement.clientHeight) / 1;

//let x = new net(2, 4, 5, 1, 0);

let lastGen = [];

var bId = 0;

var topaId = -1;

function ac() {
    let vid = document.getElementById('acid').value;
    //alert(document.getElementById('alertyn').value);
    if (grave[vid] && grave[vid].brain && grave[vid].brain.w && document.getElementById('alertyn').checked) {
        alert("Ai #"+vid+' | DNA: (in JSON format)'+JSON.stringify(grave[vid].brain.w));
        document.getElementById('acid-out').value="Ai #"+vid+' | DNA: (in JSON format)'+JSON.stringify(grave[vid].brain.w);
    } else if (grave[vid] && grave[vid].brain && grave[vid].brain.w) {
        document.getElementById('acid-out').value="Ai #"+vid+' | DNA: (in JSON format)'+JSON.stringify(grave[vid].brain.w);
    }
}

const berd = function(x, y, w, h, dnaType, dna) {
    this.x = x;
    this.y= y;
    this.w = w;
    this.h = h;
    this.id = bId;
    bId++;
    this.alive = true;
    this.col = 'rgb('+Math.floor(Math.random() * 256)+','+Math.floor(Math.random() * 256)+','+Math.floor(Math.random() * 256)+')';
    if (dnaType == 0) {
        this.brain = new net(1, 6, 5, 1, 0);
    } else if (dnaType == 1) {
        this.brain = dna;
    }
    this.vy = 0;
    this.falling = false;
    this.jumping = false;
    this.fit = 0;
}

var pipes = [];

var pipeCool = 0;

var gen = 0;


const pipedis = 200;
const pipeW = 64;

const pipe = function(dis, w) {
    this.x = can.width;
    this.h1 = Math.floor(Math.random() * can.height/2);
    this.w = w;
    this.h2 = can.height - this.h1 - dis;
    this.y1 = 0;
    this.y2 = this.h1 + dis;
}

var birds = [];

let speed = 1;

function setSpeed(v) {
    if (v && v > 0) {
        speed = v;
    } else {
        speed = 1;
    }
}

var count = 0;

var grave = [];

for (var i = 0; i < 250; i++) {
    birds.push(new berd(50, can.height / 2 - 25, 32, 32, 0));
}

function updateGrave() {
    for (let i = 0; i < birds.length; i++) {
        grave.push(birds[i]);
    }
}
updateGrave();
let topa = 0;

pipes.push(new pipe(pipedis, pipeW));

setInterval(function() {
    can.width = (document.documentElement.clientWidth) / 1;
    can.height = (document.documentElement.clientHeight) / 1;

    ctx.fillStyle = '#8ff';
    ctx.fillRect(0, 0, can.width, can.height);


    for (var i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        ctx.fillStyle = '#090';
        ctx.fillRect(p.x, p.y1, p.w, p.h1);
        ctx.fillRect(p.x, p.y2, p.w, p.h2);

        p.x -= speed;

        if (pipes[i].x <= -64) {
            pipes.splice(i, 1);
            pipes.push(new pipe(pipedis, pipeW));
        }
    }

    if (pipeCool <= 0) {
        //pipes.push(new pipe(pipedis, pipeW));
        pipeCool = 250;
    }
    let al = 0;
    for (var i = 0; i < birds.length; i++) {
        let bi = birds[i];
        if (bi.alive) {
            al++;
            bi.fit += 1*speed;
            ctx.fillStyle = bi.col;
            ctx.fillRect(bi.x, bi.y, bi.w, bi.h);
        }

        bi.y -= bi.vy;

        if (bi.falling == true && bi.jumping == false) {
            if (bi.vy > -3) {
                bi.vy -= 0.025 * speed;
            }
        }

        if (bi.jumping == false && bi.y + bi.h < can.height) {
            bi.falling = true;
        }

        if (bi.y + bi.h >= can.height || bi.y < 0) {
            bi.falling = false;
            bi.y = can.height - bi.h;
            bi.alive = false;
            bi.vy = 0;
        }

        if (bi.jumping == true && bi.alive == true) {
            if (bi.vy > 0) {
                bi.vy -= 0.025 * speed;
            } else {
                bi.jumping = false;
            }
        }
        if (pipes[0]) {
        let px = pipes[0].x;
        let py = pipes[0].y1;
        let pw = pipes[0].w;
        let ph = pipes[0].h1;
        let ph2 = pipes[0].h2;
        let py2 = pipes[0].y2;

        if (bi.x < px + pw && bi.x + bi.w > px && bi.y < py + ph && bi.y + bi.h > py) {
            bi.falling = false;
            bi.y = can.height - bi.h;
            bi.alive = false;
            bi.vy = 0;
        } else if (bi.x < px + pw && bi.x + bi.w > px && bi.y < py2 + ph2 && bi.y + bi.h > py2) {
            bi.falling = false;
            bi.y = can.height - bi.h;
            bi.alive = false;
            bi.vy = 0;
        }

        //console.log(bi.brain.run([bi.vy, Math.abs(pipes[0].x - (bi.x + bi.w)), Math.abs((pipes[0].x + pipes[0].w) - (bi.x + bi.w)), Math.abs(bi.y - pipes[0].y1), Math.abs(bi.y + bi.h - pipes[0].y2)]))
        if (bi.alive && bi.brain && bi.brain.run && bi.brain.run([bi.vy, pipes[0].x - (bi.x + bi.w), (pipes[0].x + pipes[0].w) - (bi.x + bi.w), bi.y - pipes[0].y1, bi.y + bi.h - pipes[0].y2]) <= 0.5) {
            bi.vy = 2;
            bi.jumping = true;
        }

        ctx.fillStyle = bi.col;
        //ctx.fillRect(i*5, 600+bi.vy*10, 5, 5);

        //ctx.fillRect(bi.x, bi.y,  Math.abs(pipes[0].x - (bi.x + bi.w)), 5);

        //ctx.fillRect(bi.x, bi.y+5, Math.abs((pipes[0].x + pipes[0].w) - (bi.x + bi.w)), 5);

        //ctx.fillRect(bi.x, bi.y+10, 5, Math.abs(bi.y + bi.h - pipes[0].y2));
    }
}
if (al == 0) {
    ///evolve
    updateGrave();
    pipes[0].x = 1000;
    pipeCool = 250;
    let mush = eve(birds, 0.5, 5);

    //clear birds
    birds = [];

    //create based off of new brains
    for (let i = 0; i < mush.length; i++) {
        birds.push(new berd(50, can.height / 2 - 25, 32, 32, 1, mush[i]));
    }
    gen++;
    updateGrave();
}
    //if (pipeCool > 0) {
        pipeCool--;
    //}
    let bds = birds.slice().sort(function(a,b) {
        return b.fit - a.fit;
    })
    //document.getElementById('dfa').innerHTML = bds[0].fit;
    let dis = '';
    if (bds[0].fit > topa) {
        topa = bds[0].fit;
        topaId = bds[0].id;
    }
    dis+= 'Generation: '+gen+' Alive: '+al+'/'+birds.length+'<br><br>';
    dis += 'Top: ID: '+topaId+'  Score: '+topa+'<br>';
    for(let i = 0; i < 10; i++) {
        dis+='<p style="color: '+(bds[i].col)+'; font-family: `sans-serif`;"> ID: '+bds[i].id+' Score: '+bds[i].fit+'</p>';
    }
    document.getElementById('dfa').innerHTML = dis;
},1);