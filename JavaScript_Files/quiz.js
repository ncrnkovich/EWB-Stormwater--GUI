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

    // Stormwater calculator
    var runoff = runoffCalc(propType, totalImpervious, areaPermanent);
    var totalRunoff = runoff[0];
    var maxRunoff = runoff[1];

    totalRunoff = totalRunoff * 35.315; // [m^3 to ft^3]
    maxRunoff = maxRunoff * 35.315; // [m^3/s to ft^3/s]

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

        // Commercial: all
        for (i = 0; i < 7; i++) {
            GSIoptionsBool[i] = 1;
        }
    }else if (propType == "I"){
		// Industrial: everything except green pavers, permable unit pavers, bioretention, rain gardens
		GSIoptionsBool[0] = 1;	
		GSIoptionsBool[1] = 1;
		GSIoptionsBool[2] = 1;		
		GSIoptionsBool[3] = 1;
		GSIoptionsBool[4] = 1;
		GSIoptionsBool[5] = 1;
		GSIoptionsBool[6] = 1;
		document.getElementById("Bioretention").style.display = "none";
		document.getElementById("GrassPavers").style.display = "none";
		document.getElementById("UnitPavers").style.display = "none";
		document.getElementById("RainGarden").style.display = "none";
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

};

function runoffCalc(propType, totalImpervious, areaPermanent) {

    // Runoff calculations
    var areaRoofDriveway;
    var parkingLotAreasqM = (totalImpervious - areaPermanent) / 10.764; // conversion from sq ft to sq meters
    TstarRoof = 120; // [s] time constant for driveways and roofs.

    if (parkingLotAreasqM < 1000) {
        TstarLot = 3.5 * 60; // if lot area is less than 1000 sq meters, Tstar is 3.5 min
    } else if (parkingLotAreasqM < 10000) {
        TstarLot = 8 * 60; // if between 1000 and 10000 sq meters, Tstar is 6 min
    } else {
        TstarLot = 12 * 60; // if greater than 1 Hectare, Tstar is 12 min for lot
    };

    // just input a new precip pattern and new Ptotal to change the storm
    var Ptotal = 3.55 * 25.4; // [mm] from NOAA, precipitation total for 10 year, 12 hour storm
    // I want to change this model to reflect CSO's, but can't until EmNet gets back to us
    var precipPattern = [0, 2, 5, 10, 15, 15, 10, 6, 5, 5, 5, 8, 12, 18, 22, 45, 60, 32, 33, 24, 22, 10, 15, 17, 18, 19, 22, 38, 50, 45, 45, 40, 42, 12, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var precipVector = new Array();

    var deltaT = 60; // [s]
    var QinRoof = new Array();
    var QinLot = new Array();
    var QoutRoof = new Array();
    var QoutLot = new Array();
    var Qout = new Array();
    var Qmax;
    var Vtotal = 0;
    var Volume = new Array();
    Volume[0] = 0; // initial condition

    var patternTotal = 0;
    for (i = 0; i < precipPattern.length; i++) {
        patternTotal = patternTotal + precipPattern[i];
    }; // i can't believe there isn't a sum function

    if (propType == "R") {
        areaRoofDriveway = totalImpervious / 10.764; // [sq m] for residences, treat all impervious area as room/driveway
        parkingLotAreasqM = 0; // no parking lot for residential properties
    } else {
        areaRoofDriveway = areaPermanent / 10.764; //[sq m]
    };

    // generate precipitation vector
    for (i = 0; i < precipPattern.length; i++) {
        precipVector[i] = Ptotal * precipPattern[i] / patternTotal;
        QinRoof[i] = precipVector[i] / 1000 * areaRoofDriveway / deltaT;
        QinLot[i] = precipVector[i] / 1000 * parkingLotAreasqM / deltaT;
        QoutRoof[i] = Volume[i] / TstarRoof;
        if (QinLot[i] != 0) {
            QoutLot[i] = Volume[i] / TstarLot;
        } else {
            QoutLot[i] = 0;
        }
        Qout[i] = QoutRoof[i] + QoutLot[i];
        Volume[i + 1] = Volume[i] + (QinRoof[i] + QinLot[i] - Qout[i]) * deltaT;
        Vtotal = Vtotal + Volume[i];

    };

    Qmax = Math.max(...Qout);
    return [Vtotal, Qmax];
};
