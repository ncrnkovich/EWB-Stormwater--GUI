function check() {
    //Each variable represents an answer to a question
    //Keep in order
    //need parseInt() for free response questions
    var totalArea = parseInt(document.quiz.totalArea.value, 10); //area of total property
    var totalImpervious = parseInt(document.quiz.totalImpervious.value, 10); // area land
    var areaPermanent = parseInt(document.quiz.areaPermanent.value, 10); // roof area
    var propType = document.quiz.propType.value;
    var downspoutDisconnect = document.quiz.downspoutDisconnect.value;

    var i;

    // Calculations/math

    var inLieuFee = totalImpervious * 0.61; // $0.61 / sq ft of impervious land for disconnect fee
    var stormFee;
    var stormRunoff;
    var ERU = 2700; // 2700 sq ft in one Equivalent Residental Unit
    var propRate; // $5 / ERU for commercial, $2 / ERU for residential properties per month for stormwater fee (tentative)
    var totalYearlyFees;
    var perviousArea = totalArea - totalImpervious;
    var Cimpermeable = 1;
    var Cpermeable = 0.45; // averaging runoff coeff for permeable land
    var I10year;

    // Fee calculations

    // based on property type, set property fee
    if (propType == "R") {
        propRate = 2;
    } else {
        propRate = 5;
    }
    stormFee = (totalArea / ERU) * propRate * 12; // YEARLY fee (note the x12)

    if (downspoutDisconnect == "Y") {
        inLieuFee = 0; // if their downspout is disconnected, no in-lieu-of fee
    }
    totalYearlyFees = inLieuFee + stormFee;

    // Runoff calculations

    if (totalArea > 10 * ERU) {
        I10year = 3.14; // [in/hr] using 30min time of concentration for larger properties
    } else {
        I10year = 4.52; // [in/hr] using 15 min time of concentration for smaller properties
    }
    stormRunoff = (Cimpermeable * totalImpervious + Cpermeable * perviousArea) * I10year / 720; // [ft^3/min]




    // OPTION CALCULATOR
    //for each option, add a new element (KEEP IN ORDER! & keep string name the same as the id)
    var GSIoptions = ["RainGardensSubmit", //ELEMENT NUMBER: 0
        "TreeBoxesSubmit", //1
        "DryWellsSubmit", //2
        "PorousPavementSubmit", //3
        "GrassPaversSubmit", //4
        "PermeableUnitPaversSubmit", //5
        "InfiltrationChamberSubmit", //6
        "SurfaceDetentionSubmit", //7
        "BioretentionSubmit", //8
        "InfiltrationBasinSubmit", //9
        "InfiltrationTrenchSubmit", //10
        "VegetativeSwaleSubmit", //11
        "VegetativeFilterStripSubmit", //12
        "GreenRoofSubmit", //13
        "UndergroundDetentionSubmit", //14
        "ConstructedWetlandSubmit", //15
        "WetPondSubmit", //16
        "RainBarrelsCisternsSubmit" //17
    ];

    var GSIoptionsBool = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    // // Series of NESTED if/else statements... if (condition) then change the GSIoptionsBool to 0 for all of the  incompatible options (element # correlates with GSIoptions)
    if (propType == "R") {

        //RESIDENTIAL -->rain gardens, dry wells, porous pavement, grass pavers, permeable unit pavers, vegetative swales, vegetative filter strip, constructed wetland, wet pond, rain barrels/cisterns
        GSIoptionsBool[1] = 0;
        GSIoptionsBool[6] = 0;
        GSIoptionsBool[7] = 0;
        GSIoptionsBool[8] = 0;
        GSIoptionsBool[9] = 0;
        GSIoptionsBool[10] = 0;
        GSIoptionsBool[13] = 0;
        GSIoptionsBool[14] = 0;

    } else if (propType == "C") {

        //COMMERCIAL -->tree boxes, dry wells, porous pavement, grass pavers, permeable unit pavers, infiltration chamber, surface detention, bioretention, infiltration basin, infiltration trench, vegetative swales, vegetative filter strip, green roof, underground detention, constructed wetland, wet pond, rain barrels/cisterns										
        GSIoptionsBool[0] = 0;

        if (slope == "Y") {
            //significant slope --> tree boxes, dry wells, porous pavement, permeable unit pavers, grass pavers, infiltration chamber, surface detention, green roof, underground retention, wet pond
            GSIoptionsBool[8] = 0;
            GSIoptionsBool[9] = 0;
            GSIoptionsBool[10] = 0;
            GSIoptionsBool[11] = 0;
            GSIoptionsBool[12] = 0;
            GSIoptionsBool[15] = 0;
        }

        if (totalArea < 6000) { //******* condition refers to the question: Is your residential area on a small or large scale?  ******

            //NO significant alteration --> NOT:	porous pavement, permeable unit pavers, infiltration chamber,surface detention, infiltration basin, infiltration trench, vegetable filter strip, wet pond, constricted wetland
            GSIoptionsBool[3] = 0;
            GSIoptionsBool[5] = 0;
            GSIoptionsBool[6] = 0;
            GSIoptionsBool[7] = 0;
            GSIoptionsBool[9] = 0;
            GSIoptionsBool[10] = 0;
            GSIoptionsBool[12] = 0;
            GSIoptionsBool[15] = 0;
        }

    } else if (propType = "I") {

        //INDUSTRIAL--> tree boxes, dry wells, porous pavement, infiltration chamber, surface detention, infiltration basin, infiltration trench, vegetative swales, vegetative filter strip, green roof, underground detention, constructed wetland, wet pond, rain barrels/cisterns				
        GSIoptionsBool[0] = 0;
        GSIoptionsBool[4] = 0;
        GSIoptionsBool[5] = 0;
        GSIoptionsBool[8] = 0;
    }

    //Set about tab to be active by default
    var AboutTab = document.getElementsByClassName("AboutTab");
    for (i = 0; i < AboutTab.length; i++) {
        AboutTab[i].className = AboutTab[i].className + " active";
    }

    // Hides all options to reset if they enter new values
    for (i = 0; i < GSIoptions.length; i++) {
        document.getElementById(GSIoptions[i]).style.display = "none";

    }
    // if any questions are not filled out, generates prompt to answer all questions
    if (isNaN(totalArea) || isNaN(totalImpervious) || isNaN(areaPermanent)) {
        document.getElementById("alert").style.display = "block";
    } else {
        document.getElementById("alert").style.display = "none";
        for (i = 0; i < GSIoptions.length; i++) {
            if (GSIoptionsBool[i]) {
                document.getElementById(GSIoptions[i]).style.display = "block";
            }
        }
    }
}

