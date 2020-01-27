/*sudo openvpn --config abajerowicz.ovpn*/
const mcl = require('mcl-wasm');

mcl.init(mcl.BLS12_381).then( ()=>{

const Signer = require('./SignerSSS.js');
const rp = require('request-promise');

let signer = new Signer();

// Path initialization
// let hostname = 'http://rpacut.thenflash.com';
// let hostname = 'http://127.0.0.1';
let hostname = 'http://10.8.0.10'; //:8080'
let port = '8080'; //'8443';
let base_path = 'protocols/sss';

//Create X,A,c,s and msg
X = signer.createCommitment();
A = signer.A;
let msg = 'Witaj Jedrzeju';

let c = new mcl.Fr();
c = signer.genC(msg);

let s = new mcl.Fr();
s = signer.genS(c);

function encode(x){
    return x.getStr().slice(2);
}
// Send json with s,A,X,m
let path = base_path+'/verify';
let options = {
    method: 'POST',
    uri: `${hostname}:${port}/${path}`,
    body: {
        payload: {
            s: s.getStr(), //encode(s),
            A: encode(A),
            X: encode(X),
            msg: msg
        },
        protocol_name: 'sss'
    }, 
    json: true
}

console.log(options);
rp(options).then(res =>{
    console.log(res)
})
})