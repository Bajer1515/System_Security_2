const mcl = require('mcl-wasm');
const sha3_512 = require('js-sha3').sha3_512;

class Signer{
    constructor(){
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
        
        this.a = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.a.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.A = mcl.mul(this.G1,this.a);
    }

   gen_r(){
       this.temp_r = new mcl.Fr();
       this.temp_r.setByCSPRNG;
       this.r = this.temp_r.getStr(2).slice(0,111);
       return this.r;
    }

   gen_z(msg){
       this.h = mcl.hashAndMapToG1(msg+this.r);
       this.z = mcl.mul(this.h,this.a);
       return this.z;
   }

   gen_u(){
       this.k = new mcl.Fr();
       this.k.setByCSPRNG;

       this.u = mcl.mul(this.G1,this.k);
       return this.u;
   }

   gen_v(){
       this.v = mcl.mul(this.h, this.k);
       return this.v;
   }

   gen_sigma(){
        this.sigma = [this.G1.getStr(10).slice(2),
                      this.h.getStr(10),
                      this.A.getStr(10).slice(2),
                      this.z.getStr(10),
                      this.u.getStr(10),
                      this.v.getStr(10)].join('');
        return this.sigma;
   }

   gen_H(){
       this.H = parseInt(sha3_512(this.sigma),10);
       return this.H;
    }

    gen_c(){
        this.c = new mcl.Fr();
        this.c.setStr(this.H+'');
        return this.c;
    }

    gen_AC(){
        this.ac = mcl.mul(this.a, this.c);
        return this.ac;
    }

    gen_s(){
        this.s = mcl.add(this.k, this.c);
        return this.s;
    }


}

module.exports = Signer;