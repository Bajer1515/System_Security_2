// Import libraries or different files
const mcl = require('mcl-wasm');
const crypto = require('crypto');
mcl.init(mcl.BLS12_381).then( ()=>
{

const Verifier = require('./VerifierGJSS.js');
let verifier = new Verifier();

var express = require('express');
var app = express(); // instance of class express
app.use(express.json()); // Żeby można było używać json'a

function decode(x){
    return '1 ' + x;
}


app.get('/protocols/', (req, res) => {
    res.json({schemas: ['gjss']});
});
var port = 8080;
// var port = 8443;

app.post('/protocols/gjss/verify', (req, res) =>{
    console.log(req.body);

    let A = new mcl.G1();
    A.setStr(decode(req.body.payload.A));
   
    let result = verifier.verify(req.body.payload.msg,A,req.body.payload.sigma);
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