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
    var GSIoptions = ["after_submit1", "after_submit2", "after_submit3"];
    var GSIoptionsBool = [0, 0, 0];

<<<<<<< HEAD
    // // Series of NESTED if/else statements... if (condition) then delete an option from the array (it is not applicable for the user's property type)
    if (question1 >= 10000) {
        GSIoptionsBool[0] = 1;
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
    if (question2 >= 5000) {
        GSIoptionsBool[1] = 1;
    }
    for (i = 0; i < GSIoptions.length - 1; i++) {
        document.getElementById(GSIoptions[i]).style.display = "none";
    }

    if (isNaN(question1) || isNaN(question2) || isNaN(question3)) {
=======

    // // Series of NESTED if/else statements... if (condition) then delete an option from the array (it is not applicable for the user's property type)
    if (question1 >= 10000) {
        GSIoptionsBool[0] = 1;
    }
    if (question2 >= 5000) {
        GSIoptionsBool[1] = 1;
    }
    for (i = 0; i < GSIoptions.length - 1; i++) {
        document.getElementById(GSIoptions[i]).style.display = "none";
    }

    if (isNaN(question1) || isNaN(question2) || isNaN(question3)) {
>>>>>>> 508a9f9bcee17a02c4c448a29254e0168ca5162a
        document.getElementById("alert").style.display = "block";
    } else {
        document.getElementById("alert").style.display = "none";
        for (i = 0; i < GSIoptions.length - 1; i++) {
            if (GSIoptionsBool[i]) {
                document.getElementById(GSIoptions[i]).style.display = "block";
            }
        }
    }

<<<<<<< HEAD
}

=======
}
>>>>>>> 508a9f9bcee17a02c4c448a29254e0168ca5162a
