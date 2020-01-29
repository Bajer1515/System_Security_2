const mcl = require('mcl-wasm');
const sss = require('./SssProtocol');
const Poly1305 = require('poly1305-js');
const uuidv4 = require('uuid/v4');
const sha3_256 = require('js-sha3').sha3_256;
const sha3_512 = require('js-sha3').sha3_512;
const assert = require('assert');

class Alice {
    constructor() {
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');

        this.a = new mcl.Fr();
        this.a.setByCSPRNG();

        this.A = mcl.mul(this.G1,this.a);

        this.sss_signer = new sss.Signer();
        this.sss_signer.setPrivateKey(this.a.getStr(10));
    }

    constructEph() {
        this.x = new mcl.Fr();
        this.x.setByCSPRNG();

        this.X = mcl.mul(this.G1,this.x);
    }

    getEph() {
        if(!this.X) {
            this.constructEph();
        }
        return this.X.getStr(10).slice(2);
    }

    async genSig() {
        this.msg = this.X.getStr(10).slice(2)+this.Y.getStr(10).slice(2);
        const sig =  await this.sss_signer.signMessage(this.msg);
        return sig;
    }

    async generateMAC() {
        this.g_xy = mcl.mul(this.Y,this.x);
        this.mac_key = Buffer.from(sha3_256("mac_"+this.g_xy.getStr(10)),'hex');

        // this.session_key = sha3_256("session_"+this.g_xy.getStr(10));
        let mac = new Poly1305(this.mac_key);
        let alicePublickeyBuffer = Buffer.from(this.A.getStr(10).slice(2));
        await mac.update(alicePublickeyBuffer);
        return await mac.finish();
        // return this.mac;
    }

    async loadPayload(payload) {
        this.b_mac = payload.b_mac;
        this.B = new mcl.G1()
        this.B.setStr(`1 ${payload.B}`);

        this.Y = new mcl.G1(); 
        this.Y.setStr(`1 ${payload.Y}`);

        const sig = payload.sig;
        this.sig_X = new mcl.G1();
        this.sig_X.setStr(`1 ${sig.X}`);

        this.sig_s = new mcl.Fr();
        this.sig_s.setStr(sig.s);

        this.msg = sig.msg
        return this;
    }
    
    generateSessionKey(g_xy) {
        const sessKey = sha3_256('session_'+g_xy.getStr(10));
        return sessKey;
    }

    createCheckMessage(session_key,msg) {
        let c_msg = Buffer.from(sha3_512(session_key+msg)).toString('base64');
        return c_msg;
    }

    async generateExchangeData(payload) {
        try {
            this.loadPayload(payload);
            this.mac = await this.generateMAC();
            this.sig = await this.genSig();

            this.msg = Buffer.from('I need to add here 64 character string').toString('base64');
            const aliceData = {
                a_mac: this.mac,
                A: this.A.getStr(10).slice(2),
                msg: this.msg,
                sig: this.sig
            }
            return aliceData;
    
        } catch(err) {
            throw err;
        }
    }

    verifyCheckMsg(msg) {
        try {
            const sessKey = this.generateSessionKey(this.g_xy);
            // console.log('Session key Alice:'+sessKey);
            // console.log(sessKey);
            // console.log(this.msg);
            const myMsg = this.createCheckMessage(sessKey,this.msg);
            // console.log(msg);
            // console.log('myMsg:');
            // console.log(myMsg);
            assert.equal(myMsg,msg);
            console.log('They are equal');
        } catch(err) {
            throw err;
        }
    }
}

class Bob {
    constructor(config) {
        this.G1 = new mcl.G1();
        this.G1.setStr(`1 ${config.g1}`);

        this.sss_signer = new sss.Signer(config);

        this.b = new mcl.Fr();
        this.b.setByCSPRNG();

        this.B = mcl.mul(this.G1, this.b);

        this.sss_signer.setPrivateKey(this.b.getStr(10));
    }

    constructEph() {
        this.y = new mcl.Fr();
        this.y.setByCSPRNG();

        this.Y = mcl.mul(this.G1,this.y);
    }

    createSessionToken() {
        this.sessiontoken = uuidv4();
        return this.sessiontoken;
    }

    getEph() {
        if(!this.Y) {
            this.constructEph();
        }
        return this.Y.getStr(10).slice(2);
    }

    async generateMAC() {
        this.g_xy = mcl.mul(this.X,this.y);
        this.mac_key = Buffer.from(sha3_256("mac_"+this.g_xy.getStr(10)),'hex');
        // console.log(this.mac_key);
        let mac = new Poly1305(this.mac_key);
        let bobPublickeyBuffer = Buffer.from(this.B.getStr(10).slice(2));
        await mac.update(bobPublickeyBuffer);
        return await mac.finish();
    }
    
    async genSig() {
        this.msg = this.X.getStr(10).slice(2)+this.Y.getStr(10).slice(2);
        const sig = await this.sss_signer.signMessage(this.msg);
        return sig;
    }


    async init(payload) {
        try {
            // console.log(payload);
            this.X = new mcl.G1();
            this.X.setStr(`1 ${payload.X}`);
 
            if(!this.Y) {
                this.constructEph();
            }
            this.mac = await this.generateMAC();  
            this.sig = await this.genSig();
            const bobdata = {
                b_mac: this.mac, 
                B: this.B.getStr(10).slice(2), 
                Y: this.getEph(), 
                sig: this.sig
            }
             return bobdata;
        } catch (err) {
            throw err;
        }
    }

    generateCheckHash(msg) {
        // console.log('gen check hash start: '+msg);
        this.session_key = sha3_256("session_"+this.g_xy.getStr(10));
        // console.log("Session key BOB: "+this.session_key);
        let c_msg = Buffer.from(sha3_512(this.session_key+msg)).toString('base64');
        // console.log('gen check hash stop');
        return c_msg;
    }

    exchange(payload) {
        // console.log(`Exchange start`);
        this.a_mac = payload.a_mac;
        // console.log(payload.A);
        this.A = new mcl.G1();
        this.A.setStr(`1 ${payload.A}`);
        // console.log(this.A.getStr(10));
        const sig = payload.sig;
        this.msg = this.generateCheckHash(payload.msg);
        // console.log(this.msg);
        return this.msg;
    }
}

module.exports = {Alice,Bob};