const mcl = require('mcl-wasm');

class Verifier{
    constructor(){
        // this.secretKey = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        // this.secretKey.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.g1 = new mcl.G1();
        this.g1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
    }

    consumeAX(A,X){
        // A = new mcl.G1();
        this.A = A;

        // this.X = new mcl.G1();
        this.X = X;
    }
    createChallenge(){
  
        this.c = new mcl.Fr();
        this.c.setByCSPRNG();
        return this.c;
    }

    verify(s){
        // this.S = new mcl.G2();
        this.S = s;
        this.g2 = mcl.hashAndMapToG2(this.X.getStr(10).slice(2)+this.c.getStr(10).slice(2));

        let A_c = mcl.mul(this.A,this.c);
        // let left = mcl.mul(this.g2,s);
        let XAc = mcl.add(this.X,A_c);

        this.e1 = mcl.pairing(this.g1, this.S);
        this.e2 = mcl.pairing(XAc,this.g2);
        // return e1.isEqual(e2);
        let left = this.e1.getStr(10);
        let right = this.e2.getStr(10);
        console.log(left);
        console.log(right);

        return left === right;
    }
}

module.exports = Verifier;