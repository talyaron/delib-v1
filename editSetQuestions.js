 // -------------- Edit/set/remove Questions -----------------------
            
            

function editQuestion(questionName){
    
    showEditQuestionUI(questionName);
    
    //bring top options
    //call options of question
    
    var numberOfOptions = 4;
    var optionsToShow = new Array();
        
    //get all options in question and sort them acourding to voting
    sessionDB.child("questions/"+questionName+"/options").once("value", function(options){
        //go through all options and take the number of relebvent top options
        options.forEach(function(option){
                           
            var resultYesNo = countVotes(questionName,option.key())
            var result = resultYesNo.yes - resultYesNo.no;
            
            optionsToShow.push([result, option.key()]);
            
        })
        
        optionsToShow.sort();
        optionsToShow.reverse();        
        
    })
    
    
    
    //get four options
    var numberOfOptions = optionsToShow.length;
    
    for (var i = 0; i<4 && i<numberOfOptions ;i++){
        optionsToShow[i][2] = getOptionDetails(questionName,optionsToShow[i][1]);
        
        var optionTitle = optionsToShow[i][2].title;
        var optionBody = optionsToShow[i][2].body;
        
        console.log(i+") " + optionsToShow[i][2].body+": "+optionsToShow[i][2].title);
        
        //append options
        var optionId = optionsToShow[i][1];
        
        $("#editQuestionInfo").append(
            '<div class="row">'+
                '<div class="col s12 offset-m1 m10 offset-l2 l8">'+
                    '<div class="card white">'+
                        '<div class="card-content grey-darken-1-text">'+
                          '<span class="card-title" id="'+optionId+'_title">'+optionTitle+'</span>'+
                         '<p id="'+optionId+'_body">'+optionBody+'</p>'+
                        '</div>'+
                       ' <div class="card-action">'+
                           ' <input type="checkbox" id="editQuestionOption'+i+'" name="'+optionId+'" checked="checked"/>'+
                           ' <label for="editQuestionOption'+i+'">הצג</label> '+     
                        '</div>'+
                     ' </div>'+
                    '</div>'+
                  '</div>'
        
        )
    }
    
    //if smaller then 4 options, create new options to complete to 4
    if (optionsToShow.length <4){
       var j = optionsToShow.length;
        console.log ("no of opt: "+ optionsToShow.length+ ": " + j);
        for (j;j<4;j++){
            console.log("j:"+j);
            var uidOption = generateUIDNotMoreThan1million();
            optionsToShow.push([j, uidOption]);
            console.log("j:"+ optionsToShow[j][1]);
            
            var optionId = optionsToShow[j][1];
            
            $("#editQuestionInfo").append(
            '<div class="row">'+
                '<div class="col s12 offset-m1 m10 offset-l2 l8">'+
                    '<div class="card white">'+
                        '<div class="card-content grey-darken-1-text">'+
                          '<span class="card-title" contenteditable="true" id="'+optionId+'_title">כותרת - ערכו בבקשה</span>'+
                         '<p contenteditable="true" id="'+optionId+'_body">גוף טקסט - ערכו בבקשה</p>'+
                        '</div>'+
                       ' <div class="card-action">'+
                           ' <input type="checkbox" id="editQuestionOption'+j+'" name="'+optionId+'" />'+
                           ' <label for="editQuestionOption'+j+'">הצג</label> '+     
                        '</div>'+
                     ' </div>'+
                    '</div>'+
                  '</div>')
        }
    }
}

function showEditQuestionUI (questionName){
    hideAllEcept("editQuestions");
        
    //show basic elements before loading
    var editQuestionsHTML = '<div id="editQuestionHeader">שאלה:</div>'+
            '<div id="editQuestionDescription">הסבר: </div>'+
            '<div id="editQuestionInfo"></div>'+            
            '<div class="switch" id="editQuestionSwitch">'+
                '<label>'+
                'מרובה'+
                '<input type="checkbox" id="editQuestionSwitchInput">'+
                '<span class="lever"></span>'+
                'פשוט'+
                '</label>'+
            '</div>'+
            '<div id="editQuestionConfirmCancel" class="clickables">'+
                '<div id="editQuestionConfirm" onclick="confirmQuestion(`'+questionName+'`)">אישור</div>'+
                '<div id="editQuestionCancel" onclick="cancelQuestion()">ביטול</div>'+
            '</div>';  
    $("#editQuestions").html(editQuestionsHTML);
            
    
    
}

