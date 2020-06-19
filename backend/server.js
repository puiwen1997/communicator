const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

var fs = require("fs");
var googleTTS = require('google-tts-api');
var say = require('say');
// let wav = require('node-wav');
var filename = 'sorry.wav';
// var espeak = require('espeak');
// var speak = require("node-speak");
var admin = require('./admin')
const bodyParser = require('body-parser');
const multer = require('multer');

const FirebaseReference = admin.database();
 
// useing body parser middlewares, which will handle the user intput streams.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});


googleTTS('Hello World', 'en-gb')
.then(function(url){
  return getUrl(url);
  
})
.catch(function (err) {
  console.error(err.stack);
});

function getUrl(url) {
app.get('/playTTS', (req, res) => {
    res.send({'getUrl' : url});
    console.log(url)
  })
}

app.post('/say', (req, res) => {
  // console.log(res);
  console.log(req.body);
  var text = req.body.text;
  console.log(text);
  say.speak(text, 'Alex', 1.0, function(err){
    // return res.json({ message: err, error: true });
    var ref = admin.database().ref("user");
    ref.once("value", function(snapshot) {
      console.log(snapshot.val());
    });

    var newUsersRef = ref.push();
    newUsersRef.set({
        email: "cpw123@gmail.com",
        password: "cpw123"
    });
    return res.json({ message: 'Text has been spoken.', error: false });  
  })
})

// app.post('/export', (req, res) => {
//   console.log(req.body);
//   var text = req.body.text;
//   console.log(text);
//   say.export(text, 'Cellos', 0.75, filename, function() {
//   console.log('Text has been saved to sorry.wav.');
//     // let buffer = fs.readFileSync(filename);
//     // let result = wav.decode(buffer);
//     // console.log(result);
//   })
// })

app.post('/export', (req, res) => {
  var text = req.body.text;
  var ref = admin.database().ref("texttospeech");
    // ref.once("value", function(snapshot) {
    //   console.log(snapshot.val());
    // });
var data = [];
var count = 0;
    var newUsersRef = ref.push();
	ref.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
		  console.log(childSnapshot.val())
		  if (text!=null){
			  if (childSnapshot.val().username == 'wendy' && childSnapshot.val().text == text) {
				
				count += 1;
				data.push(childSnapshot.val());
			} 
		  }			
		//else {
		//	return res.json({ defaultText: "Data already exist", error: true });
		//}
	  })
	  console.log("Count", count);
	  if (text != '' && count == 0) {
		 newUsersRef.set({
			username: "wendy",
			text: text
		 });
	  } else {
		  return res.json({ defaultText: data, error: true });
	  }
	})
	
    //var data = [];
    //ref.once("value", function(snapshot) {
    //  snapshot.forEach(function(childSnapshot) {
    //    if (childSnapshot.val().username == 'seven' && childSnapshot.val().text != text) {
    //      console.log(childSnapshot.val());
    //      data.push(childSnapshot.val())
    //      return res.json({ defaultText: data, error: false });
    //    } else {
	//		return res.json({ defaultText: data, error: true });
	//	}
    //    // var childKey = childSnapshot.key;
    //    // var childData = childSnapshot.val().username;
    //    // console.log('Key: '+childKey+' ,Data: ' + childData)
    //});
	//    return res.json({ defaultText: data, error: false });
      // if (snapshot.val().username == 'seven') {
      //   console.log(snapshot.val());
      // }
    });
    // return res.json({ message: 'Text has been spoken.', error: false });
//  })
// })

// var ref = admin.database().ref("texttospeech");
//   ref.on("child_added", function(snapshot) {
//     console.log("TTS:" + snapshot.val());

app.get('/retrieve', (req, res) => {
  var data = [];
  var ref = admin.database().ref("texttospeech");
  ref.once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      if (childSnapshot.val().username == 'seven') {
        console.log(childSnapshot.val());
        data.push(childSnapshot.val()) 
      }
  });
  return res.json({ defaultText: data, error: false });
  // console.log(req.body);
  // var text = req.body.text;
  // console.log(text);
  
  // });
})
})
    // ref.once("value", function(snapshot) {
    //   console.log(snapshot.val());
    // });

    // var newUsersRef = ref.push();
    // newUsersRef.set({
    //     username: "wendy1997",
    //     password: text
    // });
    // return res.json({ message: 'Text has been spoken.', error: false });
  // say.export(text, 'Cellos', 0.75, filename, function() {
  // console.log('Text has been saved to sorry.wav.');
    // let buffer = fs.readFileSync(filename);
    // let result = wav.decode(buffer);
    //

