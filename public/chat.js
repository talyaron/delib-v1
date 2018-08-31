
function startWizTalk(question, option, title) {
    
    console.log("q: "+ question + ", op: "+ option);
    
    var questionStr = JSON.stringify(question);
    var optionStr = JSON.stringify(option);
    
    $("#chat").html(
        "<div id='chatHeader' class='clickables' onclick='closeChat()'>"+
            "<img src='img/close2.png' id='chatClose'> "+title+"</div>"+
            "<div id='chatBoard' style='overflow:scroll;overflow-x:hidden;'></div>"+
            "<div id='chatInput'><form><textarea id='chatInputText' style='width:98%' name='text'></textarea>"+
                "<input type='button' value='שליחה' class='pure-button ok-button' onclick='sendChatInput("+questionStr+","+optionStr+",this.form, userName)'>"+
        "</div>"
    );
    
    hideAllEcept("chat");    
    
    getChatHistory(question, option);
}


function sendChatInput(question,option, form, userName){
    
    var chatInputDB = sessionDB.child("questionsChat/"+question+"/options/"+option+"/chat/");
    text = form.text.value;
    form.text.value = "";
    
    //var timeOfInput = new Date();
    //timeOfInput = parseDateToDB(timeOfInput);
    var timeOfInput = Firebase.ServerValue.TIMESTAMP;
    console.log(timeOfInput);
    
    chatInputDB.push({name:userName, text:text, time:timeOfInput});
    
}

function getChatHistory(question,option){
    
    var chatHistoryDB = sessionDB.child("questionsChat/"+question+"/options/"+option+"/chat/");
    
    chatHistoryDB.orderByChild("time").on("value",function(chatsInput){
        
        var divChats = "";
        
        chatsInput.forEach(function(input){
            var userColor = "";
            if (input.val().name === userName){
                userColor = "style='background-color:#40fcd0'"
            }
            
            
            var textStr = input.val().text; 
            textStr = textStr.replace(/(?:\r\n|\r|\n)/g, '<br />');
            


            
            divChats += "<div class='chatsInput' "+userColor+"><span class='chatsNames'>"+input.val().name+":</span>"+
                "<div class='inputTexts'><i>"+textStr+"</i></div>"+
                "</div>";
            
        })
        $("#chatBoard").html(divChats);
        
        
        
       //var elem = document.getElementById('chatBoard');
       //elem.scrollTop = elem.scrollHeight;
        //console.log("height: "+elem.scrollHeight);
        
        $("#chatBoard").animate({ scrollTop: $('#chatBoard')[0].scrollHeight}, 1000);
       
        
    })
      
}

function closeChat(){
    hideAllEcept("wizQuestion");
}

