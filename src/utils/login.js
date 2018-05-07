'use strict';
const firebase = require('firebase');
require('firebase/firestore');
const inquirer = require('inquirer');
const { writeApiKey } = require('./capturoo-settings');
const config = require('../config');

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase);
}

firebase.firestore().settings({
  timestampsInSnapshots: true
});

const login = () => {
  return new Promise(function(resolve, reject) {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'email',
          message: 'Account email address'
        },
        {
          type: 'password',
          message: 'Enter a masked password',
          name: 'password',
          mask: '*'
        }
      ])
      .then(answers => {
        return firebaseSignin(answers.email, answers.password);
      })
      .then(data => {
        if (!writeApiKey(data.name || data.email, data.privateApiKey)) {
          console.log('~/.capturoorc file already exists. ')
        } else {
          console.log('Your ~/.capturoorc file has been setup. You are ready to use the command line tool. In future, you no longer need to run setup.');
        }
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
};

const firebaseSignin = (email, password) => {
  return new Promise(function(resolve, reject) {
    firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
      .then(userCredential => {
        return userCredential.user.uid;
      })
      .then(uid => {
        return firebase.firestore()
          .collection('accounts')
          .doc(uid)
          .get()
      })
      .then(docSnap => {
        return docSnap.data();
      })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = {
  login
};
