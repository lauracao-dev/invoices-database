const admin = require("firebase-admin");
const serviceAccount = require(/*insert path/to/serviceAccountKey.json*/);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: /*insert Realtime Database URL which ends with "firebaseio.com"*/
});

const db = admin.database();

const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use((req,res,next)=> {
  console.log(req.body, req.params.id)
  next()
})

// create new invoice
app.post('/invoices-db', (req, res) => {
  db.ref('/').push(req.body)
  .then(snapshot => {
    console.log(snapshot.key)
    res.send(JSON.stringify(snapshot.key))
  })
})

// get invoice
app.get("/invoices-db/:id", (req, res) => {
  admin
    .database()
    .ref('/'+req.params.id)
    .once("value")
    .then((snapshot) => {
      res.send(snapshot.val());
    })
})

// update existing invoice
app.put('/invoices-db/:id', (req, res) => {
  let id = req.params.id
  db.ref('/'+id).set(req.body)
})

const port = process.env.PORT || 4000;
app.listen(port)



