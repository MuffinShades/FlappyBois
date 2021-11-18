function sigmoid(a) {
    if (a >= 20) {
        return 1;
    } else if (a <= -20) {
        return -1;
    } else {
        return 1 / (1 + Math.exp(-a));
    }
}

function rnd() {
    return Math.random();
}

function rndArray(l) {
    let arr = [];
    for (var i = 0; i < l; i++) {
        arr.push(Math.random() * 2 - 1);
    }
    return arr;
}

const net = function(hiddenLayers, hidden_nodes, ins, outs, dnaType, dna) {
    this.hl = hiddenLayers;
    this.h_nodes = hidden_nodes;
    this.ins = ins;
    this.outs = outs;

if (dnaType == 0) {
    //create weights
    this.w = new Array(2 + this.hl);

    for (var b = 0; b < this.w.length; b++) {
        if (b == 0) {
            this.w[b] = [];
            if (this.hl  > 0 && this.h_nodes > 0) {
                for (var i = 0; i < this.ins; i++) {
                    this.w[b][i] = rndArray(this.h_nodes);
                }
            } else {
                for (var i = 0; i < this.ins; i++) {
                    this.w[b][i] = rndArray(this.outs);
                }
            }
        } else if (b != this.w.length - 1) {
            this.w[b] = [];
            if (this.hl  > 1) {
                for (var i = 0; i < this.h_nodes; i++) {
                    this.w[b][i] = rndArray(this.h_nodes);
                }
            } else {
                for (var i = 0; i < this.h_nodes; i++) {
                    this.w[b][i] = rndArray(this.outs);
                }
            }
        } else {
            this.w[b] = [];
            if (this.hl > 0 && this.h_nodes > 0) {
                for (var i = 0; i < this.outs; i++) {
                    this.w[b][i] = rndArray(this.h_nodes);
                }
            } else {
                for (var i = 0; i < this.outs; i++) {
                    this.w[b][i] = rndArray(this.ins);
                }
            }
        }
    }
} else if (dnaType = 1) {
    this.w = dna;
}

    //run net
    this.run = function(ar) {
        this.hid = [];

        for (var i = 0; i < this.hl; i++) {
            this.hid.push([]);
            let v = new Array(this.h_nodes).fill(0);
            //calculate hidden value
            if (i == 0) {
                //calculate values
                for (var k = 0; k < this.h_nodes; k++) {
                    for (var j = 0; j < this.w[0].length; j++) {
                        v[k] += ar[j] * this.w[0][j][k];
                    }
                } 
            } else {
                //calcutae values
                for (var k = 0; k < this.h_nodes; k++) {
                    for (var j = 0; j < this.w[i].length; j++) {
                        v[k] += this.hid[i - 1][j] * this.w[i][j][k];
                    }
                }
            }


            //apply sigmoid
            v.forEach(function(a, b) {
                v[b] = sigmoid(v[b]);
            });

            this.hid[i] = v;
        }

        //calculate outs
        this.returnValues = [];

        for (var i = 0; i < this.outs; i++) {
            for (var j = 0;  j < this.hid[this.hid.length - 1].length - 1; j++) {
                this.returnValues[i] = this.hid[this.hid.length - 1][j] * this.w[this.w.length - 1][i][j];
            }
        }

        return this.returnValues;
    }
}

function eve(parents, mutationRate, survive) {
    //sort birds by fitness

    //mutationRate=5;
    let bii=parents;
    let biClone = bii;

    biClone = biClone.sort(function(a,b){
        return b.fit - a.fit;
    });
    let news = [];

    biClone = biClone.slice(0, survive);

    for (let i = 0; i < biClone.length*(parents.length/survive); i++) {
        //create fresh brain
        let db = new net(1, 6, 5, 1, 0);

        //pick parents
        let p = [];
        p.push(biClone[Math.floor(Math.random() * biClone.length)]);
        p.push(biClone[Math.floor(Math.random() * biClone.length)]);

        //change bois brain (loop through)
        for (let j = 0; j < db.length; j++){
            for (let k = 0; k < db[j].length; k++) {
                for (let l = 0; l < db[j][k].length; l++) {
                    //decide if should mutate
                    if (Math.random() <= mutationRate) {
                        //pick parent
                        let pn = Math.floor(Math.random() * pn.length);

                        //change child brain
                        db[j][k][l] = p[pn].brain[j][k][l];
                    }
                }
            }
        }

        news.push(db);
        //console.log(db);
    }

    //merge biClone and news
    /*for (let i = 0; i < biClone.length; i++) {
        news.push(biClone[i].brain);
    }*/

    //send of the kids
    return news;
}
//console.log(new net(1, 6, 5, 1, 0));