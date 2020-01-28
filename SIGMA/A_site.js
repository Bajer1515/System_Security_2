const mcl = require('mcl-wasm');
const sha3_512 = require('js-sha3').sha3_512;

class Alice{
    constructor(){
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
        
        this.a = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.a.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.A = new mcl.G1();
        this.A = mcl.mul(this.G1,this.a);
    }

   gen_X(){
       this.x = new mcl.Fr();
       this.x.setByCSPRNG;

       this.X = new mcl.G1();
       this.X = mcl.mul(this.G1,this.x);
       return this.X;//.getStr(10).slice(2);
   }
/*
   gen_SSS(){

   }

   gen_MAC(){

   }*/
}

module.exports = Alice;