 // -------------- Edit/set/remove Questions -----------------------
            
            

function editQuestion(questionName){
    
    showEditQuestionUI(questionName);
    
    var nmbrOfOptions = getNumberOfOptionsInDB(questionName);
    
    showOptions(nmbrOfOptions, questionName);
    
   
}

function showOptions(numberOfOptions, questionName){
    
    setButtons(numberOfOptions);
    
    //clear previous html
    $("#editQuestionInfo").html("");
    
    //bring top options
    //call options of question
    
    var optionsToShow = new Array();
    
    
    //get options from DB
    var numberOfOptionsInDB = 0;
        
    sessionDB.child("questions/"+questionName+"/options").once("value", function(options){
        //go through all options and take the number of relebvent top options
        options.forEach(function(option){

            var resultYesNo = countVotes(questionName,option.key());            
            
            console.log("option x1: "+numberOfOptionsInDB);
            
            var result = resultYesNo.yes - resultYesNo.no;
            var details = getOptionDetails(questionName,option.key()); 
            optionsToShow.push([result, option.key(),details]);
                
            numberOfOptionsInDB++;

        })
            
        //sort the options acording to their votes

        optionsToShow.sort();
        optionsToShow.reverse(); 
    });             
        
    
    
    //add top optionsToShow new options if there are more option in numberOfOPtions

    if (numberOfOptions > numberOfOptionsInDB){
        for (i = numberOfOptionsInDB; i<numberOfOptions ; i++){
            console.log("option x2: "+i);
            optionsToShow.push([i,generateUIDNotMoreThan1million(),{title: "כותרת", body: "הסבר"}]);           
        }
        
    };
    
   
    //check to see if wiz or reg
    
    
        
        //var typeQuestion = snapshot.val().type;
        
        if ($("#wizButtonSet").hasClass("active")){
            $("#editQuestionInfo").html("האופציות ימולאו על ידי המשתתפים");   
        } else{
            var optionId;
            //show number of options as selected
            for (var i = 0; i<4 && i< numberOfOptions ;i++){         
                console.log("option x3: "+i);


                var optionTitle = optionsToShow[i][2].title;
                var optionBody = optionsToShow[i][2].body;

                console.log(i+") " + optionsToShow[i][2].body+": "+optionsToShow[i][2].title);

                //append options
                optionId = optionsToShow[i][1];



                $("#editQuestionInfo").append(
                    '<form class="form-horizontal">'+
                       '<div class="form-group" >'+
                            '<input type="text" class="form-control" placeholder="כותרת.." value="'+optionTitle+'"  id="editQuestionTitle'+i+'" name="'+optionId+'_title">'+
                            '<textarea class="form-control" rows="3" id="editQuestionBody'+i+'" name="'+optionId+'_body">'+optionBody+'</textarea>'+
                        '</div>'+
                    '</form>'        
                )
            }
        }
    
    
    
}

function getNumberOfOptionsInDB(questionName){
    var numberOfOptionsInDB = 0; 
    sessionDB.child("questions/"+questionName+"/options").once("value", function(options){
        options.forEach(function(option){
           numberOfOptionsInDB++; 
        })
    })
    return(numberOfOptionsInDB);
}

function setButtons(numberOfOptions){
    //set button according to number of options
    for (i=1; i<=4; i++){
        $("#buttonOptions"+i).removeClass("active");
    }
    $("#buttonOptions"+numberOfOptions).addClass("active");
}

function showEditQuestionUI (questionName){
    hideAllEcept("editQuestions");
        
    var questionNameTitle;
    var questionNameExplain; 
    var questionType;
    
    //if question is undefined create empty question to feel up else get question name and expanation
    if (questionName == undefined){
        questionNameTitle = "זאת שאלה חדשה. אנא תנו לה שם";
        questionNameExplain = "אנא הסבירו את השאלה";
        questionType = "wiz"
    } else {
        //get name and title from database        
        sessionDB.child("questions/"+questionName).once("value", function(snapshot){
            questionNameTitle = snapshot.val().header;
            questionNameExplain = snapshot.val().explanation; 
            questionType = snapshot.val().type;
        })
    }
    
    
        
    //show basic elements before loading
    var editQuestionsHTML = '<div id="editQuestionHeader" contenteditable="true">'+questionNameTitle+'</div>'+
            '<div id="editQuestionDescription" contenteditable="true">'+questionNameExplain+'</div>'+           
            '<div id="editQuestionInfo"></div>'+            
            '<div class="switch" id="editQuestionSwitch">'+               
                '<span class="pull-right" >מספר אופציות</span><br>'+
                '<div class="btn-toolbar pull-right" role="toolbar" aria-label="...">'+
                    '<div class="btn-group" role="group" aria-label="..." id="numberOfOptions">'+
                        '<button type="button" class="btn btn-default" id="buttonOptions1" onclick="showOptions(1,`'+questionName+'`)">1</button>'+
                        '<button type="button" class="btn btn-default" id="buttonOptions2" onclick="showOptions(2,`'+questionName+'`)">2</button>'+
                        '<button type="button" class="btn btn-default" id="buttonOptions3" onclick="showOptions(3,`'+questionName+'`)">3</button>'+
                        '<button type="button" class="btn btn-default" id="buttonOptions4" onclick="showOptions(4,`'+questionName+'`)">4</button>'+
                    '</div>'+
                '<div class="btn-group" role="group" aria-label="...">'+
                    '<div class="btn-group" role="group" aria-label="...">'+
                        '<button type="button" class="btn btn-default" id="regButtonSet" onclick="setQuestionType(`reg`)">פשוט</button>'+
                        '<button type="button" class="btn btn-default active" id="wizButtonSet" onclick="setQuestionType(`wiz`)">מרובה</button>'+ 
                    '</div>'+
                '</div>'+                  
            '</div>'+
            '<div id="editQuestionConfirmCancel" class="clickables">'+
                '<button type="button" class="btn btn-success" id="editQuestionConfirm" onclick="confirmQuestion(`'+questionName+'`)">אישור</button>'+
                '<button type="button" class="btn btn-default" id="editQuestionCancel" onclick="cancelQuestion()" >ביטול</button>'+
                '<button type="button" class="btn btn-danger" id="editQuestionDelete" onclick="deleteQuestion(`'+questionName+'`)">מחיקה</button>'+
            '</div>';  
    $("#editQuestions").html(editQuestionsHTML);
    
    //set type buttons accroding to type of question in DB    
    
    console.log("questionType:"+questionType)
    setQuestionType(questionType);
    
    
}

