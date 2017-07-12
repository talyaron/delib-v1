//find the group adrress and start session in this group

var groupAddress = window.location.search;

console.log(groupAddress)
groupAddress = groupAddress.slice(1);
var locationOfSlash = groupAddress.indexOf('/')
if(locationOfSlash>0){
  questionId = groupAddress.slice(locationOfSlash+1)
  console.log(questionId)
  groupAddress = groupAddress.slice(0,locationOfSlash)
  console.log(groupAddress)
}

//in case ther is no specieal address set default adress/
if (groupAddress == "") {
    groupAddress = "direct-democracy";
}


var DB = new Firebase("https://votewiz.firebaseio.com");
var sessionDB = DB.child("/sessions/"+groupAddress);
startWizOptions(questionId)



function newGroup(form){
    
    var groupName= form.name.value;
    var groupUID = generateUIDNotMoreThan1million(); //generate shortend uid
        
    var sessionDB = DB.child("/sessions/"+groupUID);
    sessionDB.set({details:{name: groupName,owner: userName}});
    
    window.open("index.html?"+groupUID, "_self");
}
