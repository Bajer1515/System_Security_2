const mcl = require('mcl-wasm');


mcl.init(mcl.BLS12_381).then( ()=>
{

const Alice = require('./Alice.js');
const rp = require('request-promise');

let alice = new Alice();
// let hostname = 'http://jzawojski.thenflash.com'
// let hostname = 'http://10.8.0.10'; //Jędrula
let hostname = 'http://127.0.0.1';
let port = '8080';
let base_path = 'protocols/sigma';

// function encode(x){
//     return x.getStr().slice(2);
// }
X = alice.constructEph();

let path = base_path+'/init';
let options = {
    method: 'POST',
    uri: `${hostname}:${port}/${path}`,
    body: {
        payload: {
            X: X
        },
        protocol_name: 'sigma'
    }, 
    json: true
}
console.log(options);
rp(options).then(res => {
    const payload = res.payload;
    const exchangeData = alice.generateExchangeData(payload);
    
    let path = base_path+'/exchange';
    let options = {
        method: 'POST',
        uri: `${hostname}:${port}/${path}`,
        body: {
            session_token: res.session_token,
            payload: exchangeData,
            protocol_name: 'sigma'
        }, 
        json: true
    }
    rp(options).then(res =>{
        console.log(res)
    })
});

})