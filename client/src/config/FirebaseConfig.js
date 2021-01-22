import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyB6GExprqyylFpaqNIHrLlilkyWGpVkD9U",
    authDomain: "myreactnative-33c0a.firebaseapp.com",
    databaseURL: "https://myreactnative-33c0a.firebaseio.com",
    projectId: "myreactnative-33c0a",
    storageBucket: "myreactnative-33c0a.appspot.com",
    messagingSenderId: "381507719623",
    appId: "1:381507719623:web:3960cc6e344b46db9149e2"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };