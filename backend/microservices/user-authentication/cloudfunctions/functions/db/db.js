const firebase = require("firebase/app");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCN0_QZYje-4Cia-C5zmBqaLTPStdc1ZJk",
  authDomain: "quizzers-aad1d.firebaseapp.com",
  projectId: "quizzers-aad1d",
  storageBucket: "quizzers-aad1d.appspot.com",
  messagingSenderId: "550250944945",
  appId: "1:550250944945:web:ac575c57bbecd618558590",
  measurementId: "G-LLZGD574KM",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const QuestionsCollection = db.collection("Questions");
const UserResponseCollection = db.collection("UserResponses");

module.exports = { QuestionsCollection, UserResponseCollection };
