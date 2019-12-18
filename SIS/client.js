const rp = require('request-promise');

var options = {
    uri: 'http://127.0.0.1:4000/protocols/',
    json: true
}

rp(options).then((res)=>{
    console.log(res)
})

