const mcl = require('mcl-wasm');
const uuidv4 = require('uuid/v4');
const assert = require('assert');
const sha3_512 = require('js-sha3').sha3_512;

class Signer {
    constructor() {
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');

        this.a = new mcl.Fr();
        this.a.setByCSPRNG();
    }

    setPrivateKey(privKey) {
        this.a = new mcl.Fr();
        this.a.setStr(privKey);
    }

    getPublicKey() {
        this.A = mcl.mul(this.G1,this.a);
        return this.A.getStr(10).slice(2);
    }
    generateCommitment() {
        this.x = new mcl.Fr();
        this.x.setByCSPRNG();

        this.X = new mcl.G1();
        this.X = mcl.mul(this.G1,this.x);
    }

    async signMessage(msg) {
        if(!this.X) {
            this.generateCommitment();
        }
        
        this.h = msg+this.X.getStr(10).slice(2);
        this.h1 = parseInt(sha3_512(this.h),10);

        this.c = new mcl.Fr();
        
        this.c.setStr(this.h1+'');
        this.s = mcl.add(mcl.mul(this.a,this.c),this.x);
        return {s: this.s.getStr(10),X: this.X.getStr(10).slice(2)};
    }

}

class Verifier {
    constructor() {
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
    }

    verify(msg, s, X, A) {
        try {
            this.A = new mcl.G1();
            this.A.setStr(`1 ${A}`);
            
            this.X = new mcl.G1();
            this.X.setStr(`1 ${X}`);

            this.h = msg+this.X.getStr(10).slice(2);
            this.h1 = parseInt(sha3_512(this.h),10);
            this.c = new mcl.Fr();
            
            this.c.setStr(this.h1+'');

            this.s = new mcl.Fr();
            this.s.setStr(s);
            this.S = mcl.mul(this.G1,this.s);
            const cA = mcl.mul(this.A,this.c);
            const XcA = mcl.add(cA, this.X);

            assert.equal(this.S.getStr(),XcA.getStr());
        } catch(err) {
            throw err;
        }
    }
}

module.exports = {Signer,Verifier};