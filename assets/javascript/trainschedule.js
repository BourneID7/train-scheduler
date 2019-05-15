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

// global variables
var database = firebase.database();
var trainName;
var destination;
var frequency;
var firstTrain;
var nextArrival;
var minutesAway;


// on click submit button add form values to firebase

$("#submit").on("click", function(event){
    event.preventDefault();

    // get user input
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#firstTrain").val().trim();
    frequency = $("#frequency").val().trim();

    // push user input values to database
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    })

    // clear form
    $("#trainName").text("");
    $("#destination").text("")
    $("#firstTrain").text("")
    $("#frequency").text("")
    $("#addTrain")[0].reset();

  });

  // firebase event to add row to table 
  database.ref().on("child_added", function(childSnapshot) {

    // store everything to variables
    trainName = childSnapshot.val().trainName;
    destination = childSnapshot.val().destination;
    frequency = childSnapshot.val().frequency;
    firstTrain = childSnapshot.val().firstTrain;

    // console log all variables
    console.log(trainName);
    console.log(destination);
    console.log("first train start time is " + firstTrain);
    console.log("train arrives every " + frequency + " minutes");

    // time variable calculations

    var today = new Date();
    var currentTime = today.getHours() + ":" + today.getMinutes();
    console.log("current time is " + currentTime);

    // convert current time to total minutes from midnight for easier math
    var currentTimeMinutes = (today.getHours() * 60) + (today.getMinutes());
    console.log("current time in minutes is " + currentTimeMinutes);

    var startTimeMinutes = moment.duration(firstTrain).asMinutes();
    console.log("first train start time in minutes is " + startTimeMinutes);

    var numberTrains = Math.floor((currentTimeMinutes - startTimeMinutes) / frequency);
    console.log("number of trains run until now is " + numberTrains);

    var nextArrival = startTimeMinutes + ((numberTrains + 1) * frequency);
    console.log("last train arrived at " + nextArrival + " minutes into the day")

    var convertedArrivalTime = moment().startOf('day').add(nextArrival, 'minutes').format('hh:mm A');
    console.log(convertedArrivalTime);

    var minutesAway = nextArrival - currentTimeMinutes;
    console.log("the next train is due in " + minutesAway + " minutes");

    // function to add row to train schedule chart on submit
    // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(convertedArrivalTime),
    $("<td>").text(minutesAway)
  );

  // Append the new row to the table
  $("#currentTrains").append(newRow);

  // sort rows by next train to arrive

  })

