const mcl = require('mcl-wasm');
const sha3_256 = require('js-sha3').sha3_256;
const Signer = require('./SignerSSS');
const Poly1305 = require('poly1305-js');
// const config = require('./config.js');

class Bob{
    constructor(config){
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');

        this.b = new mcl.Fr();
        this.b.setByCSPRNG;

        this.B = new mcl.G1();
        this.B = mcl.mul(this.G1,this.b);

        this.sss_signer = new Signer();
    }

    constructEph(){
        this.y = new mcl.Fr();
        this.y.setByCSPRNG();

        this.Y = new mcl.G1();
        this.Y = mcl.mul(this.G1,this.y);
    }

    genEph(){
        if(!this.Y) {
            constructEph();
        }
        return this.Y.getStr(10).slice(2);
    }
    
    async generateMAC(msg) {
        this.g_xy = mcl.mul(this.X,this.y);
        this.mac_key = Buffer.from(sha3_256("mac_"+this.g_xy.getStr(10)),'hex');

        // this.session_key = sha3_512("session_"+this.g_xy.getStr(10));
        let mac = new Poly1305(this.mac_key);
        await mac.update(msg);
        return await mac.finish();
    }

    genSign() {
        this.msg = this.X.getStr(10).slice(2)+this.Y.getStr(10).slice(2);
        const sign = this.sss_signer.signMessage(this.msg);
        return sign;
    }

    init(payload){
        this.X = new mcl.G1();
        this.X.setStr('1 '+payload.X);

        if(!this.Y) {
            this.constructEph();
        }
        this.mac = this.generateMAC(this.msg);        
        this.sign = this.genSign();

        return {b_mac: this.mac, B: this.B, Y: genEph(), sign: this.sign}
    }

    exchangeData(payload){
        this.a_mac = payload.a_mac;

        this.A = new mcl.G1();
        this.A.setStr(`1 ${payload.A}`);

        this.msg = payload.msg;
        
        const a_sign = payload.sign;
        
        this.a_sign_X = new mcl.G1();
        this.a_sign_X.setStr(`1 ${a_sign.s}`);
    }
}

module.exports = Bob;