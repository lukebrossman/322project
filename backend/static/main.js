//JS references from assignment
//high likelihood that these will work "as-is"

var apiUrl = 'http://localhost:5000/api/'; //backend running on localhost

//this onready call just ensures flask is properly serving the 
$(document).ready(function(){
    console.log("autoserved");
});
/** 
* @param  {string}   url       URL path, e.g. "/api/smiles"
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
        url: apiUrl+url,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: onSuccess,
        error: onFailure
    });
};

function test()
{
    alert("flask is serving the js");
}

//TODO a function to pool data into a {} to send/parse jsons

//grabs class info, calls make post req
//TODO implement into html with onclick OR have a click listener
//click listener is maybe more optimal but Im lazy af rn
//class isnt implemented in db yet so dont call this function, but its here.
function createClass()
{
    var post = {};
    post.className = $("#className").val();
    post.classNum = $("#classNum").val();
    post.classDisc = $("#classDisc").val();
    var onSuccess = function()
    {
        alert("Class added");
        console.log("Class added");
    };
    var onFailure = function()
    {
        console.log("Class create error");
        alert("Class create error");
    };
    makePostRequest(apiUrl+"/"+post.classNum,post,onSuccess,onFailure);   
}

//TODO implement into html with onclick OR have a click listener
function createAccount(type)
{
    var account = {};
    account.fname = $("#firstName").val();
    account.lname = $("#lastName").val();
    account.id = $("#idNumber").val();
    account.email = $("#email").val();

    //onsuc onfail events for the post req
    var onSuccess = function()
    {
        alert("Account "+ type + " added");
        console.log("Account "+ type + " added");
    };
    var onFailure = function()
    {
        console.log("Account create error");
        alert("Account create error");
    };

    //handle if our account is instructor or student since they have different fields
    //they also have different db routes and this dynamically handles that
    switch(type)
    {
        case type == "stud"://student account code block
            account.major = "TODO: need to implement in HTML";
            account.gpa =  "TODO: need to implement in HTML";
            account.gradDate = "TODO: need to implement in HTML";
            makePostRequest(apiUrl+"api/account/instructor",account,onSuccess,onFailure);
            break;
        case type == "ins"://instructor account code block
            account.phone = "TODO: need to implement field in html";
            account.office = "TODO: need to implement field in html";
            makePostRequest(apiUrl+"api/account/student",account,onSuccess,onFailure);
            break;
        default:
            alert("Err: No specified type");
            console.log("Err: No specified type for account");
    }   
}

function logintest()
{
    var credentials ={};
    document.getElementById("sub").addEventListener("click",function(event){event.preventDefault()});
    credentials.login = $("#inputEmail").val();
    credentials.pw = $("#inputPassword").val();
    login = $("#inputEmail").val();
    // console.log("sending login");
    console.log($("#inputEmail").val());
    var onSuccess = function(data)
    {
        console.log("webpage logged in");
        location.reload();//refresh the page to hit redirect
    };
    var onFailure = function(data)
    {
        console.log("FAILED login");
        console.log(data.login);
    };

    makePostRequest("login/"+login,credentials,onSuccess,onFailure);
}

