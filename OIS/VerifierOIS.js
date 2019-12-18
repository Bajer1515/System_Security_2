const mcl = require('mcl-wasm');

class Verifier{
    constructor(){
        this.sk1 = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.sk1.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        this.sk2 = new mcl.Fr();
        this.sk2.setByCSPRNG();
        
        this.g1 = new mcl.G1();
        this.g1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
        this.g2 = new mcl.G1();
        this.g2.setStr('1 2144250947445192081071618466765046647019257686245947349033844530891338159027816696711238671324221321317530545114427 2665798332422762660334686159210698639947668680862640755137811598895238932478193747736307724249253853210778728799013');
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

    verify(s1,s2){
        let A_c = mcl.mul(this.A,this.c);
        let left = mcl.add(mcl.mul(this.g1,s1),mcl.mul(this.g2,s2));
        let right = mcl.add(this.X,A_c);
        return left.isEqual(right);
    }
}

module.exports = Verifier;