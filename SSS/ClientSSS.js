/*sudo openvpn --config abajerowicz.ovpn*/
const mcl = require('mcl-wasm');

mcl.init(mcl.BLS12_381).then( ()=>
{

const Prover = require('./ProverSSS.js');
const rp = require('request-promise');

let prover = new Prover();

// let hostname = 'http://rpacut.thenflash.com';
// let hostname = 'http://127.0.0.1';
let hostname = 'http://10.8.0.12'; //:8080'
let port = '8080'; //'8443';
let base_path = 'protocols/sss';

let X = prover.createCommitment();
let A = prover.publicKey;

function encode(x){
    return x.getStr().slice(2);
}
let path = base_path+'/init';
let options = {
    method: 'POST',
    uri: `${hostname}:${port}/${path}`,
    body: {
        payload: {
            A: encode(A),
            X: encode(X)
        },
        protocol_name: 'sss'
    }, 
    json: true
}
console.log(options);
rp(options).then(res => {
    let c = new mcl.Fr();
    c.setStr(res.payload.c)
    
    let [s1, s2] = prover.genProof(c);
    
    let path = base_path+'/verify';
    let options = {
        method: 'POST',
        uri: `${hostname}:${port}/${path}`,
        body: {
            session_token: res.session_token,
            payload: {
                s1: s1.getStr(),
                s2: s2.getStr()
            },
            protocol_name: 'sss'
        }, 
        json: true
    }
    rp(options).then(res =>{
        console.log(res)
    })
});

})