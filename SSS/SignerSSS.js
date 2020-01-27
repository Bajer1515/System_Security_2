const mcl = require('mcl-wasm');
const sha3_512 = require('js-sha3').sha3_512;

class Signer{
    constructor(){
        this.a = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.a.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
        this.A = mcl.mul(this.G1,this.a);
    }

    createCommitment(){
        this.x = new mcl.Fr();
        this.x.setByCSPRNG();
        
        this.X = new mcl.G1(); 
        this.X = mcl.mul(this.G1,this.x);
        return this.X;
    }

    genC(msg){
        this.h = msg+this.X.getStr().slice(2);
        this.h1 = parseInt(sha3_512(this.h),10);
        return this.h1;
    }

    genS(){
        this.c = new mcl.Fr();
        // this.c = this.h1.getStr(10);
        this.c.setStr(this.h1+'');
        
        // this.s = new mcl.Fr();
        this.s = mcl.add(this.x, mcl.mul(this.a,this.c));
        return this.s;
    }

}

module.exports = Signer;