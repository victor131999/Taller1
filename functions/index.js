const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://taller1-127d8.firebaseio.com/"
});

const database = admin.database();

const dbCell = "cells"; 

function createCell(cell){
  database.ref(dbCell).push(cell);  
}

function retrieveCell(id){
  return database.ref(dbCell).child(id).once('value');
}

function updateCell(id, cell){
  database.ref(dbCell).child(id).set(cell);
}

function listCells(){
  return database.ref(dbCell).once('value');
}

function deleteCell(id){
  database.ref(dbCell).child(id).remove();
}

///========================= Funciones URLs ===================///
app.post('/api/cells', function (req, res) {
  let varMake = req.body['make'];
  let varModel = req.body['model'];
  let varStorage = req.body['storage'];
  let varMemory = req.body['memory'];
  var cell = {
    make : varMake,
    model : varModel,
    storage : varStorage,
    memory : varMemory
    };
  createCell(cell);
  return res.status(201).json({ message: "Success mobile was added." });
});

app.get('/api/cells/:id', function(req, res){
  let varId = req.params.id;
  retrieveCell(varId).then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});

app.get('/api/cells', function(req, res){
  listCells().then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});

app.put('/api/cells/:id', function (req, res) {
  let varId = req.params.id;
  let varMake = req.body['make'];
  let varModel = req.body['model'];
  let varStorage = req.body['storage'];
  let varMemory = req.body['memory'];
  var cell = {
    make : varMake,
    model : varModel,
    storage : varStorage,
    memory : varMemory
    };
  updateCell(varId, cell);
  return res.status(200).json({ message: "Success mobile was updated." });
});

app.delete('/api/cells/:id',function(req, res){
  let varId = req.params.id;
  deleteCell(varId);
  return res.status(200).json({ message: "Success molibe was deleted." });
});


exports.app = functions.https.onRequest(app);