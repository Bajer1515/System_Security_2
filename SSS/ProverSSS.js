const mcl = require('mcl-wasm');

class Prover{
    constructor(){
        this.sk = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.sk.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.g = new mcl.G1();
        this.g.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
        
        this.publicKey = mcl.mul(this.g,this.sk);
    }

    createCommitment(){
        this.x = new mcl.Fr();
        this.x.setByCSPRNG();
        
        this.X = new mcl.G1(); 
        this.X = mcl.mul(this.g,this.x);
        return this.X;
    }

    
    genProof(c){
        
        let s = new mcl.Fr();
        s = mcl.add(this.x, mcl.mul(this.sk,c));
        
        return s;
    }

}

module.exports = Prover;