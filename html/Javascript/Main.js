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

    //Doesn't yet do anything
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
        post.name = $("#className").val();
        post.title = $("#classNum").val();
        post.desc = $("#classDesc").val();
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
        makePostRequest("/api/newclass",post,onSuccess,onFailure);   
    }

    //TODO implement into html with onclick OR have a click listener
    function createAccount()
    {
        account.fname = $("#firstName").val();
        account.lname = $("#lastName").val();
        account.id = $("#idNumber").val();
        account.email = $("#email").val();
        account.phone = $('#phoneNumber').val();

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
                console.log(data.classes[i]);
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
                insertstudent(data.students[i], true);
                console.log(data.students[i]);
            }
            console.log(data.students.length);
            console.log("success get student");
        };
        var onFailure = function() { 
            console.error('get students failed'); 
        };
        makeGetRequest("/api/account/allstudents" , onSuccess, onFailure);

    };

    //function to get unfilled classes which need TA's
    //calls api route which filters based on filled/available pos's
    //uses insert class to show the data but may modify later on if necessary
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

    function insertstudent(student, beginning) {
        studenttemplate = $(".student-group .list-group-item")[0].outerHTML;

        // Start with the template, make a new DOM element using jQuery
        var newElem = $(studenttemplate);
        // Populate the data in the new element
        newElem.text(student.fname);

        if (beginning) {
            $(".student-group").prepend(newElem);
            console.log(newElem.innerHTML);
        } else {
                $(".student-group").append(newElem);
        }
    };

    function createStudent(){
        account.id = $("#idNumber").val();
        account.fname = $("#firstName").val();
        account.lname = $("#lastName").val();
        account.email = $("#email").val();
        account.major = $("#major").val();
        account.gpa =  $("#gpa").val();
        account.gradDate = $("#graddate").val();
        
            //onsuc onfail events for the post req
            var onSuccess = function()
            {
                alert("Account" + " added: ");
                console.log("Account" + " added: ");
            };
            var onFailure = function()
            {
                console.log("Account create error");
                alert("Account create error");
            };

        makePostRequest("/api/account/student",account,onSuccess,onFailure);

    }


    function createInstructor(){

        account.phone = "TODO: need to implement field in html";
        account.office = "TODO: need to implement field in html";
        
            //onsuc onfail events for the post req
            var onSuccess = function()
            {
                alert("Account" + " added: ");
                console.log("Account" + " added: ");
            };
            var onFailure = function()
            {
                console.log("Account create error");
                alert("Account create error");
            };

        makePostRequest("/api/account/instructor",account,onSuccess,onFailure);

    }
    function getStudentForEdit()
    {
        id = parseInt($("#editID").val());
                    //onsuc onfail events for the get req
                    var onSuccess = function(data)
                    {
                        console.log(data.student);
                        document.getElementById("edit").style.display = "block";
                        $("#editidNumber").val("" + data.student.id);
                        $("#editfirstName").val(data.student.fname);
                        $("#editlastName").val("" + data.student.lname);
                        $("#editemail").val("" + data.student.email);
                        $("#editmajor").val("" + data.student.major);
                        $("#editgpa").val("" + data.student.gpa);
                        $("#editgraddate").val("" + data.student.gradDate);
                    };
                    var onFailure = function()
                    {
                        console.log("Account not found");
                        alert("Account not found");
                    };
        makeGetRequest("/api/account/student/" + id, onSuccess, onFailure)
    }
    function saveStudent()
    {
        var student = {};
        student.id = parseInt($("#editID").val());
        student.fname = $("#editfirstName").val();
        student.lname = $("#editlastName").val();
        student.email = $("#editemail").val();
        student.major = $("#editmajor").val();
        student.gpa =  parseInt($("#editgpa").val());
        student.gradDate = $("#editgraddate").val();

        var onSuccess = function()
        {
            alert("Account" + " saved");
            console.log("Account" + " saved");
            console.log(student);
        };
        var onFailure = function()
        {
            console.log(student);
            console.log("Account save error");
            alert(student.fname);
        };

        makePostRequest("/api/editaccount/student/" + student.id,student,onSuccess,onFailure);

    }

    function start(){
        $('.getstudents').click(getStudents);
        $('.getclasses').click(getClasses);
        $('.createclass').click(createClass);
        $('.createstudent').click(createStudent);
        $('.savestudent').click(saveStudent);
        $('.editstudent').click(getStudentForEdit);
        document.getElementById("edit").style.display = "none";
    }
    return {
        start: start
    };
    
})();