app.get('/encode', (req, res) => {
  let buffer = fs.readFileSync(filename);
  let result = wav.decode(buffer);
  console.log(result);
  const sound = require('sound-play')
  let audio = wav.encode(result.channelData, { sampleRate: result.sampleRate, float: true, bitDepth: 32 });
  sound.play(audio);
  console.log("Audio is generated.") ;
})

app.get('/buffer', (req, res) => {
  const fs = require('fs');
  let buff = fs.readFileSync(filename);
  let base64data1 = buff.toString('base64');
  console.log('Image converted to base 64 is:\n\n' + base64data1);

  var reader = new FileReader();
  reader.readAsDataURL(filename); 
  reader.onloadend = function() {
      var base64data = reader.result;    
      console.log("Done" + base64data);            
      resolve(base64data);
      console.log("Done");
  }
})

// app.get('/retrieve', (req, res) => {
//   // const images = new Array();
//   StorageReference storageRef = FirebaseStorage.getInstance().reference().child("");
//   const imageStorage = admin.storage().bucket();
//   const folderRef = imageStorage.child('images/signLanguage/admins');
//   // if (folderRef) {
//   //   console.log("Done")
//   // }
//   folderRef.listAll().then(function(result) {
//     result.items.forEach(function(imageRef) {
//       // And finally display them
//       console.log(imageRef.getDownloadURL());
//     });
//   }).catch(function(error) {
//     // Handle any errors
//   });

// })
// function upload_image(ref, filename, file) {

  // var upload_loc = ref.toString() + '/' + filename;
  // var upload_ref = StorageReference.ref('images/signLanguage/admins').child(upload_loc);

//   upload_ref.put(file).then(function(snapshot) {
//       snapshot.ref.getDownloadURL().then(function(downloadURL) {
//           console.log('File available at', downloadURL);
//           return downloadURL;
//       });
//   }, function(error) {
//       console.log("FirebaseManager, upload_image(): " + error);
//       throw error;
//   });

//   return 'error';
// }

// SET STORAGE
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })
 
// var upload = multer({limits: { fieldSize: 25 * 1024 * 1024 }},{ storage: store })
// var StorageReference = admin.storage().bucket('myreactnative-33c0a');
// const {Storage} = require('@google-cloud/storage');
// const storage = new Storage();
// const bucket = storage.bucket("myreactnative-33c0a");



// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now())
//     }
//   }),
//   limits: {
//   //   fileSize: 25 * 1024 * 1024, // no larger than 5mb, you can change as needed.
//     fieldSize: 8 * 1024 * 1024
//   }
// });
// app.post('/upload', upload.single('photo'), (req, res) => {
//   console.log('file', req.file)
//   console.log('body', req.body)
//   res.status(200).json({
//     message: 'Success!',
//   })
// });

// const {Storage} = require('@google-cloud/storage');
// const storage = new Storage();
// const bucket = storage.bucket("myreactnative-33c0a");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    fieldSize: 25 * 1024 * 1024
  }
});

app.post('/upload', upload.single('photo'), (req, res, next) => {
  let file = req.file;
  console.log(file)
  let bucket = admin.storage().bucket();
  if (file) {
    let fileUpload = bucket.file(file.originalname);
    const blobStream = fileUpload.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
      predefinedAcl: 'publicRead'
    });
 
    blobStream.on('error', error => {
      next(error);
    });
      
    blobStream.on('finish', () => {
      res.status(200).json({
        data: {
          url: `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`,
        },
      });
    });
    
    blobStream.end(file.buffer);
  }
  
})

