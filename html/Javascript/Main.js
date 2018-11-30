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
        post.name = $("#addclassnum").val();
        post.title = $("#addclasstitle").val();
        post.desc = $("#addclassdesc").val();
        post.fid = parseInt(localStorage.getItem("id")); //this cast fixes the issue
        var onSuccess = function()
        {
            alert("Class added");
            console.log("Class added");
        };
        var onFailure = function()
        {
            console.log("Class create error");
            alert("Class create error");
            console.log(post);
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
    //REMOVE
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
    function createApplication()
    {
        //FID AND SID NEED TO BE EITHER A STRING IN DB, OR PROPERLY GET VAL IN JS
        var today = new Date();
        var application = {};
        application.date = today.getDate().toString()+"/"+(today.getMonth()+1).toString()+"/"+today.getFullYear().toString();
        application.sid = parseInt(localStorage.getItem("id"));
        application.semTaken = $("#semtaken").val();
        var selectedclass = $("#unfilledclasses option:selected");
        application.name = selectedclass.attr("coursenum");
        application.fid = parseInt(selectedclass.attr("fid"));
        var selectedgrade = $("#selectgrade option:selected");
        application.grade = selectedgrade.attr("value");;


        console.log(application);
        var onSuccess = function() {
            alert("Application recieved");
        };
        var onFailure = function() {
            alert("application failed");
        };
        makePostRequest("/api/newapply/",application,onSuccess,onFailure);
    }

    function insertclass(course, beginning) {
        classtemplate = $(".list-group-item")[0].outerHTML;

        // Start with the template, make a new DOM element using jQuery
        var newElem = $(classtemplate);
        // Populate the data in the new element
        newElem.text(course.name);

        if (beginning) {
            $(".class-group").prepend(newElem);
            console.log(newElem.innerHTML);
        } else {
            $(".class-group").append(newElem);
        }
    };

    function approveApplication()
    {
        var selectedApp = $("#applications option:selected");
        var classname = selectedApp.attr("classname");//classname
        var sid = selectedApp.attr("sid");
        var message = {};
        message.status = "Approved";

        var onFailure = function()
        {
            alert("Failed to approve selected TA");
            console.log(selectedApp);
            console.log(classname);
            console.log(sid);
        }
        var onSuccess = function()
        {
            alert("Selected TA approved");
        }

        makePostRequest("/api/apply/"+sid+"?className="+classname,message,onSuccess,onFailure);

    }

    //Flagging this, probably will be REMOVE.
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
        localStorage.setItem("id", account.id);
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
            LoadProfilePage(login.accType);
        }
        var onFailure = function()
        {
            alert("login creation failed" + login.pw + " " + login.login);
        }
        makePostRequest("/api/login/create",login,onSuccess,onFailure);
    }

    function LoadProfilePage(accType)
    {
        localStorage.setItem("acc_type",accType)
        if (accType == "S")
        {
            //STUDENT PROFILE PAGE GOES HERE
            window.location.assign("profilestudent.html");
        }
        else if (accType == "I")
        {
            //INSTRUCTRO PROFILE PAGE GOES HERE
            window.location.assign("profileinstructor.html");
        }
    }

    function createInstructor(){
        var account = {};
        var login = {};
        account.id = $("#idNumber").val();
        localStorage.setItem("id", account.id);
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
    //Save edited student info
    function EditStudent()
    {
        email = localStorage.getItem("usr");
                    //onsuc onfail events for the get req
                    var onSuccess = function(data)
                    {
                        var account = {};
                        account = data.student;
                        
                        account.fname = $("#editfirstname").val();
                        account.lname = $("#editlastname").val();
                        account.major = $("#editmajor").val();
                        account.gpa =  parseInt($("#editgpa").val());
                        saveAccount(account);
                    };
                    var onFailure = function()
                    {
                        console.log("Account not found");
                        alert("Account not found");
                    };
        makeGetRequest("/api/account/student?email=" + email, onSuccess, onFailure);

    }
    function EditInstructor()
    {
        email = localStorage.getItem("usr");
                    //onsuc onfail events for the get req
                    var onSuccess = function(data)
                    {
                        var account = {};
                        account = data.instructor;
                        
                        account.fname = $("#inseditfirstname").val();
                        account.lname = $("#inseditlastname").val();
                        account.phone = $("#inseditphone").val();
                        account.office = $("#inseditoffice").val();
                        saveAccount(account);
                    };
                    var onFailure = function()
                    {
                        console.log("Account not found");
                        alert("Account not found");
                    };
        makeGetRequest("/api/account/instructor?email=" + email, onSuccess, onFailure);
    }
    //save edited account info
    function saveAccount(account)
    {
        var type = localStorage.getItem("acc_type");
        var onSuccess = function()
        {
            alert("Account updated");
            console.log("Account updated");
            LoadProfilePage(type);
        };
        var onFailure = function()
        {
            console.log("Account save error");
        };
        if (type == "I")
        {
            makePostRequest("/api/editaccount/instructor/" + account.id,account,onSuccess,onFailure);
        } else
        {
            makePostRequest("/api/editaccount/student/" + account.id,account,onSuccess,onFailure);
        }  
    }

    function login()
    {
        
        var credentials ={};
        credentials.login = $("#inputEmail").val();
        credentials.pw = $("#inputPassword").val();
        console.log($("#inputEmail").val());
        var onSuccess = function(data)
        {
            // console.log("webpage logged in");
            localStorage.setItem("usr",credentials.login);
            if(data[0].login=="FAIL")
            {
                alert("Username/Password not found");
            }
            else
            {
                // alert("login");
                localStorage.setItem("usr",credentials.login);
                localStorage.setItem("acc_type",data[0].login);//get our account type and store for later
                //determine redirect here
                LoadProfilePage(data[0].login)
            }
        };
        var onFailure = function(data)
        {
            console.log("Unable to connect to server");
            alert("Unable to connect to server");
        };

        makePostRequest("/api/login/"+credentials.login,credentials,onSuccess,onFailure);
    }
    function start(){
        $('.getstudents').click(getStudents);
        $('.getclasses').click(getClasses);
        $('#createclass').click(function(event) {
            createClass();
            event.preventDefault();
            });
        $('.createstudent').click(createStudent);
        $('.createinstructor').click(createInstructor);
        $('#editstudent').click(function(event) {
            EditStudent();
            event.preventDefault();
            });
        $('#editinstructor').click(function(event) {
            EditInstructor();
            event.preventDefault();
            });
        $('#createapplication').click(function(event) {
            createApplication();
            event.preventDefault();
            });
        $('#approveta').click(function(event) {
            approveApplication();
            event.preventDefault();
            });
        $('.loginbutton').click(login);
    }
    return {
        start: start
    };
    
})();