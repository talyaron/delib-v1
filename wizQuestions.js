// start listen to DB counting of voters


// --------------- Functions ------------------------

// set the tpe of questions in the form (for the buttons)

var noVotesCh = 0;
var yesVotesCh = 0;
var optionsHtmlOld = new Array();



function startWizOptions (questionKey) {
    
    console.log("start");
    //when an option is added, redraw options
    sessionDB.child("questions/" + questionKey + "/options").limitToLast(1).on("child_added", function(snapshot){
        console.log("Add - Attached!!!! start 'child_added'");
        wizShowOptions(questionKey);
    })
    
    //when an option is deleted, redraw options
    sessionDB.child("questions/" + questionKey + "/options").on("child_removed", function(snapshot){
        console.log("Remove Attached!!!!  start 'child_removed'");
        wizShowOptions(questionKey);
    })
            
    //go over options and start to listen tp changes in votes and texts
    sessionDB.child("questions/" + questionKey + "/options").once("value", function (optionsDB) {
        optionsDB.forEach(function (optionDB) {
            var optionKey = optionDB.key();            

            //listen to changes in texts
            listenToTextsChange(questionKey,optionKey);
     
            //listen to changes in votes and move options; update text 
            moveOptionsOnVoting(questionKey,optionKey);
        })
    })
                                                                
    wizShowOptions(questionKey);   
}

function wizShowOptions(questionKey){
    
    //open sub-page of the question and show options.
            
    var questionKeyStr = JSON.stringify(questionKey);
  
   
    
    sessionDB.child("questions/" + questionKey + "/options").once("value", function (optionsDB) {
    
        //array for all the options
        var optionsHtml = new Array();

        //get information for all options under the question and create aray with the options
        optionsDB.forEach(function (optionDB) {

            var optionKey = optionDB.key();
            var optionTitle = optionDB.val().text.title;
            var optionText = optionDB.val().text.mainText;
            var optionColor = optionDB.val().text.color;

            
            //Stringfing variable for the HTML of the option
            
            var optionKeyStr = JSON.stringify(optionKey);
            var yesStr = JSON.stringify("yes");
            var noStr = JSON.stringify("no");
            var optionTitleStr = JSON.stringify(optionTitle);
            
            if (optionColor === undefined) {
                var colorStr = "brown";
            } else {
                var colorStr = optionColor;
            }

            var optionID = "Z_" + questionKey + "_" + optionKey + "_div";
            
            //get votes
            var yesVotes, noVotes;
            var votesObj = new Object();
            
            votesObj = countVotes(questionKey,optionKey);
            yesVotes = votesObj.yes;
            noVotes = votesObj.no;
            
            

            //build the option HTML
            var optionHtmlCurrent =
                      "<div class='wizLayout' id='" + optionID + "' >" +
                            "<div class='wizLeftPanel'>" +
                                "<div class='wizVoteUp wizButtons clickables' onclick='setWizVote(" + questionKeyStr + "," + optionKeyStr + "," + yesStr + ")'><img src='img/Yes.png' width='30px'>" +
                                "</div>" +
                                "<div class='wizVoteDown wizButtons clickables' onclick='setWizVote(" + questionKeyStr + "," + optionKeyStr + "," + noStr + ")'><img src='img/no.png' height='30px'>" +
                                "</div>" +
                                "<div class='wizSuggest wizButtons clickables' onclick='setSuggestion()'><img src='img/suggestion.png' height='30px'>" +
                                "</div>" +
                                "<div class='wizTalk wizButtons clickables' onclick='startWizTalk(" + questionKeyStr + "," + optionKeyStr + ", " + optionTitleStr + ")'><img src='img/talk.png' height='30px'>" +
                                "</div>" +
                            "</div>" +
                            "<div class='wizMainWrapText' style='background-color:" + colorStr + "'>" +
                                "<div dir='rtl' class='wizMainText'>" +
                                    "<div class='wizMainTextTitle' contenteditable='false' id='" + questionKey + optionKey + "T'" +
                                    "ondblclick='editWizOption(" + questionKeyStr + "," + optionKeyStr + ")'>"+
                                        optionTitle +
                                    "</div>" +
                                    "<div class='wizMainTextText' contenteditable='false' id='" + questionKey + optionKey + "'" +
                                    "ondblclick='editWizOption(" + questionKeyStr + "," + optionKeyStr + ")'>"+
                                        optionText +
                                    "</div>" +
                                "</div>" +
                                " <input type='button' class='pure-button pure-button-primary button-edit-margin button-small' value='עריכה' onclick='editWizOption(" + questionKeyStr + "," + optionKeyStr + ")'> " +
                                " <span style='color: white' id='" + questionKey + optionKey + "votes'>בעד:" + yesVotes + ", נגד: " + noVotes + " תוצאה: "+ (yesVotes-noVotes) + "</span>" +
                            "</div></div>";
            //add option to array of options
            var sumVotes = yesVotes-noVotes;
            
            optionsHtml.push([sumVotes, optionHtmlCurrent, optionID, -1]); //[score, HTML, ID, location]
            
        })
       
        //sort by votes

        optionsHtml.sort(function (a, b) { return b[0] - a[0] });
        for (i in optionsHtml) {
            optionsHtml[i][3] = i; // set index after sorting            
        }
        
        optionsHtmlOld = optionsHtml;
      
        //set header of question
        var headerText = '';

        sessionDB.child("questions/" + questionKey + "/header").once("value", function (headerData) {
            headerText = headerData.val();
        })

        questionsList = JSON.stringify("questionsList");
        
        //create html for header
        var htmlwizQuestion = "<img src='img/plusOption.png' id='wizPlus' class='clickables topButtons' onclick='crearteNewOptionTexbox(" + questionKeyStr + ")'>" +
                    "<img src='img/update.png' id='wizUpdate' class='clickables topButtons' onclick='wizShowOptions(" + questionKeyStr + ")'>" +
                    "<img src='img/close.png' id='wizBack' class='clickables topButtons' onclick='closeWizQuestions(" + questionKeyStr + ")' id='okWizQuestion'>" +                    
                    "<div class='wizHeader'>שאלה: " + headerText + "</div><div id='editWizQuestion'></div>";
        
        //build all page wizQuestions HTML
        for (i in optionsHtml) {
            htmlwizQuestion += optionsHtml[i][1];
        }

        
        
        hideAllEcept("wizQuestion");
        $("#wizQuestion").show();
        $("#wizQuestion").html(htmlwizQuestion);
        $("#editWizQuestion").hide();
        
                        
        //move options
        console.log("show wiz options....")
        moveOptions(optionsHtml);
        
    })
}

