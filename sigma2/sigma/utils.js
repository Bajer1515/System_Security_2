const Poly1305 = require("poly1305-js")
const Signer = require("./SignerSSS.js")
const Verifier = require("./VerifierSSS.js")
const crypto = require("crypto");

function checkMAC(pk, mac, mac_key){
    return Poly1305.onetimeauth_verify(pk.getStr(10), mac_key, mac);
}

function genMACKey(gxy){
    const hash = crypto.createHash('SHA3-512') 
    hash.update("mac_"+gxy.getStr(10))
    return hash.digest().slice(0, 32);
}

async function createMAC(mac_key, pk){
   binaryPk = Buffer.from(pk.getStr(10))
   return Poly1305.onetimeauth(binaryPk, mac_key)
}

function createSessionKey(gxy){
    const hash = crypto.createHash('SHA3-512') 
    hash.update("session_"+gxy.getStr(10))
    return hash.digest()
}

function createCheckMsg(sessionKey, msg){
    const hash = crypto.createHash('SHA3-512') 
    hash.update(sessionKey)
    hash.update(msg);
    return hash.digest()
}

function signXY(X, Y, sk, pk, g){
    let signer = new Signer(sk, pk, g)
    const toSign = `${Y.getStr().slice(2)}${X.getStr().slice(2)}`;
    return signer.signMessage(toSign)
}

function checkSignature(B, X, Y, s_b, X_b, g){
    const verifier = new Verifier(B, g);
    return verifier.verify(`${Y.getStr(10).slice(2)}${X.getStr().slice(2)}`, s_b, X_b)
}

module.exports.checkMAC = checkMAC;
module.exports.checkSignature = checkSignature;
module.exports.genMACKey = genMACKey;
module.exports.createMAC = createMAC;
module.exports.createCheckMsg = createCheckMsg;
module.exports.signXY = signXY;
module.exports.createSessionKey = createSessionKey;