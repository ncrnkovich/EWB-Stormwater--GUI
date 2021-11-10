function check() { // function called when Get Results! button fired
    //Each variable represents an answer to a question
    //Keep in order
    //need parseInt() for free response questions
    var totalArea = parseFloat(document.quiz.totalArea.value.replaceAll(',', '')).toFixed(2); //area of total property
    var totalImpervious = parseFloat(document.quiz.totalImpervious.value.replaceAll(',', '')).toFixed(2); // area land
    var areaPermanent = parseFloat(document.quiz.areaPermanent.value.replaceAll(',', '')).toFixed(2); // roof area
    var propType = document.quiz.propType.value;
    var downspoutDisconnect = document.quiz.downspoutDisconnect.value;
    var discountValue = document.quiz.discount.value;
    
    var i;
    var resultsID = document.getElementById("resultsID");


    // Calculations/math
    // ASSUMED PARAMTERS
    var inLieuFeeRate = 0.61; // Supplied value of $0.61 / sq ft of impervious land for in-lieu-of disconnect fee
    var ERU = 2700; // 2700 sq ft in one Equivalent Residental Unit
    // var baseFeeRate = 2.00; // $2 /month base rate  

    // Fee calculations
    var inLieuFee; // one time in-lieu-of disconnect fee
    var stormwaterFee;
    var stormwaterFeeYr;
    var totalYearlyFees;
    var discount;
    var finalFee = 0; // final monthly fee amount in 2025


    // based on property type, set property fee

    if (propType == "R") {
        finalFee = 2.50;
    } else {
        if (totalImpervious < 5001) {
            finalFee = 8.00;
        } else if (totalImpervious < 40001) {
            finalFee = 14.00;
        } else if (totalImpervious < 100001) {
            finalFee = 22.00;
        } else if (totalImpervious < 200001) {
            finalFee = 34.00;
        } else {
            finalFee = 65.00;
        }
    }
    console.log(finalFee, stormwaterFeeYr)
    stormwaterFeeYr = finalFee * 12;

    if (downspoutDisconnect == "Y" || propType == "R") {
        inLieuFee = 0; // if their downspout is disconnected, no in-lieu-of fee
    } else {
        inLieuFee = totalImpervious * inLieuFeeRate;
        if (discountValue == "501c3free") {
            discount = 0; // 501(c)(3) with <20 employees 100% discount
        } else if (discountValue == "501c350%" || discountValue == "forprofit50%") {
            discount = 0.5; // 501(c)(3) with 20 < employees < 100 50% discount, for profit <20, 50% discount
        } else {
            discount = 1.0;
        }
        inLieuFee = inLieuFee * discount;
    }


    // Stormwater calculator
    var runoff = runoffCalc(propType, totalImpervious, areaPermanent);
    var totalRunoff = runoff[0];
    var maxRunoff = runoff[1];

    totalRunoff = Math.round(totalRunoff * 35.315); // [m^3 to ft^3]
    maxRunoff = Math.round(maxRunoff * 35.315); // [m^3/s to ft^3/s]

    // OPTION CALCULATOR
    //this is only for the results tab
    var resultsSummary = document.getElementById("resultsID");
    var resultsID = document.getElementById("resultsID");

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

    // // Series of NESTED if/else statements... if (condition) then change the GSIoptionsBool to 1 for all of the  compatible options (element # correlates with GSIoptions)
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

        for (i = 0; i < GSIoptionsBool.length; i++) {
            GSIoptionsBool[i] = 1;
        }
    } else if (propType == "I") {
        // Industrial: everything except green pavers, permable unit pavers, rain gardens
        GSIoptionsBool[0] = 1;
        GSIoptionsBool[1] = 1;
        GSIoptionsBool[2] = 1;
        GSIoptionsBool[3] = 1;
        GSIoptionsBool[4] = 1;
        GSIoptionsBool[5] = 1;
        GSIoptionsBool[6] = 1;
        document.getElementById("GrassPavers").style.display = "none";
        document.getElementById("UnitPavers").style.display = "none";
        document.getElementById("RainGarden").style.display = "none";
    }


    // Hides all options to reset if they enter new values
    resultsSummary.style.display = "none";
    for (i = 0; i < GSIoptions.length; i++) {
        document.getElementById(GSIoptions[i]).style.display = "none";
    }

    // if any questions are not filled out, generates prompt to answer all questions
    if (isNaN(totalArea) || isNaN(totalImpervious) || isNaN(areaPermanent)) {
        document.getElementById("alert").style.display = "block";
    } else {
        document.getElementById("alert").style.display = "none";
        resultsSummary.style.display = "block";
        for (i = 0; i < GSIoptions.length; i++) {
            if (GSIoptionsBool[i]) {
                document.getElementById(GSIoptions[i]).style.display = "block";
            }
        }
    }
    //Set about tab to be active by default
    var AboutTab = document.getElementsByClassName("AboutTab");
    var MoreInfoTab = document.getElementsByClassName("MoreInfoTab");
    for (i = 0; i < AboutTab.length; i++) {
        if (MoreInfoTab[i].className !== "MoreInfoTab active" && AboutTab[i].className !== "AboutTab active") {
            AboutTab[i].className = AboutTab[i].className + " active";

        }

        // MoreInfoTab[i].className = MoreInfoTab[i].className.replace(" active", "");
    }

    // prints out needed results in the results tab
    document.getElementById("totalAreaResult").innerHTML = totalArea;
    document.getElementById("totalImperviousAreaResult").innerHTML = totalImpervious;
    document.getElementById("stormwaterFeeYr").innerHTML = stormwaterFeeYr;
    document.getElementById("inLieuFee").innerHTML = inLieuFee;
    document.getElementById("totalRunoff").innerHTML = totalRunoff;


};

