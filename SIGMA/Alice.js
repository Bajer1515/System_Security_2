const mcl = require('mcl-wasm');
const sha3_512 = require('js-sha3').sha3_512;
const config = require('./config.js');

class Alice{
    constructor(config){
        this.G1 = new mcl.G1();
        this.G1.setStr(`${config.g1}`);
        
        this.a = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.a.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.A = new mcl.G1();
        this.A = mcl.mul(this.G1,this.a);
    
        this.sss_signer = sss.Signer(config)
        this.sss_signer.setPrivateKey(this.a.getStr(10));
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