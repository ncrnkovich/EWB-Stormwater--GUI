function check() {
    //Each variable represents an answer to a question
    //Keep in order
    //need parseInt() for free response questions
    var totalArea = parseInt(document.quiz.totalArea.value, 10); //area of total property
    var totalImpervious = parseInt(document.quiz.totalImpervious.value, 10); // area land
    var areaPermanent = parseInt(document.quiz.areaPermanent.value, 10); // roof area
    var propType = document.quiz.propType.value;
    var question5 = document.quiz.question5.value;

    var i;

    // Calculations/math

    var inLieuFee = totalImpervious * 0.61;
    var stormFee;
    var stormRunoff;
    var ERU = 2700; // 2700 sq ft in one Equivalent Residental Unit
    var propRate; // $5 / ERU for commercial, $2 / ERU for residential properties per month for stormwater fee (tentative)
    var totalYearlyFees;
    var perviousArea = totalArea - totalImpervious;
    var Cimpermeable = 1;
    var Cpermeable = 0.45; // averaging runoff coeff for permeable land
    var I10year = 4.31; // rainfall intensity for 10 year event, [in/hr]
    // based on property type, set property fee
    if (propType = 1) {
        propRate = 2;
    } else {
        propRate = 5;
    }

    stormFee = (totalArea / ERU) * propRate * 12; // YEARLY fee (note the x12)
    totalYearlyFees = inLieuFee + stormFee;

    stormRunoff = (Cimpermeable * totalImpervious + Cpermeable * perviousArea) * I10year / 96.23; // gal/min


    // OPTION CALCULATOR
    //for each option, add a new element (KEEP IN ORDER! & keep string name the same as the id)
    var GSIoptions = ["after_submit1", "after_submit2", "after_submit3"];
    var GSIoptionsBool = [1, 1, 1];

    // // Series of NESTED if/else statements... if (condition) then delete an option from the array (it is not applicable for the user's property type)
    if (totalArea <= 10000) {
        GSIoptionsBool[0] = 0;
    }
    if (totalImpervious <= 5000) {
        GSIoptionsBool[1] = 0;
    }



    // DISPLAY results
    //each element of this array coordinates with each option}

    // Hides all options to reset if they enter new values
    for (i = 0; i < GSIoptions.length - 1; i++) {
        document.getElementById(GSIoptions[i]).style.display = "none";
    }
    // if any questions are not filled out, generates prompt to answer all questions
    if (isNaN(question1) || isNaN(question2) || isNaN(question3)) {
        document.getElementById("alert").style.display = "block";
    } else {
        document.getElementById("alert").style.display = "none";
        for (i = 0; i < GSIoptions.length - 1; i++) {
            if (GSIoptionsBool[i]) {
                document.getElementById(GSIoptions[i]).style.display = "block";
            }
        }
    }
}