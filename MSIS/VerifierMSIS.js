const mcl = require('mcl-wasm');

class Verifier{
    constructor(){
        this.secretKey = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.secretKey.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.g1 = new mcl.G1();
        this.g1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
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

    verify(S){
        // this.g2 = new mcl.G2();
        this.g2 = mcl.hashAndMapToG2(this.X.getStr(16).slice(2)+this.c.getStr(16));

        let A_c = mcl.mul(this.A,this.c);
        // let left = mcl.mul(this.g2,s);
        let XAc = mcl.add(this.X,A_c);
        e1 = mcl.pairing(this.g1,this.S);
        e2 = mcl.pairing(this.g2,XAc);
        // return e1.isEqual(e2);
        let L = e1.getStr();
        let P = e2.getStr();
        return L.isEqual(P);
    }
}

module.exports = Verifier;