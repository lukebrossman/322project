$(document).ready(function(){
    LoadInstructorProfilePage();
    LoadCoursesByLocalId();
});
var apiUrl = 'http://localhost:5000'; //backend running on localhost

    /** 
    * @param  {string}   url       URL path
    * @param  {function} onSuccess   callback method to execute upon request success (200 status)
    * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
    * @return {None}
    */
    var makeGetRequest = function(url, onSuccess, onFailure) {
    $.ajax({
        type: 'GET',
        url: apiUrl + url,
        dataType: "json",
        success: onSuccess,
        error: onFailure
    });
    };

    /**
     * HTTP POST request
     * @param  {string}   url       URL path, e.g. "/api/smiles"
     * @param  {Object}   data      JSON data to send in request body
     * @param  {function} onSuccess   callback method to execute upon request success (200 status)
     * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
     * @return {None}
     */
    var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };
    function LoadInstructorProfilePage()
    {
        email = localStorage.getItem("usr");
        var onSuccess = function(data){
            $('#uname').text(data.instructor.fname + " " + data.instructor.lname);
            localStorage.setItem("id",data.instructor.id);

        };
        var onFailure = function()
        {
            alert("account not found: " + email);
        };
        makeGetRequest("/api/account/instructor?email="+email, onSuccess, onFailure);
    }
    function LoadCoursesByLocalId()
    {
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function(data) {
            //dynamic length to prevent errors
            for(i = 0; i<data.Apps.length; i++)
            {
                console.log(data.Apps[i]);
                insertapp(data.Apps[i],true);
            }
            console.log(data.Apps.length);
            console.log("success get apps");
        };
        var onFailure = function() { 
            console.error('get apps FAILED'); 
        };
        makeGetRequest("/api/getProfApps?fid=" + localStorage.getItem("id"), onSuccess, onFailure);
    }

    function insertapp(app, beginning) {
        classtemplate = $("#class")[0].outerHTML;

        // Start with the template, make a new DOM element using jQuery
        var newElem = $(classtemplate);
        // Populate the data in the new element
        newElem.attr("value",app.name)//this technically could help later but doesnt matter
        newElem.attr("coursenum", app.name);
        newElem.attr("sid", app.sid);
        newElem.text(app.name + ":   SID: " + app.sid);
        if (beginning) {
            $(".applications").prepend(newElem);
            console.log(newElem.innerHTML);
        } else {
            $(".applications").append(newElem);
        }
    };