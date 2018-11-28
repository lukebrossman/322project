//GARRETT'S JS THAT HES ADDING
//JS references from assignment
//high likelihood that these will work "as-is"

var apiUrl = 'http://localhost:5000/api/'; //backend running on localhost
var cur_user;

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
    // document.getElementById("sub").addEventListener("click",function(event){event.preventDefault()});
    credentials.login = $("#inputEmail").val();
    credentials.pw = $("#inputPassword").val();
    login = $("#inputEmail").val();
    // console.log("sending login");
    console.log($("#inputEmail").val());
    var onSuccess = function(data)
    {
        // console.log("webpage logged in");
        localStorage.setItem("usr",login);
        if(data[0].login=="FAIL")
        {
            alert("Username/Password not found");
        }
        else
        {
            // alert("login");
            localStorage.setItem("usr",login);
            localStorage.setItem("acc_type",data[0].login);//get our account type and store for later
            //determine redirect here
            if(data[0].login=="s")//
            {
                //TODO change to profile page of a student and auto init to get data
                window.open("profilepage.html", '_self');//redirect to a student page

            }
            else
            {   //TODO change to profile page of instructor and auto init to get data
                window.open("profilepage.html", '_self');//redirect to a ins page once we have separate pages

            }
            // window.open("class.html", '_self');
        }
    };
    var onFailure = function(data)
    {
        console.log("Unable to connect to server");
        alert("Unable to connect to server");

        // window.open("../../html/class.html", '_self');
        // window.open("class.html", '_self');
        console.log(data.login);
    };

    makePostRequest("login/"+login,credentials,onSuccess,onFailure);
}

//create a login to be called when account creation also happens
//pass account type per page as a static variable of s on student page, i on instructor
function createNewLogin(acc_type)
{
    var login = {};

    login.login = $("#email").val();
    login.pw = $("#password").val();
    login.accType = acc_type;

    var onSuccess = function()
    {
        alert("login created");
        localStorage.setItem("usr",login.email);//set user email while login
        localStorage.setItem("acc_type",login.type);//get our account type and store for later
        // LoadProfilePage();
    }
    var onFailure = function()
    {
        alert("login creation failed");
    }
    makePostRequest("login/create",login,onSuccess,onFailure);
}

function globtest()
{
    console.log(localStorage.getItem("usr"));
    console.log(localStorage.getItem("acc_type"));
}

//works to do a local redirect
function redirtest()
{
    window.open("../../html/class.html", '_self');
}

var getUnfilled = function() {
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

//reused
function insertclass(course, beginning) {
    classtemplate = $(".list-group-item")[0].outerHTML;

    // Start with the template, make a new DOM element using jQuery
    var newElem = $(classtemplate);
    // Populate the data in the new element
    newElem.text(course.name) 

    if (beginning) {
        $(".class-group").prepend(newElem);
        console.log(newElem.innerHTML);
    } else {
        $(".class-group").append(newElem);
    }
};

//approve based on a given student ID
function taApprove()
{
    var appStatus = {};
    appStatus.status="Approved"; //set json data var to approve

    //get our student id based on instructor input
    var sid = $("#studentId").val(); 

    var onSuccess = function(data) {
        console.log("app approving SUCCESS");

    };
    var onFailure = function() { 
        console.log("app approving FAILED");
    };
    
    makePostRequest("/api/apply/"+sid,appStatus,onSuccess,onFailure);
};

//deny based on a given student ID
/* a student can use this function to "delete" their application*/
function taDeny()
{
    var appStatus = {};
    appStatus.status="Deny"; //set json data var to approve

    //get our student id based on instructor input
    var sid = $("#studentId").val(); 

    var onSuccess = function(data) {
        console.log("app approving SUCCESS");

    };
    var onFailure = function() { 
        console.log("app approving FAILED");
    };
    
    makePostRequest("/api/apply/"+sid,appStatus,onSuccess,onFailure);
};

