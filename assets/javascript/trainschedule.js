// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCvNY91JtpiMZFsMUFi_I5VUsxnYnGTmhs",
    authDomain: "train-schedule-bdbc6.firebaseapp.com",
    databaseURL: "https://train-schedule-bdbc6.firebaseio.com",
    projectId: "train-schedule-bdbc6",
    storageBucket: "train-schedule-bdbc6.appspot.com",
    messagingSenderId: "793879847649",
    appId: "1:793879847649:web:cbb2487a16fc4ea4"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  var trainName;
  var destination;
  var frequency;
  var nextArrival;
  var minutesAway;

  // on click submit button add form values to firebase

  $("#submit").on("click", function(event){
      event.preventDefault();

      trainName = $("#trainName").val().trim();
      destination = $("#destination").val().trim();
      firstTrain = $("#firstTrain").val().trim();
      frequency = $("#frequency").val().trim();

      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
      })

      database.ref().on("child_added", function(snapshot) {
          console.log(snapshot.val().trainName);
          console.log(snapshot.val().destination);
          console.log(snapshot.val().firstTrain);
          console.log(snapshot.val().frequency);

      })

  })