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
    let sigma = new mcl.Fr();
    let A = new mcl.Fr();

    sigma.setStr(req.body.payload.sigma);
    A.setStr(decode(req.body.payload.A));
    msg.setStr(req.body.payload.msg);

    let h = verifier.createHash(msg);
    let result = verifier.verify(s,X,c);
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