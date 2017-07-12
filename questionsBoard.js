// intial hiding of pages
            hideAllEcept('login');
            
            // ----------- initial settings -------------------
            
            
            
            var isExplainOpen = true;
            
                        
            // ------------- login ---------------
            //get name of seesion and put it on login form
            /*
            sessionDB.child("details").once("value",function(data){
                $("#sessionName").text(data.val().name);
            })
            */
            
            var userName ="";

//color questions
function setTypeOfQuestion(type){
                  
    switch(type){
      case "reg":
          
          $("#regQuestion").css({"background-color": "green", "box-shadow": "1px 1px 3px gray"});
          $("#yesnoQuestion").css({"background-color":"aquamarine", "box-shadow": "3px 3px 3px gray"});
          $("#wisQuestion").css({"background-color":"aquamarine", "box-shadow": "3px 3px 3px gray"});
          break;
      case "yesno":
          
          $("#regQuestion").css({"background-color":"aquamarine", "box-shadow": "3px 3px 3px gray"});
          $("#yesnoQuestion").css({"background-color": "green", "box-shadow": "1px 1px 3px gray"});
          $("#wisQuestion").css({"background-color":"aquamarine", "box-shadow": "3px 3px 3px gray"});
          break;
      case "wiz":
          
          $("#regQuestion").css({"background-color":"aquamarine", "box-shadow": "3px 3px 3px gray"});
          $("#yesnoQuestion").css({"background-color":"aquamarine", "box-shadow": "3px 3px 3px gray"});
          $("#wisQuestion").css({"background-color": "green", "box-shadow": "1px 1px 3px gray"});
          break;
      default:
          
          $("#regQuestion").css({"background-color":"nul"});
          $("#yesnoQuestion").css({"background-color":"null"});
          $("#wisQuestion").css({"background-color":"null"});
    }
}
            
            
            
            // -------------------- Questions List Board -------------
            // push questions from DB
            
            sessionDB.child("questions").orderByChild("numberOfAnswers").on("value", function(questionsDB){



                var questionsDivs = "";
                questionsDB.forEach(function(questionDB){
                    
                    var numberOfAnswers = questionDB.val().numberOfAnswers; 
                    var typeOfQuestion = questionDB.val().type;
                    var questionKey = JSON.stringify(questionDB.key());
                    
                    
                    if (typeOfQuestion === "wiz"){ //if question of wiz of the group
                        questionsDivs += "<div class='questionsDivs wizQuestionsDivs'>"+
                            "<span id='buttonTest' class='clickables' onclick='startWizOptions("+questionKey+")'>"+questionDB.val().header+"</span>"+
                            "<img src='img/edit2.png' class='clickables editQuestionPen' height='25px' align='left' onclick='editQuestion("+questionKey+")'>"+
                        "</div>"
                    } else {                       // for regular question
                    
                        questionsDivs += "<div class='questionsDivs'>"+
                        "<span id='buttonTest' class='clickables' onclick='voteQuestion("+questionKey+")'>"+questionDB.val().header+"</span>"+
                        "<img src='img/edit2.png' class='clickables editQuestionPen' height='25px' align='left' onclick='editQuestion("+questionKey+")'>"+
                        "</div>"
                    }
                    
                    
                })
                questionsDivs +="<div id='plusDiv' class='clickables'><img src='img/plus.png' id='plusQuestion' onclick='editQuestion()'><img src='img/plusGroup.png' id='plusGroup' onclick='openNewGroupWindow()'><a href='whatsapp://send?text=delib.org/index.html?"+groupAddress+"'><img src='img/whatsapp.png' id='whatsappLink'></a></div><div id='addNewGroup'><span>שם הקבוצה החדשה:</span><form clas='pure-form'><input type='text' size='40' autofocus name='name'>&nbsp<input type='button' class='pure-button' value='קבוצה חדשה' onclick='newGroup(this.form)'>&nbsp<input type='button' class='pure-button' value='ביטול' onclick='closeNewGroupWindow()'></form></div>"
                $("#questionsList").html(questionsDivs);
                $("#addNewGroup").hide();
            })
            //---------------- End of Questions Board section ---------------
            
            
            function showQuestions(){



                $("#questionsList").show();    
                $("#info").hide();
                $("#infoBox").hide();
            }

//if not group owner, hide edit icon
//get group owner
sessionDB.child("details").once("value", function(snapshot){
        var groupOwner = snapshot.val().owner;
        console.log("groupOwner: "+groupOwner+", userName: "+userName);
        if (groupOwner == userName || groupOwner == undefined){
            $(".editQuestionPen").css("display","inline");
            console.log("Show!");
        } else {
            $(".editQuestionPen").css("display","none");
            console.log("Hide!");
        }
});


