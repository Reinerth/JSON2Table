'use strict'; /* Used traditional syntax and ES5, except "let". */


/** displayTableOfJSON ********************************************************
 * Constructing a class "displayTableOfJSON" with private and public functions
 * wherein we could use (call) the public functions 
 * from other classes like "SecondClass",
 * even if they are not instantiated at that time,
 * because our container "JSON2Table" is global.
 * 
 * This class is ment to generate a html-table from a given JSON-Object.
 * 
 * KNOWN BUG:
 * There is a known issue with this script.
 * All properties in the JSON must have a unique name, 
 * or the properties with the same name,
 * must be in exactly the same nested order. 
 * 
 * If there are two or more properties with the same name,
 * and different nested order 
 * the script fails to place them to the right position.
 * 
*/

/* BUG-Details:
// This fails, due to the different nested depth of properties with same name
{
    "myProp1": {
        ,"samePropertyName": {
            "prop1": 1
        }
        ,"notWorking": {
            "samePropertyName": {
                "prop1": 1
            }
        }
    }
}
// This still works, due to the same nested depth
{
    "myProp1": {
        ,"workingOne": {
            ,"samePropertyName": {
                "prop1": 1
            }
        }
        ,"workingTwo": {
            "samePropertyName": {
                "prop1": 1
            }
        }
    }
}
*/