app.post('/signLanguageSave', (req, res) => {
  var cd = req.body.cd;
  var dscp = req.body.dscp;
  var url = req.body.url;
  var username = req.body.username;
  var ref = admin.database().ref("signLanguage");

    var newUsersRef = ref.push();
    newUsersRef.set({
      cd: cd,
      dscp: dscp,
      url: url,
      username: username
    });
    
    ref.once("value", function(snapshot) {
      console.log(snapshot.val());
    });
    return res.json({ message: 'Save to database.', error: false });
  
})

app.get('/signLanguageRetrieve', (req, res) => {
  var data = [];
  var ref = admin.database().ref("signLanguage");
  ref.once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      if (childSnapshot.val().username == 'admin') {
        console.log(childSnapshot.val());
        data.push(childSnapshot.val()) 
      }
    });
  console.log(data)
  return res.json({ defaultSignLanguage : data, error: false });
  })
  
})

app.post('/signLanguageUpdate', (req, res) => {
  // var cd = req.body.cd;
  var dscp = req.body.dscp;
  var url = req.body.url;
  // var username = req.body.username;

  var ref = admin.database().ref("signLanguage");
  ref.once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      if (childSnapshot.val().cd == cd) {
        console.log(childSnapshot.val());
        childSnapshot.ref.remove();
      }
    });
    return res.json({ error: false });
  })
})

app.post('/signLanguageDelete', (req, res) => {
  var cd = req.body.cd;
  var ref = admin.database().ref("signLanguage");
  ref.once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      if (childSnapshot.val().cd == cd) {
        console.log(childSnapshot.val());
        childSnapshot.ref.remove();
      }
    });
    return res.json({ error: false });
  })
})
// app.post('/upload', upload.single('photo'), (req, res, next) => {
//   console.log(admin.storage().bucket());
//   console.log('file', req.file)
//   console.log('body', req.body)
//   let file = req.file;
//   if (file) {
//     let fileUpload = bucket.file(file.originalname);
//     console.log(file.mimetype);
//     const blobStream = fileUpload.createWriteStream({
//           resumable: false,
//           metadata: {
//             contentType: file.mimetype,
//           },
//           predefinedAcl: 'publicRead'
//     }
//     );
//     console.log(blobStream)

//     blobStream.on('error', error => {
//       next(error);
//     });

//     blobStream.on('finish', () => {
//       res.status(200).json({
//         data: {
//           url: `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`,
//         },
//       });
//       // The public URL can be used to directly access the file via HTTP.
//       // const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
//     });

//     blobStream.end(file.buffer);
//     // uploadImageToStorage(file).then((success) => {
//     //   res.status(200).send({
//     //     status: 'success'
//     //   });
//     // }).catch((error) => {
//     //   console.error(error);
//     // });
//   }
// });

// const uploadImageToStorage = (file) => {
//   return new Promise((resolve, reject) => {
//     if (!file) {
//       reject('No image file');
//     }
//     // let newFileName = `${file.originalname}_${Date.now()}`;
//     // console.log(newFileName)

//     // let fileUpload = bucket.file(newFileName);
//     // console.log(fileUpload)

//     let fileUpload = bucket.file(file.originalname);
//     console.log(file.mimetype)
//     const blobStream = fileUpload.createWriteStream({
//           resumable: false,
//           metadata: {
//             contentType: file.mimetype,
//           },
//           predefinedAcl: 'publicRead'
//     }
      
//       // {
//       // metadata: {
//       //   contentType: file.mimetype
//       // }
//       // resumable: false,
//       // }
//     );
//     console.log(blobStream)

//     blobStream.on('error', (error) => {
//       reject('Something is wrong! Unable to upload at the moment.');
//     });

//     blobStream.on('finish', () => {
//       // The public URL can be used to directly access the file via HTTP.
//       const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
//       resolve(url);
//     });

//     blobStream.end(file.buffer);
//   });
// }


// app.post('/upload', upload.single('myFile'), (req, res, next) => {
//   // console.log("Body" + req.body); 
//   // const tempPath = req.file.path;
//   // const ext = path.extname(req.file.originalname).toLowerCase();

//   // const images = new Image({
//   //   imageName: req.body.imageName,
//   //   imageData: req.body.imageData
//   // })

//   var filename = req.file.path;