//toggle between regular question and wiz question

function setQuestionType(type){
    if (type == "reg"){
        $("#regButtonSet").addClass("active");
        $("#wizButtonSet").removeClass("active");
        $("#numberOfOptions").show(400);
    } else {
        $("#wizButtonSet").addClass("active");
        $("#regButtonSet").removeClass("active");
        $("#numberOfOptions").hide(400);
        $("#editQuestionInfo").html("האופציות ייוצרו על ידי המשתמשים");
        
    }
    
}



function getOptionDetails(questionName, optionName){
    console.log("Option Name: "+optionName);
    var optionText = "";
    var optionTitle = "";
    if (questionName === undefined || questionName === "undefined"){
        optionTitle = "";
        optionText = "";        
    } else {
        sessionDB.child("questions/"+questionName+"/options/"+optionName+"/text").once("value", function(texts){
            optionText = texts.val().mainText;
            console.log("bal: " + optionText);
            optionTitle = texts.val().title;
        });        
    }
    return ({title:optionTitle, body:optionText});
}

function confirmQuestion(questionName){
    
    if (questionName === undefined || questionName === "undefined"){
        questionName = generateUIDNotMoreThan1million();
    }
    
    var questionDB = sessionDB.child("questions/"+questionName);
    
    //get name of question and explanation
    var questionTitle = $("#editQuestionHeader").text();
    var questionExplanation = $("#editQuestionDescription").text();
    
    questionDB.update({header: questionTitle, explanation: questionExplanation});
    
    //if button set wiz set to wiz in database if reg button set, set to reg 
    
    //if wiz, just update db to wiz
    
    if ($("#wizButtonSet").hasClass('active')) {
         questionDB.update({type:"wiz"});
    } else{        
        questionDB.update({type:"reg"});
        
        //delete all showOnRegVote and set new showOnRegVote
        //get all options
        questionDB.child("options").once("value", function(options){
            options.forEach(function(option){
                questionDB.child("options/"+option.key()).update({showOnRegVote:false});
            })
        })
        
        //take input from form and put it to DB
    
        //var numberOfOptions = $("#editQuestionInfo").length;
        
        for (i=1; i<=4; i++){
            if ($("#buttonOptions"+i).hasClass("active")){
                numberOfOptions = i;
                break;
            } else {
                numberOfOptions = 3;
            }
        }
        
        console.log("number of options on exit is: "+numberOfOptions);
        
        //set to DB
        for (i=0; i<numberOfOptions;i++){
            var inputDOM = $("#editQuestionTitle"+i);
            var optionID = inputDOM.attr('name').replace("_title","");   
            
            //get values from form
            var optionTitle = $("#editQuestionTitle"+i).val();
            var optionBody = $("#editQuestionBody"+i).val();
            var optionColor = getRandomColor();
            
            console.log("option "+i+": "+optionTitle+", "+ optionBody );
            
            //set to DB of option
            questionDB.child("options/"+optionID+"/text").update({title: optionTitle, mainText: optionBody, color: optionColor});
            questionDB.child("options/"+optionID).update({showOnRegVote:true});
            
        }
        
        
        
    }
       
    
    
    hideAllEcept("questionsList");
};

function deleteQuestion(questionName){
    
    var questionDB = sessionDB.child("questions/"+questionName);
    
    questionDB.once("value", function(snapshot){
        var questionTitle = snapshot.val().header;
        
        isDelete = confirm("האם אתם בטוחים שאתם רוצים למחוק את שאלה: "+questionTitle);
        if (isDelete){
            questionDB.set(null);
        }
    })
   hideAllEcept("questionsList"); 
}

function cancelQuestion(){
    hideAllEcept("questionsList"); 
}
                                                               

            
function closeNewGroupWindow(){
    $("#addNewGroup").hide(400);
}

function openNewGroupWindow() {
    $("#addNewGroup").show(400);
}
