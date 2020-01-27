const mcl = require('mcl-wasm');
const sha3_512 = require('js-sha3').sha3_512;

class Verifier{
    constructor(){
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
    }

    verify(msg,A,sigma){
        this.A = A;

        let sigma = sigma;
        
        this.z = new mcl.G1();
        this.z = sigma.z;

        this.r = new mcl.Fr();
        this.r = sigma.r;
        
        this.s = new mcl.Fr();
        this.s = sigma.s;
        
        this.c = new mcl.Fr();
        this.c = sigma.c;

        this.h = new mcl.G1();
        this.h = mcl.hashAndMapToG1(msg+this.r);
        this.h = this.h.getStr(10);

        this.S = new mcl.G1();
        this.S = mcl.mul(this.G1,this.s);

        this.Ac = new mcl.G1();
        this.Ac = mcl.mul(this.A,this.c);

        this.u = new mcl.G1();
        this.u = mcl.div(this.S,this.Ac);

        this.v = new mcl.G1();
        this.v = mcl.div(mcl.mul(this.u,this.S),mcl.mul(this.z,this.c));

        this.input = [this.G1.getStr(10).slice(2),
            this.h.getStr(10),
            this.A.getStr(10).slice(2),
            this.z.getStr(10),
            this.u.getStr(10),
            this.v.getStr(10)].join('');
    
        this.H = parseInt(sha3_512(this.input),10);

        this.H.setStr(this.H+'');

      // this.h = msg+this.X.getStr(10).slice(2);
        // this.h1 = parseInt(sha3_512(this.h),10);
        
        // this.c = new mcl.Fr();
        // this.c.setStr(this.h1+'');
               
        // let Ac = new mcl.G1();
        // Ac = mcl.mul(this.A,this.c);
        let left = this.c;
        let right = this.H;
        return left.isEqual(right);
    }
}

module.exports = Verifier;