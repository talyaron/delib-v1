        
            // --------------- Voting --------------------------
            
            //start simple question page:

            function voteQuestion(questionName) {
                //load page
                hideAllEcept("simplVoting");
                
                isExplainOpen = true;
                
                //show explanation hide results  (Not working!!!!! change to new settings)
                /*
                $("#explain").show(500);
                $("#results").hide();
                */
                
                
                var optionsArray = new Array();
                var questionHeader;
                
                //load header title from DB
                
                sessionDB.child("questions/"+questionName+"/header").once("value", function(header){
                    questionHeader = header.val();
                    $("#questionHeader").html("שאלה: "+questionHeader)
                })
                
                //load voting options with "true show" and show them
                
                sessionDB.child("questions/"+questionName+"/options").once("value", function(options){
                    
                    //search options with "true show"
                    
                   
                    options.forEach(function(option){
                        
                        var isShow = option.val().showOnRegVote;                        
                        
                        // add to array if true show
                        if (isShow){
                            //get body and title
                            var optionTitle = option.val().text.title;
                            var optionBody = option.val().text.mainText;
                            
                            console.log("infoTit: " + optionTitle);
                            
                            optionsArray.push([optionTitle, optionBody, option.key()]);
                        }
                        
                    })
                    
                    var numberOfOptions = optionsArray.length
                    console.log("number of options: " + numberOfOptions);
                    //show options 
                    var voteDivHTML = '<div id="votePanel">'+
                        '<div class="wizHeader"><span>שאלה: ' + questionHeader + '</span>'+
                        '<img src="img/close.png" id="backButtonSimpleVote" class="backButtons clickables" onclick="hideAllEcept(`questionsList`)" id="okQuestion"></div>';
                    var divCol;
                    var typeOfVote;
                    
                    
                    
                    
                    switch(numberOfOptions){
                        case 1: 
                            colWidth = 90;
                            typeOfVote = "yesNo";
                            break;
                        case 2:
                            colWidth = 40;
                            typeOfVote = "opAbsOp";
                            break;
                        case 3:
                            colWidth = 32;
                            typeOfVote = "3OpsAbs";
                            break;
                        case 4:
                            colWidth = 23;
                            typeOfVote = "4Ops";
                            break;
                        default:
                            colWidth = 15; 
                            typeOfVote = "4Ops";
                            
                    }
                    
                    
                    for (i in optionsArray){
                        voteDivHTML += '<div class="resultsBarEnv clickables" id="'+optionsArray[i][2]+'voteCol" style="left:'+(0+i*(colWidth+2))+'%; width: '+colWidth+'%">'+
                            '<div class="resultsBar" id="'+optionsArray[i][2]+'votsDiv"></div>'+
                            '<div class="voteButtons" id="'+optionsArray[i][2]+'voteBtn" onclick="voteAssign(`'+questionName+'`, `'+optionsArray[i][2]+'`)">'+optionsArray[i][0]+'</div><div>הסבר</div></div>'
                    }
                    
                    
                    voteDivHTML += '</div>';
                    
                    $("#simplVoting").html(voteDivHTML);
                    
                    //set all buttons to the same height:
                    var voteButtonsHeight = 0;
                    var voteButtonsHeightTemp = 0;
                    for (i in optionsArray){
                        voteButtonsHeightTemp = $("#"+optionsArray[i][2]+"voteBtn").height();
                        console.log("Height: "+ voteButtonsHeightTemp)
                        if (voteButtonsHeightTemp>voteButtonsHeight){
                            voteButtonsHeight = voteButtonsHeightTemp;
                        }
                    }
                    
                    if (voteButtonsHeight>120){voteButtonsHeight = 120};
                    
                    
                    $(".voteButtons").height(voteButtonsHeight);
                    
                    console.log("Height max: "+"#"+optionsArray[i][2]+"voteBtn: "+ voteButtonsHeight)
                        
                    
                    
                    
                    
                });
                
                //count votes and show them for each selecetd option
                
                for (i in optionsArray){
                    
                    listenToChangesInVotes(questionName, optionsArray[i][2], optionsArray[i][0]);
                    
                    
                }
                
            }
            
            

            //show option info
            

            //Hide option info

            
            // assign vote
            
            function voteAssign(question, optionID){
                
                //delete all other votes from all options for this user
                
                sessionDB.child("questions/"+question+"/options/").once("value", function(options){
                    options.forEach(function(option){
                        
                        console.log("option: "+ option.key());
                        if (userName != ""){
                            if (optionID == option.key()){
                                sessionDB.child("questions/"+question+"/options/"+option.key()+"/votes/"+userName).set("yes");
                            } else {
                                sessionDB.child("questions/"+question+"/options/"+option.key()+"/votes/"+userName).set("abstain");  
                            }
                        } else {
                            console.log ("Error: no username")
                        }
                    })
                })
                                    
                
                
                
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

//listen to changes in the database and change colunms of votes on screen
function listenToChangesInVotes (question, option, optionTitle){
    //listen to changes in the database
    
    sessionDB.child("questions/"+question+"/options/"+option+"/votes").on("value", function(votes){
        
        //create div for votes
         $("#"+option+"votsDiv").html("");
        
        //change columns of votes on screen               
        votes.forEach(function(vote){
            if (vote.val() == "yes"){                
                                
                $("#"+option+"votsDiv").prepend("<div>"+vote.key()+"</div>");
            }
            
            //$( "#"+option+"voteCol div").first().css( "background-color", "red" );
        }) 
                        
    })
}


           
