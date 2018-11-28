//JS references from assignment
//high likelihood that these will work "
var Main = (function(){
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

    function test()
    {
        alert("flask is serving the js");
    }

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
        var account = {};
        var login = {};
        account.id = $("#idNumber").val();
        account.fname = $("#firstName").val();
        account.lname = $("#lastName").val();
        account.email = $("#email").val();
        login.login = $("#email").val();
        account.major = $("#major").val();
        account.gpa =  $("#gpa").val();
        account.gradDate = $("#graddate").val();
        
        login.pw = $('#password').val();
        login.accType = "S";
        if (login.pw == $('#confirmpassword').val())
        {
            //onsuc onfail events for the post req
            var onSuccess = function()
            {
                alert("Student account" + " added: ");
                console.log("Student account" + " added: ");
                CreateNewLogin(login);
            };
            var onFailure = function()
            {
                console.log("Student account create error");
                alert("Student account create error");
            };

            makePostRequest("/api/account/student",account,onSuccess,onFailure);
        }
        else
        {
            alert("Passwords do not match");
        }
    }

    function CreateNewLogin(login)
    {
        var onSuccess = function()
        {
            localStorage.setItem("usr",login.login);
            alert("login created");
            console.log("Page Change");
            window.location.assign("profilepage.html");
        }
        var onFailure = function()
        {
            alert("login creation failed" + login.pw + " " + login.login);
        }
        makePostRequest("/api/login/create",login,onSuccess,onFailure);
    }

    function createInstructor(){
        var account = {};
        var login = {};
        account.id = $("#idNumber").val();
        account.fname = $("#firstName").val();
        account.lname = $("#lastName").val();
        account.email = $("#email").val();
        login.login = $("#email").val();
        account.phone = $('#phone').val();
        account.office = $('#office').val();
        
        login.pw = $('#password').val();
        login.accType = "I";
        if (login.pw == $('#confirmpassword').val())
        {
            //onsuc onfail events for the post req
            var onSuccess = function()
            {
                alert("Instructor account" + " added: ");
                console.log("Instructor account" + " added: ");
                CreateNewLogin(login)
            };
            var onFailure = function()
            {
                console.log("Instructor account create error");
                alert("Instructor account create error");
            };

            makePostRequest("/api/account/instructor",account,onSuccess,onFailure);
        }
        else
        {
            alert("Passwords do not match");
        }
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
    //Save edited student info
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

    function getInstructorForEdit()
    {
        id = parseInt($("#inseditID").val());
                    //onsuc onfail events for the get req
                    var onSuccess = function(data)
                    {
                        console.log(data.instructor);
                        document.getElementById("editins").style.display = "block";
                        $("#inseditidNumber").val("" + data.instructor.id);
                        $("#inseditfirstName").val(data.instructor.fname);
                        $("#inseditlastName").val("" + data.instructor.lname);
                        $("#inseditemail").val("" + data.instructor.email);
                        $("#inseditphone").val("" + data.instructor.phone);
                        $("#inseditoffice").val("" + data.instructor.office);
                    };
                    var onFailure = function()
                    {
                        console.log("Account not found");
                        alert("Account not found");
                    };
        makeGetRequest("/api/account/instructor/" + id, onSuccess, onFailure)
    }
    //save edited instructor info
    function saveInstructor()
    {
        var instructor = {};
        instructor.id = parseInt($("#inseditID").val());
        instructor.fname = $("#inseditfirstName").val();
        instructor.lname = $("#inseditlastName").val();
        instructor.email = $("#inseditemail").val();
        instructor.phone = $("#inseditphone").val();
        instructor.office =  ($("#inseditoffice").val());

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
            alert(instructor.fname);
        };

        makePostRequest("/api/editaccount/instructor/" + instructor.id,instructor,onSuccess,onFailure);
    }

    function login()
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
                    window.open("../../html/student_account.html", '_self');//redirect to a student page

                }
                else
                {   //TODO change to profile page of instructor and auto init to get data
                    window.open("../../html/instructor_account.html", '_self');//redirect to a instructor page
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

        makePostRequest("api/login/"+login,credentials,onSuccess,onFailure);
    }
    function start(){
        $('.getstudents').click(getStudents);
        $('.getclasses').click(getClasses);
        $('.createclass').click(createClass);
        $('.createstudent').click(createStudent);
        $('.createinstructor').click(createInstructor);
        $('.savestudent').click(saveStudent);
        $('.editstudent').click(getStudentForEdit);
    }
    return {
        start: start
    };
    
})();