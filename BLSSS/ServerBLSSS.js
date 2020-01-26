// Import libraries or different files
const mcl = require('mcl-wasm');
const crypto = require('crypto');
mcl.init(mcl.BLS12_381).then( ()=>
{

const Verifier = require('./VerifierBLSSS.js');
let verifier = new Verifier();

var express = require('express');
var app = express(); // instance of class express
app.use(express.json()); // Żeby można było używać json'a

function decode(x){
    return '1 ' + x;
}

app.get('/protocols/', (req, res) => {
    res.json({schemas: ['blsss']});
});
var port = 8080;
// var port = 8443;

app.post('/protocols/blsss/verify', (req, res) =>{
    console.log(req.body);
    // let sigma = new mcl.Fr();
    // let A = new mcl.Fr();
    this.A = new mcl.G1();
    this.A.setStr(decode(req.body.payload.A));
    
    this.sigma = new mcl.G2();
    this.sigma.setStr(decode(req.body.payload.sigma));
    
    
    // msg.setStr(req.body.payload.msg);

    let result = verifier.verify(this.sigma,this.A,req.body.payload.msg);

    console.log("Verified:", result)
    if(result){
        res.statusCode = 200;
    }
    else{
        res.statusCode = 403;
    }
    res.json({verified: result});
})
app.listen(port);
})