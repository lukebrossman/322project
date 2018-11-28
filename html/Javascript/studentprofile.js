$(document).ready(function(){
    alert("ready");
    LoadStudentProfilePage();
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
    function LoadStudentProfilePage()
    {
        alert("BERRT");
        email = localStorage.getItem("usr");
        var onSuccess = function(data){
            // console.log(data.student.fname);
            $('#uname').text(data.student.fname + " " + data.student.lname);
        };
        var onFailure = function()
        {
            alert("account not found: " + email);
        };
        console.log("api/account/student?email=" + email);
        makeGetRequest("/api/account/student?email="+email, onSuccess, onFailure);

    }