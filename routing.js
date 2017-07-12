var DB = new Firebase("https://votewiz.firebaseio.com");

//find the group adrress and start session in this group

var groupAddress = window.location.search;

console.log(groupAddress)
groupAddress = groupAddress.slice(1);
var locationOfSlash = groupAddress.indexOf('/')

var isQuestion = false

if(locationOfSlash>0){

  isQuestion = true

  questionId = groupAddress.slice(locationOfSlash+1)
  console.log(questionId)
  groupAddress = groupAddress.slice(0,locationOfSlash)
  console.log(groupAddress)

  //check to see if it is a reg question or a wizquestion
}

//in case ther is no specieal address set default adress/
if (groupAddress == "") {
  groupAddress = "direct-democracy";
}



var sessionDB = DB.child("/sessions/"+groupAddress);

// if url direct to a question
if (isQuestion){
  //get type of question and and go to the question
  sessionDB.child('questions/'+questionId+'/type').once('value', function(type){
    if(type.exists()){
      if(type.val() == 'wiz'){
        startWizOptions(questionId)
      }else {

        voteQuestion(questionId)
      }
    }
  })

}




function newGroup(form){

  var groupName= form.name.value;
  var groupUID = generateUIDNotMoreThan1million(); //generate shortend uid

  var sessionDB = DB.child("/sessions/"+groupUID);
  sessionDB.set({details:{name: groupName,owner: userName}});

  window.open("index.html?"+groupUID, "_self");
}
