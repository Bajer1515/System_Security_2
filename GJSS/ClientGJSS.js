/*sudo openvpn --config abajerowicz.ovpn*/
const mcl = require('mcl-wasm');

mcl.init(mcl.BLS12_381).then( ()=>{

const Signer = require('./SignerGJSS.js');
const rp = require('request-promise');

let signer = new Signer();

// Path initialization
let hostname = 'http://127.0.0.1';
// let hostname = 'http://10.8.0.10'; //:8080'
let port = '8080'; //'8443';
let base_path = 'protocols/gjss';

A = signer.A;
r = signer.gen_r();
h = signer.gen_h();
z = signer.gen_z(); 
u = signer.gen_u();
v = signer.gen_v();
sigma = signer.gen_input();
H = signer.gen_H();
c = signer.gen_c();
ac = signer.gen_AC();
s = signer.gen_s();


let msg = 'Witaj Jedrzeju';

function encode(x){
    return x.getStr().slice(2);
}

let path = base_path+'/verify';
let options = {
    method: 'POST',
    uri: `${hostname}:${port}/${path}`,
    body: {
        payload: {
            sigma: {
                s: s,
                c: c,
                r: r,
                z: z
            },
            A: encode(A),
            msg: msg
        },
        protocol_name: 'gjss'
    }, 
    json: true
}

console.log(options);
rp(options).then(res =>{
    console.log(res)
})
})