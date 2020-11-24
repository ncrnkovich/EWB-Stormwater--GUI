function check() {

    var question1 = parseInt(document.quiz.question1.value, 10); //area of total property
    var question2 = parseInt(document.quiz.question2.value, 10); // area land
    var question3 = parseInt(document.quiz.question3.value, 10); // roof area
    var question4 = document.quiz.question4.value;
    var question5 = document.quiz.question5.value;

    var numQuestions = 5; // number of questions

    // OPTION CALCULATOR (points system)
    var option = new Array(numQuestions); //array of options
    var i;
    for (i = 0; i < (numQuestions); i++) {
        option[i] = 0; // initializes each option point counter as 0
    }

    // add a point to the option if the user answers a question that corresponds
    // with the option
    if (question1 <= 100) {
        option[0]++;
    } else if (question1 <= 200) {
        option[1]++;
    } else {
        option[2]++;
    }

    if (question2 < 100) {
        option[0]++;
    } else if (question2 > 100) {
        option[1]++;
    } else {
        option[2]++;
    }

    if (question3 < 100) {
        option[0]++;
    } else if (question3 > 100) {
        option[1]++;
    } else {
        option[2]++;
    }

    if (question4 == "A") {
        option[0]++;
    } else if (question4 == "B") {
        option[1]++;
    } else {
        option[2]++;
    }

    if (question5 == "A") {
        option[0]++;
    } else if (question5 == "B") {
        option[1]++;
    } else {
        option[2]++;
    }

    // CALCULATE RESULT (which option with the most points)
    var result = option[0];
    var resultNum = 0;
    for (i = 0; i < numQuestions; i++) {
        if (option[i] > result) {
            result = option[i];
            resultNum = i;
        }
    }

    // DISPLAY results
    //each element of this array coordinates with the details of each option
    // i just put in random links for now
    var optionLinks = ["https://quizlet.com/", "https://nd.edu", "https://www.google.com/"];

    if (isNaN(question1) || isNaN(question2) || isNaN(question3)) {
        document.getElementById("alert").style.visibility = "visible";
        document.getElementById("after_submit").style.visibility = "hidden";
    } else {
        document.getElementById("after_submit").style.visibility = "visible";
        document.getElementById("option_result1").innerHTML = "1. Option " + (resultNum + 1);
        document.getElementById("option_result2").innerHTML = "2. Option " + (resultNum + 1);
        document.getElementById("option_result3").innerHTML = "3. Option " + (resultNum + 1);
        document.getElementById("link").href = optionLinks[resultNum];
        document.getElementById("alert").style.visibility = "hidden";
    }

}