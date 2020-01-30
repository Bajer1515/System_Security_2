const mcl = require('mcl-wasm');
const sss = require('./SssProtocol');
const Poly1305 = require('poly1305-js');
const uuidv4 = require('uuid/v4');
const sha3_256 = require('js-sha3').sha3_256;
const sha3_512 = require('js-sha3').sha3_512;
const assert = require('assert');
const crypto = require('crypto');

class Alice {
    constructor() {
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');

        this.a = new mcl.Fr();
        this.a.setByCSPRNG();

        this.A = mcl.mul(this.G1,this.a);

        this.sss_signer = new sss.Signer();
        this.sss_verify = new sss.Verifier();
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
        // this.mac_key = Buffer.from(sha3_256("mac_"+this.g_xy.getStr(10)),'hex');
        
        const mac_hash = crypto.createHash('SHA3-512');
        mac_hash.update("mac_"+this.g_xy.getStr(10));
        this.mac_key = mac_hash.digest().slice(0,32);

        // // this.session_key = sha3_256("session_"+this.g_xy.getStr(10));
        // let mac = new Poly1305(this.mac_key);
        // let alicePublickeyBuffer = Buffer.from(this.A.getStr(10).slice(2));
        // await mac.update(alicePublickeyBuffer);
        // return await mac.finish();
        // // return this.mac;
        // this.session_key = sha3_256("session_"+this.g_xy.getStr(10));
        let mac = new Poly1305(this.mac_key);
        let alicePublickeyBuffer = Buffer.from(this.A.getStr(10).slice(2));
        await mac.update(alicePublickeyBuffer);
        return await mac.finish();
        // return this.mac;
    }

    async loadPayload(payload) {
        try {
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

            this.sig_msg = this.X.getStr(10).slice(2)+this.Y.getStr(10).slice(2);
            this.sss_verify.verify(this.sig_msg,this.sig_s.getStr(10), this.sig_X.getStr(10).slice(2), this.B.getStr(10).slice(2));
        
            this.msg = sig.msg
            return this;
        } catch(err) {
            console.log('Load payload error');
            console.log(err);
        }
    }   
    
    generateSessionKey(g_xy) {
        // const sessKey = sha3_256('session_'+g_xy.getStr(10));
        // return sessKey;
        const ses_hash = crypto.createHash('SHA3-256');
        ses_hash.update("session_"+g_xy.getStr(10));
        const sessKey = ses_hash.digest();
        return sessKey;
    }

    createCheckMessage(session_key,msg) {
        // let c_msg = Buffer.from(sha3_512(session_key+msg)).toString('base64');
        // return c_msg;
        let msg_hash = crypto.createHash('SHA3-512');
        msg_hash.update(session_key+msg);
        let c_msg = msg_hash.digest();
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
            const msgBuff = Buffer.from(msg,'base64');
            console.log(msgBuff);
            console.log('myMsg:');
            console.log(myMsg);
            myMsg.equals(msgBuff);
            console.log('{ Verification: True }');
        } catch(err) {
            throw err;
        }
    }
}

class Bob {
    constructor() {
        this.G1 = new mcl.G1();
        this.G1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');

        this.sss_signer = new sss.Signer();

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
        const mac_hash = crypto.createHash('SHA3-256');
        mac_hash.update("mac_"+this.g_xy.getStr(10));
        this.mac_key = mac_hash.digest().slice(0,32);
        // this.mac_key = Buffer.from(sha3_256("mac_"+this.g_xy.getStr(10)),'hex');
        // // console.log(this.mac_key);
        let mac = new Poly1305(this.mac_key);
        let bobPublickeyBuffer = Buffer.from(this.B.getStr(10).slice(2));
        await mac.update(bobPublickeyBuffer);
        return await mac.finish();
    }
    
    async genSig() {
        this.msg = this.X.getStr(10).slice(2)+this.Y.getStr(10).slice(2);
        console.log('MSG: '+this.msg);
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
       const ses_hash = crypto.createHash('SHA3-256');
       ses_hash.update("session_"+this.g_xy.getStr(10));
       this.session_key = ses_hash.digest();
       // console.log("Session key BOB: "+this.session_key);
       const msg_hash = crypto.createHash('SHA3-512');
       msg_hash.update(this.session_key+msg);

       let c_msg = msg_hash.digest();
       // console.log(c_msg);
       return c_msg;
    }

    exchange(payload) {
        try {
            this.a_mac = payload.a_mac;
            // console.log(payload.A);
            this.A = new mcl.G1();
            this.A.setStr(`1 ${payload.A}`);
            // console.log(this.A.getStr(10));
            const sig = payload.sig;
            this.sig_X = new mcl.G1();
            this.sig_X.setStr(`1 ${sig.X}`);

            this.sig_s = new mcl.Fr();
            this.sig_s.setStr(sig.s);

            this.sig_msg = this.X.getStr(10).slice(2)+this.Y.getStr(10).slice(2);
            this.sss_verify.verify(this.sig_msg,this.sig_s.getStr(10),this.sig_X.getStr(10).slice(2),this.A.getStr(10).slice(2));
            
            this.msg = this.generateCheckHash(payload.msg);
            // console.log(this.msg);
            return this.msg;

        } catch (err) {
            console.log('Bob exchange error: ');
            console.log(err);
            throw err;
        }
    }
}

module.exports = {Alice,Bob};