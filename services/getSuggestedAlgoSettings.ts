export default function getSuggestedAlgoSettings(data:object,algoSettings:object):object{
    var newAlgoSettings:object = {...algoSettings};

        //set the suggested values
        var numPrecincts:number = Object.keys(data).length;
        newAlgoSettings["intervalConnecting"] = 300;
        if(numPrecincts < 300){
            newAlgoSettings["useSubiterations"] = true;
            newAlgoSettings["interval1"] = 50;
        }else {
            newAlgoSettings["useSubiterations"] = false;
            newAlgoSettings["interval1"] = Math.round(numPrecincts / 100) * 100; //ends up rounding to nearest hundred of ten times the number of precincts
        }
        newAlgoSettings["interval2"] = Math.round(numPrecincts / 100) * 50;
        newAlgoSettings["graphInterval1"] = 1;
        newAlgoSettings["graphInterval2"] = numPrecincts < 300 ?1:Math.round(numPrecincts / 100);
        newAlgoSettings["gridGranularity"] = 200;
        newAlgoSettings["maxConnectingIterations"] = 1000;
        newAlgoSettings["maxIterations1"] = 100;
        newAlgoSettings["maxIterations2"] = 2000;
        

        return (newAlgoSettings);
    
}