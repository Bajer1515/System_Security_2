const mcl = require('mcl-wasm');
const crypto = require('crypto');
const config = require('./config.js');

mcl.init(mcl.BLS12_381).then( ()=>
{

const Bob = require('./Bob.js');
let bob = new Bob();

var express = require('express');
var app = express();
app.use(express.json());

// function decode(x){
//     return '1 ' + x;
// }

app.get('/protocols/', (req, res) => {
    res.json({schemas: ['sigma']});
});
var port = 8080;

app.post('/protocols/sigma/init', (req, res) => {
    
    let sessionToken = crypto.randomBytes(16).toString('base64');
    // X.setStr(decode(req.body.payload.X)); 
    // const payload = req.body.payload;
    // let X = new mcl.G1();
    // X.setStr(payload.X);
    BData = bob.init(req.body.payload);
    let resp_body = {
        protocol_name: 'sigma',
        payload: {
            b_mac: BData.b_mac,
            B: BData.B,
            Y: Bdata.Y,
            sign: Bdata.sign
        },
        session_token: sessionToken 
    }
    res.json(resp_body);
})

app.post('/protocols/sigma/exchange', (req, res) =>{
    console.log(req.body);
    const payload = req.body.payload;
    
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