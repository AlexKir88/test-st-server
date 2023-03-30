const express = require("express");
const fetch = require("node-fetch");
const pool = require("./db")

const app = express();
   
const urlencodedParserText = express.text();
const urlencodedParser = express.json();


app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
   next();  // передаем обработку запроса методу app.post("/postuser"...
 });


  
app.post("/", urlencodedParser, function (request, response) {
    if(!request.body || !request.body.name ) return response.sendStatus(400);
    let messageObj = request.body;
    console.log('connect...name ' + messageObj.name);

    let str =`DO
        $do$
        BEGIN
          IF NOT EXISTS (SELECT email FROM contacts WHERE email='${messageObj.email}' AND tel='${messageObj.tel}' ) THEN
            INSERT INTO contacts (email, tel) VALUES ('${messageObj.email}', '${messageObj.tel}');
          END IF;
        END
        $do$;
        INSERT INTO messages (message, date, name, theme_id, contact_id) 
        VALUES ('${messageObj.message}', '${messageObj.date}', '${messageObj.name}', 
            (SELECT id FROM themes WHERE name='${messageObj.theme}'),
            (SELECT id FROM contacts WHERE email='${messageObj.email}' AND tel='${messageObj.tel}' LIMIT 1))
        RETURNING name, message, 
        (SELECT name FROM themes WHERE id=theme_id) as theme,
        (SELECT email FROM contacts WHERE id=contact_id) as email,
        (SELECT tel FROM contacts WHERE id=contact_id) as tel;`;

    pool.query(str ,(error, results) => {
      console.log(str);
      if (error) console.log(error);
      console.log(results[1].rows[0]);
      response.send(results[1].rows[0]);
    })

});
   

app.get("/themes", urlencodedParserText, function (request, response) {
    console.log('sand themes on front...');
    pool.query('SELECT * FROM themes',(error, results) => {
      response.send(results.rows);
    })
});

app.listen(3000,  (err)=> {
   err? console.log(err) : console.log("Сервер запущен...")
});