//Start listen to changes in texts in DB and update options

function listenToTextsChange (questionKey, optionKey) {
    console.log("ID text had changed: "+ optionKey);
    sessionDB.child("questions/" + questionKey + "/options/" + optionKey + "/text").on("value", function (textData) {
                console.log("Texts - Attached!!!!!!!!!!");
                $("#" + questionKey + optionKey).html(textData.val().mainText);
                $("#" + questionKey + optionKey + "T").html(textData.val().title);
            }) 
}

function moveOptions(optionsHtml){
    for (i in optionsHtml) {
            
            var optionLocation = optionsHtml[i][3]*(153+10);
            var optionLocationStr = JSON.stringify(optionLocation)+"px";
            
            $("#"+optionsHtml[i][2]).animate({top: optionLocationStr}, "slow");
            console.log("option["+i+"] "+optionsHtml[i][2] + " location is " + optionLocationStr + "with votes: " + optionsHtml[i][0]);
        }
}

//count votes
function countVotes(questionKey, optionKey){

    var votesDB = sessionDB.child("questions/" + questionKey + "/options/" + optionKey + "/votes");

    votesDB.once("value", function (voters) {
                
        noVotesCh = 0;
        yesVotesCh = 0;
                
        voters.forEach(function (vote) {
            if (vote.val() === "no") {
                noVotesCh++;
            }
            if (vote.val() === "yes") {
                yesVotesCh++;                
            }
        })
        $("#" + questionKey + optionKey + "votes")
            .text("בעד: " + yesVotesCh + ", נגד: " + noVotesCh + ", תוצאה: " + (yesVotesCh - noVotesCh));
    
       
   //     moveOptions(optionsHtmlOld, questionKey);   
        
    });
    
    return {yes: yesVotesCh, no: noVotesCh};
}



function moveOptionsOnVoting (questionKey, optionKey) {
    
    sessionDB.child("questions/" + questionKey + "/options/" + optionKey + "/votes").on("value", function(votes){
        
        var votes = new Object();
        votes = countVotes(questionKey,optionKey);
        sumVotes = votes.yes - votes.no;
        
        //$("#" + questionKey + optionKey + "votes")
        //    .text("בעד: " + yesVotes + ", נגד: " + noVotes + ", סך הכל: " + sumVotes);
        
        var optionsHtml = new Array();
        optionsHtml = optionsHtmlOld;
        
        //find options in array and add vote count to the option
        var optionLocation;
        for (i in optionsHtml){
            if (optionsHtml[i][2] == "Z_"+ questionKey + "_" + optionKey + "_div"){
                console.log("Found option "+ "Z_"+ questionKey + "_" + optionKey + "_div");
                optionsHtml[i][0] = sumVotes;
                break;
            };
            console.log ("couldn't find option: "+ "Z_"+ questionKey + "_" + optionKey + "_div");
        }
        
        //order in a new order        
        orderOptions(optionsHtml)
        
        optionsHtmlOld = optionsHtml;
        
        //move to new position
        
        moveOptions(optionsHtml);
                
    })
}

