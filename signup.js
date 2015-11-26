$("#signup").hide();

function signup(){
    console.log("signup");
        
    $("#signup").show();
    $("#loginForm").hide(400);
    
    DB.unauth();
}

function setNewUser(form){
    var email = form.email.value;
    var name = form.name.value;
    var pass = form.pass.value;
    
    //Create user
    DB.createUser({
        email    : email,
        password : pass
        }, function(error, userData) {
            if (error) {
                console.log("Error creating user:", error);
                $("#loginMessage").css("background-color","red");
                
                
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
                $("#loginMessage").css("background-color","green");
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

function hideLoginScreen(){
    console.log("hide");
    $("#signup").hide(400);
    $("#loginForm").show(400);
    $("#isFirstTime").hide();
}