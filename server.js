const express = require("express");

const app = express();
   
const urlencodedParser = express.text();
  
app.post("/", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    response.setHeader('Access-Control-Allow-Origin', '*')

    //here must be request and response from DB
    
    response.send(request.body);
});

   
app.listen(3000, (err)=> {
   err? console.log(err) : console.log("Сервер запущен...")
});