function getOptionDetails(questionName, optionName){
    console.log("Option Name: "+optionName);
    var optionText = "";
    var optionTitle = "";
    sessionDB.child("questions/"+questionName+"/options/"+optionName+"/text").once("value", function(texts){
        optionText = texts.val().mainText;
        console.log("bal: " + optionText);
        optionTitle = texts.val().title;
    })
    return ({title:optionTitle, body:optionText});
}

function confirmQuestion(questionName){
    
    //set all options not to be showen in reg question
    /*
    sessionDB.child("questions/"+questionName+"/options").once("value", function(options){
        options.forEach(function(option){
            console.log("key: "+ option.key());
            sessionDB.child("questions/"+questionName+"/options/"+option.key()).update({showOnRegVote:true});            
        })
    })
    */
    
    //get checked options
    
    
    
    for (var i = 0; i<4 ;i++){
        var valCheck = $("#editQuestionOption"+i).prop('checked');
        var optionChecked = $("#editQuestionOption"+i).prop('name');
        var optionTitle =  $("#"+optionChecked+"_title").html();
        var optionBody =  $("#"+optionChecked+"_body").html();
        
        console.log("checked:"+i+") "+ valCheck);
        
        sessionDB.child("questions/"+questionName+"/options/"+optionChecked).update({showOnRegVote:valCheck, text:{title: optionTitle, mainText: optionBody}});
        
    }
    
    //See if question is reg or wiz
    
    var isChecked =  $('#editQuestionSwitchInput').prop('checked');
    // checked = wiz
    // unchecked = reg
    
    if (isChecked){
        sessionDB.child("questions/"+questionName).update({type: "wiz"});
    } else {
        sessionDB.child("questions/"+questionName).update({type: "reg"});
    }
    console.log("Is checked: "+isChecked);
    
    hideAllEcept("questionsList");    
    
}

function cancelQuestion(){
    hideAllEcept("questionsList"); 
}
                                                               
function updateQuestion(quName, form){
                
                var questionTitle = form.questioTitle.value;
                
                var explain = form.explain.value;
                
                var option1 = form.optiona.value;
                var option2 = form.optionb.value;
                var option3 = form.optionc.value;
                var option4 = form.optiond.value; 
                                
                var info1 = form.explOp1.value;
                var info2 = form.explOp2.value;
                var info3 = form.explOp3.value;
                var info4 = form.explOp4.value;
                
                var typeQ = form.typeOfQuestion.value;
            
                //console.log("par: " + questionTitle +", " + explain +", " + option1 +", " + option2 +", " + option3 +", " + option4);
                                       
                sessionDB.child("questions/"+quName).update({
                    header:questionTitle,
                    explanation: explain,
                    type: typeQ,
                    option1: {name: option1, info: info1},
                    option2: {name: option2,  info: info2},
                    option3: {name: option3,  info: info3},
                    option4: {name: option4,  info: info4},                    
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
                
                var info1 = form.explOp1.value;
                var info2 = form.explOp2.value;
                var info3 = form.explOp3.value;
                var info4 = form.explOp4.value;
                
                var typeQ = form.typeOfQuestion.value;
                
                console.log("type: " + typeQ);
            
                //console.log("parSet: " + questionTitle +", " + expl +", " + option1 +", " + option2 +", " + option3 +", " + option4);
                                       
                sessionDB.child("questions").push({
                    header:questionTitle,
                    explanation: expl,
                    type: typeQ,
                    option1: {name: option1, info: info1},
                    option2: {name: option2,  info: info2},
                    option3: {name: option3,  info: info3},
                    option4: {name: option4,  info: info4}, 
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
                
                var textHtml = "<br><form class='pure-form'>"+
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
                    "<input type='text' size='24' class='sizedText' placeholder='אפשרות א' name='optiona'>"+
                    "<textarea rows='2' cols='25' name='explOp1' placeholder='הסבר'></textarea><br>"+
                    "<input type='text' size='24' placeholder='אפשרות ב' name='optionb'>"+
                     "<textarea rows='2' cols='25' name='explOp2' placeholder='הסבר'></textarea><br>"+
                    "<input type='text' size='24' placeholder='אפשרות ג' name='optionc'>"+
                     "<textarea rows='2' cols='25' name='explOp3' placeholder='הסבר'></textarea><br>"+
                    "<input type='text' size='24' placeholder='אפשרות ד' name='optiond'>"+
                     "<textarea rows='2' cols='25' name='explOp4' placeholder='הסבר'></textarea><br>"+
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
            
            
            
function closeNewGroupWindow(){
    $("#addNewGroup").hide(400);
}

function openNewGroupWindow() {
    $("#addNewGroup").show(400);
}
