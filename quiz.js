function check() {

    var question1 = parseInt(document.quiz.question1.value, 10); //area of total property
    var question2 = parseInt(document.quiz.question2.value, 10); // area land
    var question3 = parseInt(document.quiz.question3.value, 10); // roof area
    var question4 = document.quiz.question4.value;
    var question5 = document.quiz.question5.value;

    var numQuestions = 5; // number of questions

    // OPTION CALCULATOR (points system)
	var validOptions = ["after_submit1", "after_submit2", "after_submit3"];

    var i;
    for (i = 0; i < (numQuestions); i++) {
        option[i] = 0; // initializes each option point counter as 0
    }

    // Series of NESTED if/else statements... if (condition) then delete an option from the array (it is not applicable for the user's property type)
    if(question1 <=100){
		delete validOptions[0]; //this means that the first option is not valid & deletes it from the array
	}else{
		delete validOptions[1];
	}

    // DISPLAY results
    //each element of this array coordinates with each option
    var optionLinks = ["https://quizlet.com/", "https://nd.edu", "https://www.google.com/"];//more information about each option, just put in random links there for now

	if(isNaN(question1) || isNaN(question2) || isNaN(question3)){
      	document.getElementById("alert").style.visibility = "visible";
       	document.getElementById("after_submit").style.visibility = "hidden";
	}
	
	for(i=0; i< (validOptions.length); i++){
		if(validOptions[i] != undefined){
			document.getElementById(validOptions[i]).style.visibility = "visible";
		}
	} 

}