function orderOptions (optionsHtml) {
    optionsHtml.sort(function (a, b) { return b[0] - a[0] });
        for (i in optionsHtml) {
            optionsHtml[i][3] = i; // set index after sorting            
        }
}

function setWizVote(questionKey, optionKey, yesOrNot) {

    //Set new vote to an option    
    var votingDB = sessionDB.child("questions/" + questionKey + "/options/" + optionKey + "/votes/");

    votingDB.child(userName).set(yesOrNot);
    
}

// update text

function updateText(questionKey, optionKey){
    
    var textID = questionKey+optionKey;
        
    var textInput = $("#"+textID+"Edit").html();
    textInput = textInput.replace(/(?:\r\n|\r|\n)/g, '<br />');
    var titleInput = $("#"+textID+"TEdit").html();
        
    sessionDB.child("questions/"+questionKey+"/options/"+optionKey+"/text/").update({mainText: textInput, title: titleInput});
    
    //wizShowOptions(questionKey);
    $("#editWizQuestion").hide(500);
}


//create new option edit box

function crearteNewOptionTexbox (questionKey) {
    
    var questionKeyStr = JSON.stringify(questionKey);
        
    var htmlText = "<div id='newOptionBoard'>אנא הציעו הצעה חדשה:<form class='pure-form'><input name='title' type='text' placeholder='כותרת ההצעה' size='20'><textarea name='text' placeholder='הסבר על ההצעה' rows='4' cols='30'></textarea><input type='button' value='אישור' class='pure-button pure-button-primary' onclick='createOption("+questionKeyStr+", this.form)'> <input type='button' class='pure-button button-warning' value='ביטול' onclick='hideEditWizQuestion()'></form></div>";
        
        $("#editWizQuestion").html(htmlText).show(500);
    
}

//create new option in DB and show the options

function createOption(questionKey, form){
    
    var title = form.title.value;
    var text = form.text.value;
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');   
      
    var newOption = sessionDB.child("questions/"+questionKey+"/options").push({text:
                                                               {
                                                                   mainText:text,
                                                                   title:title,
                                                                   color: getRandomColor()
                                                               }
                                                              });
    
    var optionKey = newOption.key();
    console.log ("New option key is: " + optionKey);
    
    
    $("#editWizQuestion").hide(500);
    wizShowOptions(questionKey);
    
    //listen to changes in texts
    listenToTextsChange(questionKey,optionKey);
     
    //listen to changes in votes and move options; update text 
    moveOptionsOnVoting(questionKey,optionKey);
}

// delete option
       
function deleteWizOption (questionKey, optionKey){
    
    if (confirm("האם למחוק?") === false) {
        return;
    }
    
    sessionDB.child("questions/"+questionKey+"/options/"+optionKey).remove();
        
}

// --------------Edit Box ----------------------------
function editWizOption (questionKey, optionKey) {
    
    var questionKeyStr = JSON.stringify(questionKey);
    var optionKeyStr = JSON.stringify(optionKey);
    
        
    sessionDB.child("questions/"+questionKey+"/options/"+optionKey).once("value",function(optionData){
        var titleOption = optionData.val().text.title;
        var textOption = optionData.val().text.mainText;
        textOption = textOption.replace(/(?:\r\n|\r|\n)/g, '<br />');
        
        if (optionData.val().text.color === undefined){            
            var color = "brown";
        } else {
            var color = optionData.val().text.color;
        }
            
        var colorStr = JSON.stringify(color);
        
        var htmlText = "<div class='wizLayout wizLayoutEdit' style='background-color:"+colorStr+">"+                            
                            "<div class='wizMainWrapText wizMainWrapTextEdit'>"+
                                "<div dir='rtl' class='wizMainText wizMainTextEdit'>"+
                                    "<div class='wizMainTextTitle wizMainTextTitleEdit' contenteditable='true' id='"+questionKey+optionKey+"TEdit'>"+
                                        titleOption+
                                    "</div>"+
                                    "<div class='wizMainTextText wizMainTextTextEdit' contenteditable='true' id='"+questionKey+optionKey+"Edit'>"+
                                        textOption+
                                    "</div>"+
                                "</div>"+
                                " <input type='button' class='pure-button pure-button-primary' value='OK' onclick='updateText("+questionKeyStr+","+optionKeyStr+")'> "+
                                 "<input type='button' class='button-align-right pure-button button-error' value='מחיקה'"+
                                " onclick='deleteWizOption("+questionKeyStr+","+optionKeyStr+")'> "+                                
                            "</div></div>";
        
        $("#editWizQuestion").html(htmlText).show(500);
        
    })
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function hideEditWizQuestion () {
    $("#editWizQuestion").hide(500);
}

function closeWizQuestions(questionKey){
    sessionDB.child("questions/"+questionKey).off();
    sessionDB.child("questions/"+questionKey + "/options").off();
    hideAllEcept("questionsList");
}