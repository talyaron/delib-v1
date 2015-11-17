           
//Parse frome Date object to JSON date
function parseDateToDB (time) { 
    return (time.getFullYear().toString()
        + "-" +("0" + (time.getMonth()+1).toString()).slice(-2)
        + "-" +("0" + time.getDate().toString()).slice(-2)
        + "-" +("0" + time.getHours().toString()).slice(-2)
        + ("0"+time.getMinutes().toString()).slice(-2)
        + "-" +("0"+time.getSeconds().toString()).slice(-2));
};
            
            
//Reshuffle Array
function shuffleArray(array) {
    
    
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
      }
    
    return array;
}
            
//find name in array
function findIndex(arr, ID) {
    for (i in arr) {
        var arrLevel2 = arr[i];
                    
        if ($.inArray(ID, arrLevel2) >-1) {
                        
            return arrLevel2[1];
            break;
        };
    }
    return "";
};


//Rolling an array function

function rollArray(array) {
    var tempObject = array[0]; //take first part
    
    array.splice(0,1); //delete first part
    array.push(tempObject); // add it at the end
    //return array;
}
            