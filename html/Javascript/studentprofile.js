$(document).ready(function(){
    LoadStudentName();
    LoadUnfilledClasses();
    LoadStudentApplications();
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
    function LoadStudentName()
    {
        email = localStorage.getItem("usr");
        var onSuccess = function(data){
            // console.log(data.student.fname);
            $('#uname').text(data.student.fname + " " + data.student.lname);
            localStorage.setItem("id",data.student.id);
        };
        var onFailure = function()
        {
            alert("account not found: " + email);
        };
        makeGetRequest("/api/account/student?email="+email, onSuccess, onFailure);

    }

    function LoadStudentApplications()
    {
        id = localStorage.getItem("id");
        var onSuccess = function(data)
        {
            console.log("appinfo loaded: " + data.Apps.length)
            for(i = 0; i<data.Apps.length; i++)
            {
                console.log(data.Apps[i]);
                insertApp(data.Apps[i]);
            }   
        };
        var onFailure = function()
        {
            alert("applications not found: " + id);
        };
        makeGetRequest("/api/getStudentApps?sid="+ id, onSuccess, onFailure);   
    }
    function insertApp(app) {
        apptemplate = $(".appinfo")[0].outerHTML;

        // Start with the template, make a new DOM element using jQuery
        var newElem = $(apptemplate);
        // Populate the data in the new element
        newElem.text("Course Number: " + app.name + " | Status :" + app.status)
        $("#applist").prepend(newElem);
    };

    function LoadUnfilledClasses() {
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function(data) {
            //dynamic length to prevent errors
            for(i = 0; i<data.classes.length; i++)
            {
                console.log(data.classes[i]);
                insertclass(data.classes[i],true);
            }
            console.log(data.classes.length);
            console.log("success get unfilled courses");
        };
        var onFailure = function() { 
            console.error('get unfilled FAILED'); 
        };
        makeGetRequest("/api/unfilled" , onSuccess, onFailure);
    };


    function insertclass(course, beginning) {
        classtemplate = $("#classapply")[0].outerHTML;

        // Start with the template, make a new DOM element using jQuery
        var newElem = $(classtemplate);
        // Populate the data in the new element
        newElem.attr("coursenum", course.name);
        newElem.attr("fid", course.fid);
        console.log(course.fid);
        newElem.text(course.name + ": " + course.desc);
        if (beginning) {
            $(".unfilledclasses").prepend(newElem);
        } else {
            $(".unfilledclasses").append(newElem);
        }
    };