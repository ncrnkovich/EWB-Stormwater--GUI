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

    var GSIoptions = ["VegetativeInfiltrationID", // 0
        "DryWellsID", // 1
        "PermeablePavementID", // 2
        "NonvegetativeInfiltrationID", // 3
        "RainbarrelsCisternsID", // 4
        "GreenRoofsID", // 5
        "InfiltrationChamberID" // 6
    ];
    var GSIoptionsBool = [0, 0, 0, 0, 0, 0, 0];

    // // Series of NESTED if/else statements... if (condition) then change the GSIoptionsBool to 0 for all of the  incompatible options (element # correlates with GSIoptions)
    if (propType == "R") {

        // Residential: Vegetative Infiltration, Dry wells, porous pavement, rain barrels
        GSIoptionsBool[0] = 1;
        GSIoptionsBool[1] = 1;
        GSIoptionsBool[2] = 1;
        GSIoptionsBool[4] = 1;
        // Hide bioretention and filter strips for residential
        document.getElementById("Bioretention").style.display = "none";
        document.getElementById("VegetativeFilterStrip").style.display = "none";
        // hide infiltration trench 
        document.getElementById("InfiltrationTrench").style.display = "none";



    } else if (propType == "C") {

        // Commercial: vegetative infiltration, 
        for (i = 0; i < 7; i++) {
            GSIoptionsBool[i] = 1;
        }
    }


    //Set about tab to be active by default
    var AboutTab = document.getElementsByClassName("AboutTab");
    for (i = 0; i < AboutTab.length; i++) {
        AboutTab[i].className = AboutTab[i].className + " active";
    }

    // Hides all options to reset if they enter new values
    for (i = 0; i < GSIoptions.length; i++) {
        console.log(GSIoptions[i])
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

function changeview(clickedIndex, tabName, optionsOrder) {
    // Get the class vectors for each tab content
    var AboutText = document.getElementsByClassName("AboutText");
    var CostInfoText = document.getElementsByClassName("CostInfoText");
    // Get class vectors for each tab type
    var AboutTab = document.getElementsByClassName("AboutTab");
    var CostTab = document.getElementsByClassName("CostTab");

    // Get class vectors for each div content. 
    var VegInfilt = document.getElementsByClassName("VegInfilt");
    var DryWells = document.getElementsByClassName("DryWells");
    var PermPavement = document.getElementsByClassName("PermPavement");
    var NonvegInfilt = document.getElementsByClassName("NonvegInfilt");
    var Rainbarrel = document.getElementsByClassName("Rainbarrel");
    var InfiltChamber = document.getElementsByClassName("InfiltChamber");
    var GreenRoofs = document.getElementsByClassName("GreenRoofs");
    // **For new type of GSI, add class here**

    // This returns the ID of which GSI was activated
    var selectedOption = optionsOrder[clickedIndex];

    // This resets any active tab to being inactive so the active class doesn't accumulate
    AboutTab[clickedIndex].className = AboutTab[clickedIndex].className.replace(" active", "");
    CostTab[clickedIndex].className = CostTab[clickedIndex].className.replace(" active", "");

    // Change the display of each tab for the selected div to none
    CostInfoText[clickedIndex].style.display = "none";
    switch (selectedOption) {
        case "VegetativeInfiltrationID":
            for (i = 0; i < VegInfilt.length; i++) {
                VegInfilt[i].style.display = "none";
            };
            break;
        case "DryWellsID":
            for (i = 0; i < DryWells.length; i++) {
                DryWells[i].style.display = "none";
            };
            break;
        case "PermeablePavementID":
            for (i = 0; i < PermPavement.length; i++) {
                PermPavement[i].style.display = "none";
            };
            break;
        case "NonvegetativeInfiltrationID":
            for (i = 0; i < NonvegInfilt.length; i++) {
                NonvegInfilt[i].style.display = "none";
            };
            break;
        case "RainbarrelsCisternsID":
            for (i = 0; i < Rainbarrel.length; i++) {
                Rainbarrel[i].style.display = "none";
            };
            break;
        case "GreenRoofsID":
            for (i = 0; i < GreenRoofs.length; i++) {
                GreenRoofs[i].style.display = "none";
            };
            break;
        case "InfiltrationChamberID":
            for (i = 0; i < InfiltChamber.length; i++) {
                InfiltChamber[i].style.display = "none";
            };
            break;

            // Add a case for the ID of every GSI div

    };

    // If the the button was the CostInfoText tab, make that div visible. have the summary visible by default
    if (tabName == "CostTab" || tabName == "CostTab active") {
        CostInfoText[clickedIndex].style.display = "block";
        CostTab[clickedIndex].className = CostTab[clickedIndex].className + " active"; //Make button active
        AboutTab[clickedIndex].className = AboutTab[clickedIndex].className.replace(" active", "");

    } else {

        switch (selectedOption) {
            case "VegetativeInfiltrationID":
                for (i = 0; i < VegInfilt.length; i++) {
                    VegInfilt[i].style.display = "block";
                };
                break;
            case "DryWellsID":
                for (i = 0; i < DryWells.length; i++) {
                    DryWells[i].style.display = "block";
                };
                break;
            case "PermeablePavementID":
                for (i = 0; i < PermPavement.length; i++) {
                    PermPavement[i].style.display = "block";
                };
                break;
            case "NonvegetativeInfiltrationID":
                for (i = 0; i < NonvegInfilt.length; i++) {
                    NonvegInfilt[i].style.display = "block";
                };
                break;
            case "RainbarrelsCisternsID":
                for (i = 0; i < Rainbarrel.length; i++) {
                    Rainbarrel[i].style.display = "block";
                };
                break;
            case "GreenRoofsID":
                for (i = 0; i < GreenRoofs.length; i++) {
                    GreenRoofs[i].style.display = "block";
                };
                break;
            case "InfiltrationChamberID":
                for (i = 0; i < InfiltChamber.length; i++) {
                    InfiltChamber[i].style.display = "none";
                }
                // add case for IDs of all offered options
        };

        AboutTab[clickedIndex].className = AboutTab[clickedIndex].className + " active";
        CostTab[clickedIndex].className = CostTab[clickedIndex].className.replace(" active", "");

    }

};


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