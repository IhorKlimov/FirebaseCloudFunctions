const functions = require('firebase-functions');
const admin = require('firebase-admin');
const GeoFire = require('geofire');
admin.initializeApp(functions.config().firebase);
const geoFire = new GeoFire(admin.database().ref('/geofire'));


exports.addMessage = functions.https.onRequest((req, res) => {
  const original = req.query.text;
  admin.database().ref('/messages').push({original: original}).then(snapshot => {
    res.redirect(303, snapshot.ref);
  });
});

exports.addUser = functions.https.onRequest((req, res) => {
  const user = req.body;
  var newUser = admin.database().ref('/users').push();
  newUser.set(user).then(snapshot => {
    var location = [user.latitude, user.longitude];
    geoFire.set(newUser.key, location).then(function() {
      res.send(200, "ok");
    });
  });
});
