// Import libraries or different files
const mcl = require('mcl-wasm');
const crypto = require('crypto');
mcl.init(mcl.BLS12_381).then( ()=>
{

const Verifier = require('./VerifierSIS.js');
let verifier = new Verifier();

var express = require('express');
var app = express(); // instance of class express
app.use(express.json()); // Żeby można było używać json'a

function decode(x){
    return '1 ' + x;
}

app.get('/protocols/', (req, res) => {
    res.json({schemas: ['sis']});
});
var port = 8080;

app.post('/protocols/sis/init', (req, res) => {
    let X = new mcl.G1();
    let A = new mcl.G1();
    let sessionToken = crypto.randomBytes(16).toString('base64');
    X.setStr(decode(req.body.payload.X)); 
    A.setStr(decode(req.body.payload.A));
    verifier.consumeAX(A,X);
    let c = verifier.createChallenge();
    let resp_body = {
        protocol_name: 'sis',
        payload: {c: c.getStr()},
        session_token: sessionToken 
    }
    res.json(resp_body);
})

app.post('/protocols/sis/verify', (req, res) =>{
    console.log(req.body);
    let s = new mcl.Fr();
    s.setStr(req.body.payload.s);
    let result = verifier.verify(s);
    console.log("Verified:", result)
    if(result){
        res.statusCode = 200;
    }
    else{
        res.statusCode = 403;
    }
    res.json({verified: result});

    //s.setStr();
})
app.listen(port);
})