const axios = require('axios');
const express = require('express');
const assert = require('assert');
const mcl = require('mcl-wasm');
const app = express();
const uuidv4 = require('uuid/v4');
// const config = require('./config.js');

const SIGMAProtocol = require('./Protocols.js');

let aliceSIGMA,
    bobSIGMA = null;

const HOST = '127.0.0.1';
// const HOST = '10.8.0.10';
const PORT = 8080;

// const HOST_A = '10.8.0.8'
// const HOST_A = '10.8.0.10'
const HOST_A = HOST;
const BASE_URL = `http://${HOST_A}:${PORT}`;

app.use(express.json())
app.post('/protocols/sigma/init', (req, res) => {
    const protocol_name = req.body.protocol_name;
    try {
        assert.equal(protocol_name,'sigma','Name of the protocol, must be `sigma`');
        const payload = req.body.payload;
        assert(payload,'Payload is required');
        // console.log(payload);
        const bobSessionToken = bobSIGMA.createSessionToken();
        bobSIGMA.init(payload).then( function(bobData) {
            res.status(200).send({session_token: bobSessionToken, payload: bobData});
        });
        // res.status(200).send({value: 'after'});
    } catch (err) {
        console.log(err);
        res.status(403).send({valid: false, error: err});
    }
});

app.post('/protocols/sigma/exchange', (req,res) => {
    const protocol_name = req.body.protocol_name;
    try {
        assert.equal(protocol_name,'sigma','Name of the protocol, must be `sigma`');
        const session_token = req.body.session_token;
        assert(session_token,'Session token is required');

        const payload = req.body.payload;
        assert(payload,'Payload is required');
        // console.log('BOB received exchange data:');
        // console.log(payload.a_mac);

        let msg = bobSIGMA.exchange(payload);
        res.status(200).send({msg: msg});
    } catch (err) {
        // res.status(403).send({valid: false, error: err});
    }
});

app.post('/protocols/');

const server = app.listen(PORT,HOST, () => {
    console.log("Listening on  %s", server.address());
    mcl.init(mcl.BLS12_381).then(() => {
        aliceSIGMA = new Protocols.Alice();
        bobSIGMA = new Protocols.Bob();

        sigmaCall();
    })
});


async function sigmaCall() {
    const aliceX = aliceSIGMA.getEph();
    let res = await axios.post(BASE_URL+'/protocols/sigma/init', {
        protocol_name: 'sigma',
        payload: {
            X: aliceX
        }
    });
    try {
        const payload = res.data.payload;
        // console.log(payload);
        const session_token = res.data.session_token;
        console.log(session_token);
        let exchangeData;
        aliceSIGMA.generateExchangeData(payload).then(function(data) {
            exchangeData = data;
            res = axios.post(BASE_URL+'/protocols/sigma/exchange', {
                protocol_name: 'sigma',
                session_token: session_token,
                payload: exchangeData
            }).then(function(res) {
                aliceSIGMA.verifyCheckMsg(res.data.msg);
                // console.log(res.data);
            });
        });
        try {
            // console.log(res.data);
        } catch (err) {
            throw err;
        }
    } catch(err) {
        // console.log(err);
    }
}