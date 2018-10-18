
function startWizTalk(question, option, title) {

    var questionStr = JSON.stringify(question);
    var optionStr = JSON.stringify(option);

    $("#chat").html(
        "<div id='chatHeader' class='clickables' onclick='closeChat(" + questionStr + "," + optionStr + ")'>" +
        "<img src='img/close2.png' id='chatClose'> " + title + "</div>" +
        "<div id='chatBoard' style='overflow:scroll;overflow-x:hidden;'></div>" +
        "<div id='chatInput'><form><textarea id='chatInputText' style='width:98%' name='text'></textarea>" +
        "<input type='button' value='שליחה' class='pure-button ok-button' onclick='sendChatInput(" + questionStr + "," + optionStr + ",this.form, userName)'>" +
        "</div>"
    );

    hideAllEcept("chat");

    getChatHistory('on', question, option);

}




function sendChatInput(question, option, form, userName) {

    var chatInputDB = sessionDB.child("questionsChat/" + question + "/options/" + option + "/chat/");
    text = form.text.value;
    form.text.value = "";

    //var timeOfInput = new Date();
    //timeOfInput = parseDateToDB(timeOfInput);
    var timeOfInput = firebase.database.ServerValue.TIMESTAMP;

    chatInputDB.push({ name: userName, text: text, time: timeOfInput });

}

function getChatHistory(onOff, question, option) {

    var chatHistoryDB = sessionDB.child("questionsChat/" + question + "/options/" + option + "/chat/");
    if (onOff == 'on') {

        chatHistoryDB.limitToLast(20).orderByChild("time").on("value", function (chatsInput) {

            var divChats = "";

            chatsInput.forEach(function (input) {
                var userColor = "";
                if (input.val().name === userName) {
                    userColor = "style='background-color:#40fcd0'"
                }

                var textStr = input.val().text;
                textStr = textStr.replace(/(?:\r\n|\r|\n)/g, '<br />');

                divChats += "<div class='chatsInput' " + userColor + "><span class='chatsNames'>" + input.val().name + ":</span>" +
                    "<div class='inputTexts'><i>" + textStr + "</i></div>" +
                    "</div>";

            })
            $("#chatBoard").html(divChats);

            $("#chatBoard").animate({ scrollTop: $('#chatBoard')[0].scrollHeight }, 1000);
        })
    } else {
        chatHistoryDB.off('value');
    }

}

function closeChat(question, option) {
    getChatHistory('off', question, option);

    hideAllEcept("wizQuestion");



}

function countChats(onOff, questionId, optionId) {
    var messagesCountRef = sessionDB.child('questionsChat/' + questionId + '/options/' + optionId + '/messagesCount');
    if (onOff == 'on') {
        messagesCountRef.on('value', messagesCountDB => {
            var messagesSinceLastVisit = 0;
            var lastVisit = _.get(store.user, 'chats[' + questionId + '][' + optionId + '].lastChatCount', 0);
            var currentVisit = messagesCountDB.val() || 0;
            if (messagesCountDB.val()) {
                messagesSinceLastVisit = currentVisit - lastVisit;
            }
            if (messagesSinceLastVisit > 99) { messagesSinceLastVisit = "99+" }
            $("#" + optionId + "count").text(messagesSinceLastVisit)
        })
    } else {

        messagesCountRef.off('value');

        messagesCountRef.once('value', messagesCountDB => {

            _.set(store.user, 'chats[' + questionId + '][' + optionId + '].lastChatCount', messagesCountDB.val() || 0);

        })

    }

}

