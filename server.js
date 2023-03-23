const express = require("express");
const fetch = require("node-fetch");
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, onValue } = require( 'firebase/database');

const app = express();
   
const urlencodedParser = express.text();
  
app.post("/", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    response.setHeader('Access-Control-Allow-Origin', '*')
    console.log('connect...' + request.body);
    postToFB(request.body).then(res => response.send(res)).catch(err => console.log(err));
});
   
app.listen(3000,  (err)=> {
   err? console.log(err) : console.log("Сервер запущен...")
});

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
    console.log('sand...' + result);
    const responseResult = await fetch(
      `https://test-sf-b38a8-default-rtdb.firebaseio.com/messages/${result.name}.json`
    );
    const respDB = await responseResult.json();
    console.log('response...' + respDB);
    createRecords(message);

    return respDB
  }



   const createRecords = async (message) => {
    const objMessage = JSON.parse(message);
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







