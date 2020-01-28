const mcl = require('mcl-wasm');
const sha3_512 = require('js-sha3').sha3_512;

class Bob{
    constructor(){
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');

        this.b = new mcl.Fr();
        this.b.setByCSPRNG;

        this.B = new mcl.G1();
        this.B = mcl.mul(this.G1,this.b);
    }

    gen_Y(){
        this.y = new mcl.Fr();
        this.y.setByCSPRNG;

        this.Y = new mcl.G1();
        this.Y = mcl.mul(this.G1,this.y);
    }

    // gen_SSS(){}

    // gen_MAC(){}
    
}

module.exports = Bob;