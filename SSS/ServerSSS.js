// Import libraries or different files
const mcl = require('mcl-wasm');
const crypto = require('crypto');
mcl.init(mcl.BLS12_381).then( ()=>
{

const Verifier = require('./VerifierSSS.js');
let verifier = new Verifier();

var express = require('express');
var app = express(); // instance of class express
app.use(express.json()); // Żeby można było używać json'a

function decode(x){
    return '1 ' + x;
}


app.get('/protocols/', (req, res) => {
    res.json({schemas: ['sss']});
});
var port = 8080;
// var port = 8443;

// app.post('/protocols/sss/init', (req, res) => {
    // let X = new mcl.G1();
    // let A = new mcl.G1();
    // let s = new mcl.Fr();
    // let c = new mcl.Fr();
    // let sessionToken = crypto.randomBytes(16).toString('base64');
    // X.setStr(decode(req.body.payload.X)); 
    // A.setStr(decode(req.body.payload.A));
    // s.setStr(decode(req.body.payload.s));
    // c.setStr(decode(req.body.payload.c));

    // verifier.consumeAXsc(A,X,s,c);
    // let c = verifier.createChallenge();
    // let resp_body = {
        // protocol_name: 'sss',
        // payload: {c: c.getStr()},
        // session_token: sessionToken 
    // }
    // res.json(resp_body);
// })

app.post('/protocols/sss/verify', (req, res) =>{
    console.log(req.body);
    let s = new mcl.Fr();
    let X = new mcl.Fr();
    // let A = new mcl.Fr();

    // let s2 = new mcl.Fr();
    s.setStr(req.body.payload.s);
    X.setStr(req.body.payload.X);
    var A.setStr(req.body.payload.A);
    var m.setStr(req.body.payload.m);
    // s2.setStr(req.body.payload.s2);

    let c = verifier.createC(m,X);
    let result = verifier.verify(s,X,c);
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