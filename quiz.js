function check() {
    //Each variable represents an answer to a question
    //Keep in order
    //need parseInt() for free response questions
    var totalArea = parseInt(document.quiz.totalArea.value, 10); //area of total property
    var totalImpervious = parseInt(document.quiz.totalImpervious.value, 10); // area land
    var areaPermanent = parseInt(document.quiz.areaPermanent.value, 10); // roof area
    var propType = document.quiz.propType.value;
    var altPavement = document.quiz.altPavement.value;
    var alteration = document.quiz.alteration.value;
    var slope = document.quiz.slope.value;
    var areaType = document.quiz.areaType.value;

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
    var I5year = 2.76; // rainfall intensity for 5 year event, assuming 30 min drainage time [in/hr]
    // based on property type, set property fee
    if (propType = "R") {
        propRate = 2;
    } else {
        propRate = 5;
    }

    stormFee = (totalArea / ERU) * propRate * 12; // YEARLY fee (note the x12)
    totalYearlyFees = inLieuFee + stormFee;

    stormRunoff = (Cimpermeable * totalImpervious + Cpermeable * perviousArea) * I5year / 720; // ft^3/min


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
        "RainBarrelsCisternsSubmit"]; //17

    var GSIoptionsBool = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    // // Series of NESTED if/else statements... if (condition) then change the GSIoptionsBool to 0 for all of the  incompatible options (element # correlates with GSIoptions)
    if (propType = "R") {

        //RESIDENTIAL -->rain gardens, dry wells, porous pavement, grass pavers, permeable unit pavers, vegetative swales, vegetative filter strip, constructed wetland, wet pond, rain barrels/cisterns
        GSIoptionsBool[1] = 0;
		GSIoptionsBool[6] = 0;
		GSIoptionsBool[7] = 0;
		GSIoptionsBool[8] = 0;	
		GSIoptionsBool[9] = 0;
		GSIoptionsBool[10] = 0;	
		GSIoptionsBool[13]= 0;
		GSIoptionsBool[14]= 0;
		

    }else if(propType = "C"){

		//COMMERCIAL -->tree boxes, dry wells, porous pavement, grass pavers, permeable unit pavers, infiltration chamber, surface detention, bioretention, infiltration basin, infiltration trench, vegetative swales, vegetative filter strip, green roof, underground detention, constructed wetland, wet pond, rain barrels/cisterns										
		GSIoptionsBool[0] = 0;

		if (slope = "Y"){
			//significant slope --> tree boxes, dry wells, porous pavement, permeable unit pavers, grass pavers, infiltration chamber, surface detention, green roof, underground retention, wet pond
			GSIoptionsBool[8] = 0;
			GSIoptionsBool[9] = 0;
			GSIoptionsBool[10] = 0;
			GSIoptionsBool[11] = 0;
			GSIoptionsBool[12] = 0;
			GSIoptionsBool[15] = 0;
			GSIoptionsBool[12] = 0;
		}

		if(alteration = "N" || totalImpervious < 6000){ //******* second condition refers to the question: Is your residential area on a small or large scale?  ******

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

		if(altPavement = "N"){
			//NOT Porous pavement, grass pavers, permeable unit pavers
			GSIoptionsBool[3] = 0;
			GSIoptionsBool[4] = 0;
			GSIoptionsBool[5] = 0;
		}

	}else if(propType = "I"){

		//INDUSTRIAL--> tree boxes, dry wells, porous pavement, infiltration chamber, surface detention, infiltration basin, infiltration trench, vegetative swales, vegetative filter strip, green roof, underground detention, constructed wetland, wet pond, rain barrels/cisterns				
		GSIoptionsBool[0] = 0;
		GSIoptionsBool[4] = 0;
		GSIoptionsBool[5] = 0;
		GSIoptionsBool[8] = 0;	
	} 

    // DISPLAY results
    //each element of this array coordinates with each option}

    // Hides all options to reset if they enter new values
    for (i = 0; i < GSIoptions.length - 1; i++) {
        document.getElementById(GSIoptions[i]).style.display = "none";
    }
    // if any questions are not filled out, generates prompt to answer all questions
    if (isNaN(totalArea) || isNaN(totalImpervious) || isNaN(areaPermanent)) {
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