function changeview(clickedIndex, tabName, optionsOrder) {
    // Get the class vectors for each tab content
    var AboutText = document.getElementsByClassName("AboutText");
    var CostInfoText = document.getElementsByClassName("CostInfoText");
    // Get class vectors for each tab type
    var AboutTab = document.getElementsByClassName("AboutTab");
    var MoreInfoTab = document.getElementsByClassName("MoreInfoTab");
    var varitationsHeader = document.getElementsByClassName("variationsHeader");

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

    // make it possible for variations to show up
    var variations = document.getElementsByClassName("variations");
    for (i = 0; i < variations.length; i++) {
        variations[i].style.display = "block";
    }


    // This resets any active tab to being inactive so the active class doesn't accumulate
    AboutTab[clickedIndex].className = AboutTab[clickedIndex].className.replace(" active", "");
    MoreInfoTab[clickedIndex].className = MoreInfoTab[clickedIndex].className.replace(" active", "");

    // Change the display of each tab for the selected div to none
    CostInfoText[clickedIndex].style.display = "none";
    AboutText[clickedIndex].style.display = "none";

    document.getElementsByClassName("Variations").removeChild;

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
    if (tabName == "MoreInfoTab" || tabName == "MoreInfoTab active") {
        CostInfoText[clickedIndex].style.display = "block";
        MoreInfoTab[clickedIndex].className = MoreInfoTab[clickedIndex].className + " active"; //Make button active
        AboutTab[clickedIndex].className = AboutTab[clickedIndex].className.replace(" active", "");

        switch (selectedOption) {
            case "VegetativeInfiltrationID":
                for (i = 0; i < VegInfilt.length; i++) {
                    VegInfilt[i].style.display = "block";
                };
                varitationsHeader[0].style.display = "block";
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
                varitationsHeader[2].style.display = "block";
                break;
            case "NonvegetativeInfiltrationID":
                for (i = 0; i < NonvegInfilt.length; i++) {
                    NonvegInfilt[i].style.display = "block";
                };
                varitationsHeader[3].style.display = "block";
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
                    InfiltChamber[i].style.display = "block";
                }
                break;
                // add case for IDs of all offered options
        };

    } else {
        varitationsHeader[clickedIndex].style.display = "none";
        AboutText[clickedIndex].style.display = "block";
        AboutTab[clickedIndex].className = AboutTab[clickedIndex].className + " active";
        MoreInfoTab[clickedIndex].className = MoreInfoTab[clickedIndex].className.replace(" active", "");

    }

};

function openPopup() {
    var popup = document.getElementById("imperviousPopup");
    popup.classList.toggle("show");
}

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
    var Ptotal = 4.9 * 25.4; // [mm] from NOAA, precipitation total for 25 year, 24 hour storm
    // I want to change this model to reflect CSO's, but can't until EmNet gets back to us
    var precipPattern = [0, 2, 5, 10, 15, 15, 10, 6, 5, 5, 5, 8, 12, 18, 22, 45, 60, 32, 33, 24, 22, 10, 15, 17, 18, 19, 22, 38, 50, 45, 45, 40, 42, 12, 5, 0, 2, 5, 10, 15, 15, 10, 6, 5, 5, 5, 8, 12, 18, 22, 45, 60, 32, 33, 24, 22, 10, 15, 17, 18, 19, 22, 38, 50, 45, 45, 40, 42, 12, 5, 0, 2, 5, 10, 15, 15, 10, 6, 5, 5, 5, 8, 12, 18, 22, 45, 60, 32, 33, 24, 22, 10, 15, 17, 18, 19, 22, 38, 50, 45, 45, 40, 42, 12, 5, 0, 2, 5, 10, 15, 15, 10, 6, 5, 5, 5, 8, 12, 18, 22, 45, 60, 32, 33, 24, 22, 10, 15, 17, 18, 19, 22, 38, 50, 45, 45, 40, 42, 12, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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