//   const googleStorage = require('@google-cloud/storage');
//   const storage = new Storage();
//   storage.bucket('myreactnative-33c0a').upload(filename, {
//     // Support for HTTP requests made with `Accept-Encoding: gzip`
//     gzip: true,
//     // By setting the option `destination`, you can change the name of the
//     // object you are uploading to a bucket.
//     metadata: {
//       // Enable long-lived HTTP caching headers
//       // Use only if the contents of the file will never change
//       // (If the contents will change, use cacheControl: 'no-cache')
//       cacheControl: 'public, max-age=31536000',
//     },
//   });

//   console.log(`${filename} uploaded to ${bucketName}.`);

//   // var upload_loc = req.body.name;
//   // var upload_ref = StorageReference.child(upload_loc);

//   // upload_ref.put(myFile).then(function(snapshot) {
//   //     snapshot.ref.getDownloadURL().then(function(downloadURL) {
//   //         console.log('File available at', downloadURL);
//   //         return downloadURL;
//   //     });
//   // }, function(error) {
//   //     console.log("FirebaseManager, upload_image(): " + error);
//   //     throw error;
//   // });

//   // return 'error';

//   // console.log(req.body.imageName)
//   // console.log(req.body.imageData)

//   // var upload_loc = filename;
//   // var upload_ref = StorageReference.child(upload_loc);

//   // upload_ref.put(images).then(function(snapshot) {
//   //     snapshot.ref.getDownloadURL().then(function(downloadURL) {
//   //         console.log('File available at', downloadURL);
//   //         return downloadURL;
//   //     });
//   // }, function(error) {
//   //     console.log("FirebaseManager, upload_image(): " + error);
//   //     throw error;
//   // });

//   // return 'error';

//   // if (ext === ".png" || ext === ".jpg") {
//   //       upload_image(FirebaseReferences.Images, 'test', req.file)
//   //       res.status(200).contentType("text/plain").end("File uploaded!");
//   //   } else {
//   //       try {
//   //           fs.unlinkSync(tempPath);
//   //       } catch (err) {
//   //           res.status(400).send(err.message);
//   //       }
//   //       res.status(403).contentType("text/plain").end("Only .png/jpg files are allowed!");
//   //   }

//   // const file = req.file
//   // if (!file) {
//   //   const error = new Error('Please upload a file')
//   //   error.httpStatusCode = 400
//   //   return next(error)
//   // }
//   // res.send(file)
//   // return res.send('Nice');

// // var img = fs.readFileSync(req.file.path);
// // var encode_image = img.toString('base64');
//  // Define a JSONobject for the image attributes for saving to database
  
// //  var finalImg = {
// //       contentType: req.file.mimetype,
// //       image:  new Buffer(encode_image, 'base64')
// //    };
// // db.collection('quotes').insertOne(finalImg, (err, result) => {
// //     console.log(result)
 
// //     if (err) return console.log(err)
 
// //     console.log('saved to database')
// //     res.redirect('/')
   
     
// //   })
// })


// app.get('/node-speak/speak', (req, res) => {
//   speak('hello world'), {callback: function(src){
//     console.log('said')
//     }
//   }
// })

// app.get('/node-speak/data', (req, res) => {
//   speak('hello world', { callback: function (src) {
//     console.log(src); 
//     }
//   })
// })

// let buffer = fs.readFileSync('file.wav');

// console.log(result.sampleRate);
// console.log(result.channelData); // array of Float32Arrays

// app.get('/espeak', (req, res) => {
//   espeak.speak('hello world', function(wav) {
//     // if (err) return console.error(err);
    
//     // get the raw binary wav data
//     var buffer = wav.buffer;
//     console.log("Buffer:" + buffer)
    
//     // get a base64-encoded data URI
//     var dataUri = wav.toDataUri();
//     console.log("Data" + dataUri)
//   });
// })


  // mespeak.loadConfig(require("../src/mespeak_config.json"));
  // mespeak.loadVoice(require("../voices/en/en-us.json"))

  // var stream = mespeak.speak("hello world", {
  //   'rawdata': true
  // });
  // mespeak.play(stream);
  // fs.writeFileSync("test.wav", data);
  // meSpeak.loadVoice(require("mespeak/voices/en/en-us.json"))
  // process.stdout.write(meSpeak.speak("hello world", {rawdata: "buffer"}))