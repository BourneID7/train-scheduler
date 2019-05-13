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

        // time variable calculations
        var today = new Date();
        var currentTime = today.getHours() + ":" + today.getMinutes();
        console.log("current time is " + currentTime);

        var currentTimeMinutes = (today.getHours() * 60) + (today.getMinutes());
        console.log("current time in minutes is " + currentTimeMinutes);

        var startTimeMinutes = moment.duration(firstTrain).asMinutes();
        console.log("first train start time in minutes is " + startTimeMinutes);

        var numberTrains = Math.floor((currentTimeMinutes - startTimeMinutes) / frequency);
        console.log("number of trains run until now is " + numberTrains);

        var remainder = (currentTimeMinutes - startTimeMinutes) - (numberTrains * frequency);
        console.log("remainder of minutes since last train is " + remainder);

        var nextTrainDueMinutes = frequency - remainder;
        console.log("the next train is due in " + nextTrainDueMinutes + " minutes");

        var nextArrivalTime = currentTimeMinutes + nextTrainDueMinutes;
        console.log("the next train arrives at " + nextArrivalTime);

        var convertedArrivalTime = moment.utc().startOf('day').add(nextArrivalTime, 'minutes').format('hh:mm A')
        console.log(convertedArrivalTime);


        // function to add row to train schedule chart on submit

        function newRow() {
            var row = $('<tr>');
            var tdName = $('<td id="trainName">').text(snapshot.val().trainName);
            var tdDest = $('<td id="destination">').text(snapshot.val().destination);
            var tdFreq = $('<td id="frequency">').text(snapshot.val().frequency);
            var tdNext = $('<td id="nextTrain">').text(convertedArrivalTime);
            var tdMinutes = $('<td id="minutes">').text(nextTrainDueMinutes);
            $("#currentTrains").append(row);
            row.append(tdName);
            row.append(tdDest);
            row.append(tdFreq);
            row.append(tdNext);
            row.append(tdMinutes);
        } 
        newRow();

      // sort rows by next train to arrive


      })

  })