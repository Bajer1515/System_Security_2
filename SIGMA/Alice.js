const mcl = require('mcl-wasm');
const sha3_256 = require('js-sha3').sha3_256;
const Signer = require('./SignerSSS');
const Poly1305 = require('poly1305-js');

class Alice{
    constructor(){
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
        
        this.a = new mcl.Fr();
        this.a.setByCSPRNG();
        
        this.A = new mcl.G1();
        this.A = mcl.mul(this.G1,this.a);
    
        this.sss_signer = new Signer();
        this.sss_signer.setPrivateKey(this.a.getStr(10));
    }

    constructEph(){
        this.x = new mcl.Fr();
        this.x.setByCSPRNG();

        this.X = mcl.mul(this.G1,this.x);
    }

    genEph(){
        if(!this.X){
            constructEph();
        }
        return this.X.getStr(10).slice(2);
    }

    genSign(){
        this.msg = this.X.getStr(10).slice(2)+this.Y.getStr(10).slice(2);
        const sign = this.sss_signer.signMessage(this.msg);
        return sign;
    }

    generateMAC(){
        this.g_xy = mcl.mul(this.Y,this.x);
        this.mac_key = sha3_256("mac_"+this.g_xy.getStr(10));

        this.session_key = sha3_256("session_"+this.g_xy.getStr(10));
    }

    generateExchangeData(payload){
        this.b_mac = payload.b_mac;
        
        this.B = new mcl.G1()
        this.B.setStr(`1 ${payload.B}`);

        this.Y = new mcl.G1(); 
        this.B.setStr(`1 ${payload.Y}`);

        const sign = payload.sign;
        this.sign_X = new mcl.G1();
        this.sign_X.setStr(`1 ${sign.X}`);

        this.sign_s = new mcl.Fr();
        this.sign_s.setStr(sign.s);

        this.msg = sign.msg

        this.sign = genSign();
    }

}

module.exports = Alice;