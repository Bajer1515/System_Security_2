const mcl = require('mcl-wasm');

class Prover{
    constructor(){
        this.secretKey = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.secretKey.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden

        this.g1 = new mcl.G1();
        this.g1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
        this.publicKey = mcl.mul(this.g1, this.secretKey); //działamy na eliptic curves, więc tutaj nie podnosimy do potęgi tylko mnożymy. I mamy nowy punkt.
    }

    createCommitment(){
        this.x = new mcl.Fr();
        this.x.setByCSPRNG();

        // this.X = new mcl.G2();
        this.X = mcl.mul(this.g1, this.x);
        return this.X;
    }

    genProof(C){
        this.c = new mcl.Fr();
        this.c = C;
        this.s = mcl.add(this.x, mcl.mul(this.secretKey, this.c));

        this.g2 = mcl.hashAndMapToG2(this.X.getStr(10).slice(2) + this.c.getStr(10).slice(2));
        
        this.S = mcl.mul(this.g2,this.s);
        return this.S;
    }

}

module.exports = Prover;