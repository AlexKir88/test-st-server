const express = require("express");
const fetch = require("node-fetch");
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, onValue } = require( 'firebase/database');

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
    console.log('connect...name ' + request.body.name);
    let bodyStr = JSON.stringify(request.body)
    postToFB(bodyStr).then(res => response.send(res)).catch(err => console.log(err));
});
   
app.get("/themes", urlencodedParserText, function (request, response) {
    console.log('sand themes on front...');
    getThems().then(res => response.send(res)).catch(err => console.log(err));
});

app.listen(3000,  (err)=> {
   err? console.log(err) : console.log("Сервер запущен...")
});

//emulate table from relative DB 

const getThems = async () => {
  return ['Техподдержка', 'Продажи']
}

// Firebase
 const postToFB = async (message) => {
    const response = await fetch(
      'https://test-sf-b38a8-default-rtdb.firebaseio.com/messages.json',
      {
        method: 'POST',
        body: message,
        headers: {
          'Content-type': 'application/json',
        },
      }
    );
    const result = await response.json();
    console.log('get from DB...' + result.name);
    const responseResult = await fetch(
      `https://test-sf-b38a8-default-rtdb.firebaseio.com/messages/${result.name}.json`
    );
    const respDB = await responseResult.json();
    console.log('response from DB...name ' + respDB.name);
    createRecords(message);

    return respDB
  }



   const createRecords = async (message) => {
    const objMessage = JSON.parse(message);
    // const objMessage = message;
    const objContact = Object.assign(
      {},
      {
        name: objMessage.name,
        tel: objMessage.tel,
        email: objMessage.email,
      }
    );
    const firebaseConfig = {
      databaseURL: 'https://test-sf-b38a8-default-rtdb.firebaseio.com',
    };
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    createRecord(database, 'themes/', objMessage.theme, {
      createAt: new Date().toLocaleString('ru'),
    });
    createRecord(database, 'contacts/', objMessage.idContact, objContact);
  }



  const createRecord = (db, group, key, jsonRecordStr) => {
    const getRef = ref(db, group + key);
    onValue(getRef, (snapshot) => {
      const data = snapshot.val();
      if (data) return;
      set(ref(db, group + key), jsonRecordStr);
    });
  }







