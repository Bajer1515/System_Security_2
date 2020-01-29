const mcl = require('mcl-wasm');
const sha3_512 = require('js-sha3').sha3_512;
// const Hash = require('./hash.js');

class Verifier{
    constructor(B, g){
        this.G1 = new mcl.G1();
        // this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
        this.G1 = g;
        
        this.B = new mcl.G1();
        this.B = B;
        
    }

    verify(msg,ss,X){
        
        this.X = new mcl.G1()
        this.X = X;

        this.h = msg+this.X.getStr(10).slice(2);
        this.h1 = parseInt(sha3_512(this.h),10);
        
        this.c = new mcl.Fr();
        this.c.setStr(this.h1+'');
        
        let Ac = new mcl.G1();
        Ac = mcl.mul(this.B,this.c);
        let left = mcl.mul(this.G1,ss);
        let right = mcl.add(this.X,Ac);//mcl.mul(this.A,this.c));
        return left.isEqual(right);
    }
}

module.exports = Verifier;