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

// intial hiding of pages
            hideAllEcept('login');
            
            // ----------- initial settings -------------------
            
            var sessionName = "Ariel2015-communctationDay"
            
            sessionDB = new Firebase("https://votewiz.firebaseio.com/sessions/"+sessionName);
            
            var isExplainOpen = true;
            
                        
            // ------------- login ---------------
            //get name of seesion and put it on login form
            
            sessionDB.child("details").once("value",function(data){
                $("#sessionName").text(data.val().name);
            })
            
            var userName ="";
            
            $('#loginForm').submit(function (evt) {
                evt.preventDefault();
                
                userName = $("#nameForm").val();
                
                if (userName === "") {
                    $("#nameForm").css("background-color", "#dd3737");
                } else {
                    $("header").text("שלום "+userName);
                    showQuestions(); //show question page
                    $("#login").hide(100);
                    
                }
                
                
                
            });

            function setName(form){
                userName = form.nameForm.value;
                if (userName === "") {
                    $("#nameForm").css("background-color", "#dd3737");
                } else {
                    $("header").text("שלום "+userName);
                    showQuestions(); //show question page
                    $("#login").hide(100);                    
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
                            "<img src='img/edit2.png' class='clickables' height='25px' align='left' onclick='editQuestion("+questionKey+")'>"+
                        "</div>"
                    } else {                       // for regular question
                    
                        questionsDivs += "<div class='questionsDivs'>"+
                        "<span id='buttonTest' class='clickables' onclick='voteQuestion("+questionKey+")'>"+questionDB.val().header+"</span>"+
                        "<img src='img/edit2.png' class='clickables' height='25px' align='left' onclick='editQuestion("+questionKey+")'>"+
                        "</div>"
                    }
                    
                    //$("#"+questionDB.key()).on('touchstart click', function(){alert("hi")});
                })
                questionsDivs +="<div id='plus' class='clickables'><img src='img/plus.png' height='38px' onclick='newQuestion()'></div>"
                $("#questionsList").html(questionsDivs);
            })
            //---------------- End of Questions Board section ---------------
            
            
            function showQuestions(){
                $("#questionsList").show();    
            }
            
            // --------------- Voting --------------------------
            
            function voteQuestion(questionName) {
                hideAllEcept("questionPage");
                
                isExplainOpen = true;
                $("#explain").show(500);
                $("#results").hide();
                
                            
                sessionDB.child("questions/"+questionName+"/answers").on("value", function(answers){
                    var resultsGraph = new Object();
                    var nOptions = 0;
                    answers.forEach(function(option){
                        
                        
                        // getting results
                        
                        var x= option.val();
                        var nVoters=0;
                        resultsGraph[option.key()]=[];
                        for (i in x) {
                            nVoters++;
                            
                            resultsGraph[option.key()].push(x[i]);
                            
                        }
                        //resultsGraph[nOptions] = nVoters;
                        
                        nOptions++;
                    })
                    
                    var graph = "";
                    for (i in resultsGraph) {
                        var graphNames = "";
                        
                        for (j in resultsGraph[i]) {
                            graphNames += "<div class='barNames'>"+resultsGraph[i][j]+"</div>";
                        }
                        
                        var questionNameStr = JSON.stringify(questionName);
                        var iStr = JSON.stringify(i);
                        
                        graph +="<div class='resultsBarEnv' id='"+i+"'><div class='resultsBar'>"+graphNames+"</div><div class='voteBottons' onclick='voteAssign("+questionNameStr+","+iStr+")'>"+i+"</div></div>";
                        
                        console.log("i: "+iStr);
                        
                    }
                    $("#results").html(graph);
                   
                        
                })
                
                sessionDB.child("questions/"+questionName).once("value", function(data){
                    
                    var questionNameStr = JSON.stringify(questionName);
                    var aStr = JSON.stringify("א");
                    var bStr = JSON.stringify("ב");
                    var cStr = JSON.stringify("ג");
                    var dStr = JSON.stringify("ד");
                   
                    var questionHtml ="<span>"+data.val().explanation+"</span><br>"+
                        "<div class='clickableOptions clickables' onclick='voteAssign("+questionNameStr+","+aStr+")'><b>  א.</b> <i>"+data.val().option1.name+"</i></div>"+
                        "<div class='clickableOptions clickables' onclick='voteAssign("+questionNameStr+","+bStr+")'><b>  ב.</b> <i>"+data.val().option2.name+"</i></div>"+
                        "<div class='clickableOptions clickables' onclick='voteAssign("+questionNameStr+","+cStr+")'><b> ג.</b> <i>"+data.val().option3.name+"</i></div>"+
                        "<div class='clickableOptions clickables' onclick='voteAssign("+questionNameStr+","+dStr+")'><b>  ד.</b> <i>"+data.val().option4.name+"</i></div>"
                    $("#explain").html(questionHtml);
                    
                    var questionTitle =  "<b>"+data.val().header+"</b><br>"
                    $("#titleHead").html(questionTitle);
                    
                })
                
            }
            
            // assign vote
            
            function voteAssign(question, option){
                
                //delete all other votes for this user
                
                sessionDB.child("questions/"+question+"/answers/").once("value", function(options){
                    options.forEach(function(voters){
                        var optionName = voters.key();                        
                        
                        voters.forEach(function(voter){
                            
                            var user = voter.key();
                           
                            if (voter.key() === userName){
                                
                                sessionDB.child("questions/"+question+"/answers/"+optionName+"/"+user).remove();
                                
                            }
                        })
                    })
                })
                                    
                
                //asssign new vote
                console.log("added: "+userName);
                sessionDB.child("questions/"+question+"/answers/"+option+"/"+userName).set(userName);
                
                $("#results").show(300);
                
                
            }

            function ShowHideExplan() {
                $("#results").show(300);
                
                if(isExplainOpen){
                    $("#explain").hide(300);
                    
                    isExplainOpen = false;
                } else {
                    $("#explain").show(300);
                    isExplainOpen = true;
                }
            }
            
            function setTypeOfQuestion(questionKey, type){
                console.log("type set: "+type);
                sessionDB.child("questions/"+questionKey+"/type").set(type);
            }
            // -------------- Edit/set/remove Questions -----------------------
            
            

            function editQuestion(questionName){
                console.log("editing question");
                hideAllEcept("editQuestions");
                
                var tit, expl, op1,op2,op3,op4,type;
                
                var questionNameStr = JSON.stringify(questionName);
                
                sessionDB.child("questions/"+questionName).once("value", function(data){
                    tit = data.val().header;
                    expl = data.val().explanation;
                    op1 = data.val().option1.name;
                    op2 = data.val().option2.name;
                    op3 = data.val().option3.name;
                    op4 = data.val().option4.name;
                    type = data.val().type;
                    
                    console.log("type: "+type);
                    if (type === undefined){
                        type = "reg";
                        sessionDB.child("questions/"+questionName+"/type").set("reg");                        
                        
                    }
                    
                    switch (type) {
                        case "reg":
                            var radioType = "<label for='option-two' class='pure-radio'>"+
                                                    "<input id='option-two' type='radio' name='typeOfQuestion' value='reg' checked>"+
                                                    "שאלה רגילה "+
                                             "</label>"+
                                            "<label for='option-three' class='pure-radio'>"+
                                                    "<input id='option-three' type='radio' name='typeOfQuestion' value='wiz'>"+
                                                    "שאלת חכמת המון "+
                                            "</label>";
                            break;
                        case "wiz":
                            var radioType = "<label for='option-two' class='pure-radio'>"+
                                                    "<input id='option-two' type='radio' name='typeOfQuestion' value='reg' >"+
                                                    "שאלה רגילה "+
                                             "</label>"+
                                            "<label for='option-three' class='pure-radio'>"+
                                                    "<input id='option-three' type='radio' name='typeOfQuestion' value='wiz' checked>"+
                                                    "שאלת חכמת המון "+
                                            "</label>";
                            break;
                        default:
                            var radioType = "<label for='option-two' class='pure-radio'>"+
                                                    "<input id='option-two' type='radio' name='typeOfQuestion' value='reg' checked>"+
                                                    "שאלה רגילה "+
                                             "</label>"+
                                            "<label for='option-three' class='pure-radio'>"+
                                                    "<input id='option-three' type='radio' name='typeOfQuestion' value='wiz'>"+
                                                    "שאלת חכמת המון "+
                                            "</label>";
                    }
                    
                    
                    var reg = JSON.stringify("reg");
                    var yesno = JSON.stringify("yesno");
                    var wiz = JSON.stringify("wiz");                    
                    var questionNameStr = JSON.stringify(questionName);
                    
                    console.log(tit, expl, op1,op2,op3,op4);
                    var questionKey = JSON.stringify(questionName);
                
                    $("#editQuestions").html("<form class='pure-form'><fieldset>"+
                    "<input type='text' size='25' autofocus name='questioTitle' value='"+tit+"'>"+
                    "<textarea rows='2' cols='25' name='explain'>"+expl+"</textarea>"+ radioType+                    
                    "<input type='text' size='25' value='"+op1+"' name='optiona'>"+
                    "<input type='text' size='25' value='"+op2+"' name='optionb'>"+
                    "<input type='text' size='25' value='"+op3+"' name='optionc'>"+
                    "<input type='text' size='25' value='"+op4+"' name='optiond'><br>"+
                    "<input type='button' class='pure-button pure-button-primary' onclick='updateQuestion("+questionKey+", this.form)' value='עדכון'><br><br>"+
                    "<input type='button' class='pure-button button-error' onclick='removeQuestion("+questionKey+")' value='מחיקה'>"+
                    "</fieldset></form>");                
                    
                    
                })
            }
                                                               
            function updateQuestion(quName, form){
                
                var questionTitle = form.questioTitle.value;
                
                var option1 = form.optiona.value;
                var option2 = form.optionb.value;
                var option3 = form.optionc.value;
                var option4 = form.optiond.value; 
                var explain = form.explain.value;
                var typeQ = form.typeOfQuestion.value;
            
                //console.log("par: " + questionTitle +", " + explain +", " + option1 +", " + option2 +", " + option3 +", " + option4);
                                       
                sessionDB.child("questions/"+quName).update({
                    header:questionTitle,
                    explanation: explain,
                    type: typeQ,
                    option1: {name: option1},
                    option2: {name: option2},
                    option3: {name: option3},
                    option4: {name: option4},                    
                    numberOfAnswers: 0
                })
                
                hideAllEcept("questionsList");
            }
            
             // --------------------- New Question ------------------- 

            // ------------------ Set new Question --------------
            function setQuestion(form){  
                
                var questionTitle = form.questioTitle.value;
                var expl = form.explain.value;
                var option1 = form.optiona.value;
                var option2 = form.optionb.value;
                var option3 = form.optionc.value;
                var option4 = form.optiond.value; 
                var typeQ = form.typeOfQuestion.value;
                
                console.log("type: " + typeQ);
            
                //console.log("parSet: " + questionTitle +", " + expl +", " + option1 +", " + option2 +", " + option3 +", " + option4);
                                       
                sessionDB.child("questions").push({
                    header:questionTitle,
                    explanation: expl,
                    type: typeQ,
                    option1: {name: option1},
                    option2: {name: option2},
                    option3: {name: option3},
                    option4: {name: option4},
                    answers: {
                        א:{ voter:""},
                        ב:{ voter:""},
                        ג:{ voter:""},
                        ד:{ voter:""}
                    },
                    numberOfAnswers: 0
                })
                
                
                
                hideAllEcept("questionsList");
            }
            
            // ----------- show new question ----------------
           
            function newQuestion(){
                
                var questionsListStr = JSON.stringify("questionsList");
                
                var textHtml = "<form class='pure-form'>"+
                "<fieldset>"+
                    "<input type='text' size='24' placeholder='כותרת...' autofocus name='questioTitle'>"+
                    "<textarea placeholder='הסבר..' rows='2' cols='25' id='explanation' name='explain'></textarea><br>"+                     	
                    "<label for='option-two' class='pure-radio'>"+
                            "<input id='option-two' type='radio' name='typeOfQuestion' value='reg' checked>"+
                            "שאלה רגילה "+
                     "</label>"+
                    "<label for='option-three' class='pure-radio'>"+
                            "<input id='option-three' type='radio' name='typeOfQuestion' value='wiz'>"+
                            "שאלת חכמת המון "+
                    "</label>"+
                    "<input autofocus type='text' size='24' class='sizedText' placeholder='אפשרות א' name='optiona'>"+
                    "<input autofocus type='text' size='24' placeholder='אפשרות ב' name='optionb'>"+
                    "<input autofocus type='text' size='24' placeholder='אפשרות ג' name='optionc'>"+
                    "<input autofocus type='text' size='24' placeholder='אפשרות ד' name='optiond'>"+
                    "<input type='button' class='pure-button pure-button-primary' onclick='setQuestion(this.form)' value='אישור'>"+
                    "<input type='button' class='pure-button button-warning' onclick='hideAllEcept("+questionsListStr+")' value='ביטול'>"+                                   "</fieldset>"+
            "</form>";
                
                    
                $("#newQuestion").html(textHtml);
                
                hideAllEcept("newQuestion");
            }
            
            function removeQuestion(rmvQuestion){
                console.log("rmv: "+rmvQuestion);
                sessionDB.child("questions/"+rmvQuestion).remove();
                hideAllEcept("questionsList");
            }
            
            function hideAllEcept(panel){
                
                $("#newQuestion").hide();            
                $("#editQuestions").hide();
                $("#login").hide();
                $("#questionsList").hide();
                $("#questionPage").hide();
                $("#wizQuestion").hide();
                $("#chat").hide();
                
                $("#"+panel).show();
            }
            
            
        