window.JSON2Table.displayTableOfJSON = function (){

    /**
     * PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE 
     * PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE 
     */

    // Common settings needed inside this class
    let internalSettings = {
        myURLTogetJSON: "./mvc/model/example-content.json",
        rowNumber: 1,
        columnNumber: 1,
        columnsAmount: 1,
        tableRowContent: "",
        completeTableContentSorted: []
    };


    // Retrieve DOM-elements needed inside this class
    let DOM = {
        root :document.body,
        someDivExample :document.getElementById("someDivExample")
    };

    /** 
     * 4
     * Generate a htm-table from 
     * the prepared JSON-content (window.JSON2Table.completeTableContentSorted)
     **/
    let createTable = function(){

        let myTable = document.createElement("table");

        let tableContent = window.JSON2Table.completeTableContentSorted;
        let tableContentLength = tableContent.length; // amount rows

        // Could look like following
        // "1|1|myDivision"
        // "2|2|divisionDescriptiona|A"
        // "3|2|movie"
        // "4|3|cinema"
        // "5|4|scifi"
        // "6|5|minority report|tom cruise,mary"
        // "7|5|matrix|keanu reeves,trinity"
        // "8|5|oblivion|com truise,foxy"
        // "9|5|blade runner|harrison ford"
        // "10|5|ghost in the shell|john"
        // "11|3|video"
        // "12|4|drama"
        // "13|5|forrest gump|hom tanks"
        // "14|2|divisionDescriptionb|B"
        // "15|1|myOtherDivision|..."

        let rememberValueForSameLineNextCol = "unset";

        for (let row=1; row<=tableContentLength; row++){

            let myTableRow = document.createElement("tr");
            myTable.appendChild(myTableRow); // attach a row for every entry in array "tableContent"

            let theWantedRow = parseInt(tableContent[row-1].split("|")[0]);
            let theWantedColumn = parseInt(tableContent[row-1].split("|")[1]);
            let theWantedPropertyName = tableContent[row-1].split("|")[2];
            let rowContentLength = tableContent[row-1].split("|").length;

            for (let column=1; column<=internalSettings.columnsAmount; column++){

                let myTableColumn = document.createElement("td");

                if (theWantedRow == row && theWantedColumn == column){
                    myTableColumn.innerText = theWantedPropertyName;
                }

                // a. In case the property has a value 
                // which must be written in the same line but next column ...
                if (rowContentLength > 3){

                    // b. ... we remember the value ...
                    rememberValueForSameLineNextCol = tableContent[row-1].split("|")[3];

                    if (theWantedRow == row && theWantedColumn+1 == column && rememberValueForSameLineNextCol != "unset"){
                        // c. ... and write it in the next td-round when we are in the next column...
                        myTableColumn.innerText = rememberValueForSameLineNextCol;
                        rememberValueForSameLineNextCol = "unset"; // ... finally we set the flag, back to "unset".
                    }
                }

                myTableRow.appendChild(myTableColumn);
            }
        }

        DOM.root.appendChild(myTable);
    };


    // Source code found here: 
    // https://stackoverflow.com/questions/39941691/how-to-get-the-json-path-from-element
    // Adaptation:
    // I would have preferred to comment that answer on stackoverflow, but I had not enough reputation.
    // In my case there was a small issue with my JSON-content.
    // Some values were the boolean "false", 
    // and some values were the number 0 (not as string),
    // and that always led to a script error. 
    // I was able to avoid the error by adapting the "if"-query,
    // by converting the first o[k] to a string. 
    // Like this: "if (k === key && o[k].toString() && o[k].type === value) {"
    let getPath = function (object, search) {

        function iter(o, p) {
            return Object.keys(o).some(function (k) {
                if (k === key && o[k].toString() && o[k].type === value) {
                    path = p.concat(k).join('.');
                    return true;
                }
                if (o[k] !== null && typeof o[k] === 'object') {
                    return iter(o[k],
                        k === 'properties' && !o.title ?
                            p :
                            p.concat(k === 'properties' && o.title ? o.title : k)
                    );
                }
            });
        }

        let parts = search.split(':'),
            key = parts[0],
            value = parts[1],
            path;

        iter(object, []);

        // IMPORTANT NOTE @Dev: 
        // the "path" would be the path to the object-property
        // separated by a dot e.g. // myProp1.myProp11.myProp111
        // return path; 
        let myColumn = path.split(".").length;
        return myColumn;
    };


    // Source code found here: 
    // https://stackoverflow.com/questions/13523951/how-to-check-the-depth-of-an-object
    let findOutHowManyColumnsTheTableNeeds = function(object) {

        let level = 1;

        for(let key in object) {

            if (!object.hasOwnProperty(key)) continue;

            if(typeof object[key] == 'object'){
                let depth = findOutHowManyColumnsTheTableNeeds(object[key]) + 1;
                level = Math.max(depth, level);
            }
        }
        return level;
    };


    /** 
     * 3
     * Get the right table row, column and value of the properties.
     **/
    function walkThrough(myBIGJSON) {

        let propNames = Object.getOwnPropertyNames(myBIGJSON);
        let props = Object.keys(myBIGJSON);

        for (let i=0; i<propNames.length; i++){

            let prop = myBIGJSON[propNames[i]];
            let flagArrBool = Array.isArray(prop);

            if (typeof prop == 'object' && prop !== null && flagArrBool != true) {

                // Here we have the situation, that we have a property which has a deeper Object in it as value
                internalSettings.tableRowContent = internalSettings.rowNumber + "|" + getPath(window.JSON2Table.myBIGJSONPrototype, props[i]) + "|" + props[i];
                internalSettings.completeTableContentSorted.push(internalSettings.tableRowContent);

                internalSettings.rowNumber++;

                walkThrough(prop); // RECURSIVE !

            } else {

                // Here we have the situation, that the property has a value which needs to be placed in the same line
                if (typeof props[i] != "undefined" && props[i] != null && props[i] != 0){

                    internalSettings.columnNumber = getPath(window.JSON2Table.myBIGJSONPrototype, props[i]);
                    internalSettings.tableRowContent = internalSettings.rowNumber + "|" + getPath(window.JSON2Table.myBIGJSONPrototype, props[i]) + "|" + props[i];

                    // Increase column-counter for the value of the property in the same line
                    internalSettings.columnNumber = parseInt(internalSettings.columnNumber) + 1;

                    internalSettings.tableRowContent = internalSettings.tableRowContent + "|" + prop;
                    internalSettings.completeTableContentSorted.push(internalSettings.tableRowContent);

                    internalSettings.rowNumber++;
                }
            }
        }
    };


    /** 
     * 2 
     * We need to find out how many columns the table will need,
     * then we walkThrough the JSON to get all the wanted content, 
     * means the property-names, their values 
     * and find out where they have to be positioned in the table. 
     * 
     * Then we prepare a list (completeTableContentSorted) where 
     * we remember the collected informations.
     * 
     * An entry could look like: "10|5|title|ghost in the shell"
     * To be read like: row 10, column 5, property-name "title" and value "ghost in the shell"
     **/
    let getTablePositions = function(myBIGJSON){

        internalSettings.columnsAmount = findOutHowManyColumnsTheTableNeeds(myBIGJSON);

        walkThrough(myBIGJSON);

        // We want to remeber the prepared content for the table, we could need it later on
        window.JSON2Table.completeTableContentSorted = internalSettings.completeTableContentSorted;

        console.log( "completeTableContentSorted" );
        console.log( window.JSON2Table.completeTableContentSorted );

        createTable(); // htm-table
    };


    /** 
     * 1 
     * get the JSON-content (the model)
     **/
    let makeRequestToGetJSON = function () {

        /**
         * Make a request to retrieve the JSON
         **/
        window.JSON2Table.makeAJAXRequest(function(myBIGJSON) {

            // On callback ready, we can handle the response ...

            // We want to remeber the response, we could need it later on
            window.JSON2Table.myBIGJSONPrototype = myBIGJSON;

            // Retrieving the JSON was successfull, so we continue with it
            getTablePositions(myBIGJSON);

        }, internalSettings.myURLTogetJSON);
    };


    // Setup events
    let handleEvents = function(){
        // 
    };


    /**
     * PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC
     * PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC
    */
    /** 
     * 0 entrypoint
     **/
    this.init = function(){
        handleEvents();
        makeRequestToGetJSON();
    };
};
