const mcl = require('mcl-wasm');

mcl.init(mcl.BLS12_381).then( ()=>
{

const Prover = require('./Alice.js');
const rp = require('request-promise');

let Alice = new Alice();
// let hostname = 'http://jzawojski.thenflash.com'
// let hostname = 'http://10.8.0.10'; //Jędrula
let hostname = 'http://127.0.0.1';
let port = '8080';
let base_path = 'protocols/sigma';

// let A = Alice.A;
let X = Alice.gen_X();

function encode(x){
    return x.getStr().slice(2);
}

let path = base_path+'/init';
let options = {
    method: 'POST',
    uri: `${hostname}:${port}/${path}`,
    body: {
        payload: {
            X: encode(X)
        },
        protocol_name: 'sigma'
    }, 
    json: true
}
console.log(options);
rp(options).then(res => {
    let c = new mcl.Fr();
    c.setStr(res.payload.c)
    
    let s = prover.genProof(c);
    
    let path = base_path+'/verify';
    let options = {
        method: 'POST',
        uri: `${hostname}:${port}/${path}`,
        body: {
            session_token: res.session_token,
            payload: {
                s: s.getStr()
            },
            protocol_name: 'sis'
        }, 
        json: true
    }
    rp(options).then(res =>{
        console.log(res)
    })
});

})