const mcl = require('mcl-wasm');

class Signer{
    constructor(){
        this.a = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.a.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
        
        this.A = mcl.mul(this.G1,this.a);
    }

    genx(){
        this.x = new mcl.Fr();
        this.x.setByCSPRNG();
        return this.x;
    }

    genX(){
        this.X = new mcl.G1(); 
        this.X = mcl.mul(this.G1,this.x);
        return this.X;
    }

    genh(msg){
        this.h = new mcl.G2();
        this.h = mcl.hashAndMapToG2(msg);
        return this.h;
    }

    genSigma(){
        this.sigma = new mcl.G2();
        this.sigma = mcl.mul(this.h, this.x);
        return this.sigma;
    }
}

module.exports = Signer;