function changeview(clickedIndex, tabName) {
    // Get the class vectors for each tab content
    var AboutText = document.getElementsByClassName("AboutText");
    var CostInfoText = document.getElementsByClassName("CostInfoText");
    // Get class vectors for each tab type
    var AboutTab = document.getElementsByClassName("AboutTab");
    var CostTab = document.getElementsByClassName("CostTab");

    // Change the display of each tab for the selected div to none

    AboutText[clickedIndex].style.display = "none";
    CostInfoText[clickedIndex].style.display = "none";

    // If the the button was the CostInfoText tab, make that div visible. have the summary visible by default
    if (tabName == "CostTab") {
        CostInfoText[clickedIndex].style.display = "block";
        CostTab[clickedIndex].className = CostTab[clickedIndex].className + " active"; //Make button active
        AboutTab[clickedIndex].className = AboutTab[clickedIndex].className.replace(" active", "");

    } else {
        AboutText[clickedIndex].style.display = "block";
        AboutTab[clickedIndex].className = AboutTab[clickedIndex].className + " active";
        CostTab[clickedIndex].className = CostTab[clickedIndex].className.replace(" active", "");

    }

}


function showmoreless(clickedIndex) {

    var LearnMore = document.getElementsByClassName("learn_more");
    var morelessbtntext = document.getElementsByClassName("MoreLessText");

    if (LearnMore[clickedIndex].style.display === "block") {
        LearnMore[clickedIndex].style.display = "none";
        morelessbtntext[clickedIndex].innerHTML = "More";


    } else {
        LearnMore[clickedIndex].style.display = "block";
        morelessbtntext[clickedIndex].innerHTML = "Less";
    }



}