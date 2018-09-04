//$("#signup").hide();

var auth = new Object();


//check if logged or signout
// function loginLogout(authData) {
//     if (authData) {
//         console.log("logedin");
//         getUserName();

//         var userNameWindow = localStorage.getItem("userName");

//         if (userName == "" && userNameWindow != null) {
//             //try to get it form window
//             userName = userNameWindow;
//             console.log("got user name from window:" + userName)
//         }

//         $("#login").hide();
//         $("header").html("שלום " + userName + " &nbsp<img id='logoutImg' class='clickables'src='img/logout.png' onclick='logout()' align='top'>");
//         showQuestions();
//     } else {
//         console.log("logedout");
//         $("header").html("");
//         $("#login").show(400);
//         hideAllEcept("login");
//     }
// }


$("#loginForm").keypress(
    function (event) {
        if (event.which == '13') {
            event.preventDefault();

        }
    });






//show signup screen
function signup() {

    $("#signup").show();
    $("#loginForm").hide(400);


}

//Signup
function setNewUser(form) {
    var email = form.email.value;
    var name = form.name.value;
    var pass = form.pass.value;

    //Create user
    DB.createUser({
        email: email,
        password: pass
    }, function (error, userData) {
        if (error) {
            console.log("Error creating user:", error);
            $("#loginMessage").css("background-color", "red");


            switch (error.code) {
                case "EMAIL_TAKEN":
                    $("#loginMessage").text('דוא"ל זה כבר רשום');
                    break;
                case "INVALID_EMAIL":
                    $("#loginMessage").text('דוא"ל זה אינו תקני');
                    break;
                default:
                    $("#loginMessage").text('הנתונים אינם תקינים');
            }

        } else {
            console.log("Successfully created user account with uid:", userData.uid);
            $("#loginMessage").css("background-color", "green");
            $("#loginMessage").text("משתמש נוצר בהצלחה");
            setTimeout(hideLoginScreen, 1200);

            //set user information to DB
            //var isNewUser = true;

            DB.child("users").child(userData.uid).set({
                name: name,
                email: email
            })
        }
    });
}

function hideLoginScreen() {

    $("#signup").hide(400);
    $("#loginForm").show(400);
    $("#isFirstTime").hide();
}

/*
function setName(form){
                var email = form.email.value;
                var pass = form.pass.value;
                
                $("#loginWait").text("רק רגע...");
                                
                DB.authWithPassword({
                  email    : email,
                  password : pass
                }, function(error, authData) {
                  if (error) {
                    console.log("Login Failed!", error);
                    
                    $("#loginMessage2").css("background-color","red");
                
                
                    switch (error.code) {
                      case "INVALID_PASSWORD":
                        $("#loginMessage2").text('סיסמא לא נכונה');
                        break;                  
                      case "INVALID_USER":
                         $("#loginMessage2").text('אין משתמש כזה');
                        break;
                      default:
                        $("#loginMessage2").text('הנתונים אינם תקינים');
                    }
                      
                  } else {
                    console.log("Authenticated successfully with payload:", authData);
                    
                    //find user name by uid
                      console.log("uid: "+authData.uid);
                    
                    getUserName();  
                      
                    //$("header").text("שלום "+email);
                    showQuestions(); //show question page
                    $("#login").hide(100);
                  }
                });
            }
*/
function logout() {
    console.log("logout");
    firebase.auth().signOut();
    hideAllEcept('login')
}


function getUserName(userUID) {
    DB.child("users/" + userUID).once("value", function (userData) {
        console.log("found uid: " + userData.val().name);
        userName = userData.val().name;
        $("header").html("שלום " + userName + " &nbsp<img id='logoutImg' class='clickables'src='img/logout.png' onclick='logout()' align='top'>");
    })
}

function enterLogin(e, form) {
    e.preventDefault();
    if (e.keyCode == 13) {
        anonymousAuthLogin(form)
    }

}


function anonymousAuthLogin(form) {


    store.user.name = form.name.value;
    if (store.user.uid) {
        DB.child('users/' + store.user.uid).update({ name: store.user.name });
        localStorage.setItem("uid", store.user.uid);
    }

    //save userName in window (to prevent lose of name in a case of reload)
    localStorage.setItem("userName", store.user.name);

    $("#login").hide();
    $("header").html("שלום " + store.user.name + " &nbsp<img id='logoutImg' class='clickables'src='img/logout.png' onclick='logout()' align='top'>");
    showQuestions();

}

firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.error('anonymousAuthLogin:', errorMessage);
});

var store = { user: {} }

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {


        console.log('User is signed in.')
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        store.user.uid = user.uid;
        store.user.isAnonymous = isAnonymous;
        getUserName(uid);

        auth = user;
        auth.uid = uid;
        auth.image = "img/avatar-male.png";


    } else {
        console.log('User is signed out.')

    }

});



//if not group owner, hide edit icon
//get group owner
sessionDB.child("details").once("value", function (snapshot) {
    var groupOwner = snapshot.val().owner;
    console.log("groupOwner: " + groupOwner + ", userName: " + userName);
    if (groupOwner == userName || groupOwner == undefined) {
        $(".editQuestionPen").css("display", "inline");
        console.log("Show!");
    } else {
        $(".editQuestionPen").css("display", "none");
        console.log("Hide!");
    }
})


