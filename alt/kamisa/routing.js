
//find the group adrress and start session in this group

var groupAddress = window.location.hash;
var questionIdURL, isQuestion = false,
  typeOfQuestionURL;
groupAddress = groupAddress.slice(1);
var locationOfSlash = groupAddress.indexOf('/')



if (locationOfSlash > 0) {

  isQuestion = true

  questionIdURL = groupAddress.slice(locationOfSlash + 1)

  groupAddress = groupAddress.slice(0, locationOfSlash)


  //check to see if it is a reg question or a wizquestion
}

//in case ther is no specieal address set default adress/
if (groupAddress == "") {
  groupAddress = "b2k26";
}

var sessionDB = DB.child("/sessions/" + groupAddress);


// if url direct to a question
if (isQuestion) {
  //get type of question and and go to the question
  sessionDB.child('questions/' + questionIdURL + '/type').once('value', function (type) {
    if (type.exists()) {
      if (type.val() == 'wiz') {
        typeOfQuestionURL = 'wiz';
      } else {
        typeOfQuestionURL = 'reg';
      }
    }
  })

}

function newGroup(form) {

  var groupName = form.name.value;
  var groupUID = generateUIDNotMoreThan1million(); //generate shortend uid

  var sessionDB = DB.child("/sessions/" + groupUID);
  sessionDB.set({ details: { name: groupName, owner: userName } });

  window.open("index.html#" + groupUID, "_self");
}
