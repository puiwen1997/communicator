var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myreactnative-33c0a.firebaseio.com",
  storageBucket: "myreactnative-33c0a.appspot.com"
});

module.exports = admin;

// var ref = db.ref("user");
// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });

// var newUsersRef = ref.push();
// newUsersRef.set({
//     email: "wendy1997@gmail.com",
//     password: "wendy1997"
// });