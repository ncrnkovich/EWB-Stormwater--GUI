function check() {
    //Each variable represents an answer to a question
    //Keep in order
    //need parseInt() for free response questions
    var question1 = parseInt(document.quiz.question1.value, 10); //area of total property
    var question2 = parseInt(document.quiz.question2.value, 10); // area land
    var question3 = parseInt(document.quiz.question3.value, 10); // roof area
    var question4 = document.quiz.question4.value;
    var question5 = document.quiz.question5.value;

    var i;
    // OPTION CALCULATOR
    //for each option, add a new element (KEEP IN ORDER! & keep string name the same as the id)
    var validOptions = ["after_submit1", "after_submit2", "after_submit3"];

    // Series of NESTED if/else statements... if (condition) then delete an option from the array (it is not applicable for the user's property type)
    if (question1 <= 100) {
        delete validOptions[0]; //this means that the first option is not valid & deletes it from the array
    } else {
        delete validOptions[1];
    }

    // DISPLAY results
    //each element of this array coordinates with each option

    if (isNaN(question1) || isNaN(question2) || isNaN(question3)) {
        document.getElementById("alert").style.visibility = "visible";
        //document.getElementById("after_submit").style.visibility = "hidden";
		for (i = 0; i < (validOptions.length); i++) {
      	  document.getElementById(validOptions[i]).style.visibility = "hidden";
  		}

    }
    for (i = 0; i < (validOptions.length); i++) {
    	if (validOptions[i] != undefined) {
    		document.getElementById("alert").style.visibility = "hidden"; 
            document.getElementById(validOptions[i]).style.visibility = "visible";
        }
    }
}
