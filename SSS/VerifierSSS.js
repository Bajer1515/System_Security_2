const mcl = require('mcl-wasm');
const sha3_512 = require('js-sha3').sha3_512;
// const Hash = require('./hash.js');

class Verifier{
    constructor(){
        // this.sk = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        // this.sk.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.g1 = new mcl.G1();
        this.g1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
    }

    // consumeAX(A,X){
    //     this.A = A;
    //     this.X = X;
    // }

    // createC(m,X){
    //     this.c = mcl.hashAndMapToG1(X|msg);
    // }

    verify(msg,s,X,A){
        this.A = new mcl.G1();
        this.A = A;
        
        this.X = new mcl.G1()
        this.X = X;

        this.h = msg+this.X.getStr(10).slice(2);
        this.h1 = parseInt(sha3_512(this.h),10);
        this.c.setStr(this.h1+'');
        
        this.s = new mcl.Fr();
        this.s.setStr(s);
        this.S = mcl.mul(this.g1,this.s);
        
        let A_c = mcl.mul(this.A,this.c);
        let left = mcl.mul(this.g,this.s);
        let right = mcl.add(this.X,A_c);
        return left.isEqual(right);
    }
}

module.exports = Verifier;