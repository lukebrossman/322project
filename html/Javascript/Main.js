//JS references from assignment
//high likelihood that these will work "
var Main = (function(){
    var apiUrl = 'http://localhost:5000'; //backend running on localhost
    var account = {};
    var accountType = '';

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

    function test()
    {
        alert("flask is serving the js");
    }

    function setType(newType){
        accountType = newType;
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
        post.classDisc = $("#classDesc").val();
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
        makePostRequest("/"+post.classNum,post,onSuccess,onFailure);   
    }

    //TODO implement into html with onclick OR have a click listener
    function createAccount()
    {
        account.fname = $("#firstName").val();
        account.lname = $("#lastName").val();
        account.id = $("#idNumber").val();
        account.email = $("#email").val();
        account.phone = $('#phoneNumber').val();
        window.location.assign("/student_account.html");

        //handle if our account is instructor or student since they have different fields
        //they also have different db routes and this dynamically handles that
        switch(accountType)
        {
            case type == "stud"://student account code block
                window.location.assign("/student_account.html");
                break;

            case type == "ins"://instructor account code block
                window.location.assign("/instructor_account.html");
                break;

            default:
                alert("Err: No specified type");
                console.log("Err: No specified type for account");
                break;
        } 
    }

    var getClasses = function() {
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function(data) {
            for(i = 0; i<data.classes.length; i++)
            {
                insertclass(data.classes[i], true);

            }
            console.log("success get classes");
        };
        var onFailure = function() { 
            console.error('get classes failed'); 
        };
        makeGetRequest("/api/classes" , onSuccess, onFailure);

    };

    var getStudents = function() {
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function(data) {
            //dynamic length to prevent errors
            for(i = 0; i<data.students.length; i++)
            {
                insertclass(data.student[i], true);
                console.log(data.student[i].fname);
            }
            console.log("success get student");
        };
        var onFailure = function() { 
            console.error('get students failed'); 
        };
        makeGetRequest("/api/account/allstudents" , onSuccess, onFailure);

    };


    function insertclass(course, beginning) {
        classtemplate = $(".list-group-item")[0].outerHTML;

    // Start with the template, make a new DOM element using jQuery
    var newElem = $(classtemplate);
    // Populate the data in the new element
    newElem.innerHTML = course.title 

    if (beginning) {
        $(".class-group").prepend(newElem);
        console.log("prepend");
    } else {
        $(".class-group").append(newElem);
    }
    };

    function insertstudent(student, beginning) {
    studenttemplate = $(".list-group-item")[0].outerHTML;

    // Start with the template, make a new DOM element using jQuery
    var newElem = $(studenttemplate);
    // Populate the data in the new element
    newElem.innerHTML = student.fname;

    if (beginning) {
        $(".student-group").prepend(newElem);
        console.log("prepend");
    } else {
            $(".student-group").append(newElem);
    }
    };

    function createStudent(){
        account.fname = $("#firstName").val();
        account.lname = $("#lastName").val();
        account.id = $("#idNumber").val();
        account.email = $("#email").val();
        account.phone = $('#phoneNumber').val();
        account.major = $("#major").val();
        account.gpa =  $("#gpa").val();
        account.gradDate = $("#graddate").val();
        
            //onsuc onfail events for the post req
            var onSuccess = function()
            {
                alert("Account" + " added: " + type);
                console.log("Account" + " added: " + type);
            };
            var onFailure = function()
            {
                console.log("Account create error");
                alert("Account create error");
            };

        makePostRequest("api/account/student",account,onSuccess,onFailure);

    }


    function createInstructor(){

        account.phone = "TODO: need to implement field in html";
        account.office = "TODO: need to implement field in html";
        
            //onsuc onfail events for the post req
            var onSuccess = function()
            {
                alert("Account" + " added: " + type);
                console.log("Account" + " added: " + type);
            };
            var onFailure = function()
            {
                console.log("Account create error");
                alert("Account create error");
            };

        makePostRequest("api/account/instructor",account,onSuccess,onFailure);

    }

    function start(){
        $('.getstudents').click(getStudents);
        $('.getclasses').click(getClasses);
        $('.createclass').click(createClass);
        $('.createstudent').click(createStudent);
    }
    return {
        start: start
    };
    
})();