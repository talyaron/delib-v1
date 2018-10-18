var config = {
    apiKey: "AIzaSyB5BoW4FBpRPdOfyYjPej5WkrHO9v8qtjQ",
    authDomain: "testproj-96156.firebaseapp.com",
    databaseURL: "https://testproj-96156.firebaseio.com",
    projectId: "testproj-96156",
    storageBucket: "testproj-96156.appspot.com",
    messagingSenderId: "150276311739"
};

firebase.initializeApp(config);

var DB = firebase.database().ref();