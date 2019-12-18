const mcl = require('mcl-wasm');

class Verifier{
    constructor(){
        this.secretKey = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.secretKey.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.g = new mcl.G1();
        this.g.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
    }

    consumeAX(A,X){
        this.A = A;
        this.X = X;
    }
    createChallenge(){
  
        this.c = new mcl.Fr();
        this.c.setByCSPRNG();
        return this.c;
    }

    verify(s){
        let A_c = mcl.mul(this.A,this.c);
        let left = mcl.mul(this.g,s);
        let right = mcl.add(this.X,A_c);
        return left.isEqual(right);
    }
}

module.exports = Verifier;