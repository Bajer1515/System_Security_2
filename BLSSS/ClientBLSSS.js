/*sudo openvpn --config abajerowicz.ovpn*/
const mcl = require('mcl-wasm');

mcl.init(mcl.BLS12_381).then( ()=>{

const Signer = require('./SignerBLSSS.js');
const rp = require('request-promise');

let signer = new Signer();

// Path initialization
// let hostname = 'http://rpacut.thenflash.com';
let hostname = 'http://127.0.0.1';
// let hostname = 'http://10.8.0.12'; //:8080'
let port = '8080'; //'8443';
let base_path = 'protocols/blsss';


// x and msg
x = signer.genx();
let msg = 'Test msg';

A = signer.A;
h = signer.genh(msg);
sigma = signer.genSigma();


function encode(N){
    return N.getStr().slice(2);
}
// Send json with A,X,msg
let path = base_path+'/verify';
let options = {
    method: 'POST',
    uri: `${hostname}:${port}/${path}`,
    body: {
        payload: {
            sigma: encode(sigma),
            A: encode(A),
            msg: msg
        },
        protocol_name: 'blsss'
    }, 
    json: true
}

console.log(options);
rp(options).then(res =>{
    console.log(res)
})
// })

})