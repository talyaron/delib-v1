const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

exports.updateVotes = functions.database
    .ref('sessions/{sessionId}/questions/{questionId}/options/{optionId}/votes')
    .onUpdate((change, context) => {
        var sessionId = context.params.sessionId;
        var questionId = context.params.questionId;
        var optionId = context.params.optionId;
        var sumVotes = 0;

        var usersVotes = change.after;
        var yesVotes = 0, noVotes = 0;

        usersVotes.forEach(userVote => {
            if (userVote.val() === 'yes') {
                sumVotes++;
                yesVotes++;
            } else if (userVote.val() === 'no') {
                sumVotes--;
                noVotes++;
            }

        })

        return admin.database()
            .ref('sessions/' + sessionId + '/questions/' + questionId + '/options/' + optionId + '/sumVotes')
            .update({ sumVotes: sumVotes, yesVotes: yesVotes, noVotes: noVotes })

    })

exports.countChats = functions.database
    .ref('sessions/{sessionId}/questionsChat/{questionId}/options/{optionId}/chat')
    .onUpdate((change, context) => {
        var messagesDB = change.after;
        var sessionId = context.params.sessionId;
        var questionId = context.params.questionId;
        var optionId = context.params.optionId;

        var numberOfMessages = messagesDB.numChildren();

        return admin.database()
            .ref('sessions/' + sessionId + '/questionsChat/' + questionId + '/options/' + optionId)
            .update({ messagesCount: numberOfMessages })

    })
