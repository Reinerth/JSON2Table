'use strict'; /* Used traditional syntax and ES5, except "let". */

/** Here is the BEGINNING (the entry-point to the Application):
 * We reserve a namespace ("JSON2Table") for the Application, 
 * wherein we add on runtime our classes and the configurations of the application
 * and we load herein also the model-content, means e.g. JSON-files, database-tables ...
*/
window.JSON2Table = {
    "name"                      :"JSON2Table",
    "description"               :"This class is ment to generate a html-table from a given JSON-Object.",
    "version"                   :"1.0",
    "language"                  :"en",
    "myBIGJSONPrototype"        :"",
    "completeTableContentSorted":"",
    "makeAJAXRequest"  :function(callMeWhenReady, url, param1, param2, param3){

        let AJAXRequest = new XMLHttpRequest();
        let JSONcontent;
        let parameters = "";

        // In case that the request has parameters, we add them
        if (typeof param1 != 'undefined' && param1 != null && param1 != ""){
            parameters = parameters + "&param1=" + param1;
        }
        if (typeof param2 != 'undefined' && param2 != null && param2 != ""){
            parameters = parameters + "&param2=" + param2;
        }
        if (typeof param3 != 'undefined' && param3 != null && param3 != ""){
            parameters = parameters + "&param3=" + param3;
        }

        AJAXRequest.open("GET", url, true);
        AJAXRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        AJAXRequest.send(parameters);

        AJAXRequest.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) { // on success
                JSONcontent = JSON.parse(AJAXRequest.responseText);
                callMeWhenReady(JSONcontent);
            }
        };
    },
    "retrieveModel2":"",
    "retrieveModel3":""
};
