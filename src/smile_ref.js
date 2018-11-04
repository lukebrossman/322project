
var Smile = (function() {

    // PRIVATE VARIABLES
        
    // The backend we'll use for Part 2. For Part 3, you'll replace this 
    // with your backend.
    //THIS IS THE BACKEND THAT WORK
    //var apiUrl = 'https://smile451.herokuapp.com';  //Ruby on Rails backend
    apiUrl = 'https://rudisill-warmup.herokuapp.com'
     //apiUrl = 'https://arslanay-warmup.herokuapp.com';    //Flask-Python backend
    //var apiUrl = 'http://localhost:5000'; //backend running on localhost

    // FINISH ME (Task 4): You can use the default smile space, but this means
    //            that your new smiles will be merged with everybody else's
    //            which can get confusing. Change this to a name that 
    //            is unlikely to be used by others. 
    
    // var smileSpace = 'initial'; // The smile space to use. 
    var smileSpace = 'myspace';

    var smiles; // smiles container, value set in the "start" method below
    var smileTemplateHtml; // a template for creating smiles. Read from index.html
                           // in the "start" method
    var create; // create form, value set in the "start" method below


    // PRIVATE METHODS
      
   /**
    * HTTP GET request 
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
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };
        
//this is to make the like request since the null data value threw errors
//I got tired of debugging so i made this function out of laziness
    var makeLikeRequest = function(url, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            success: onSuccess,
            error: onFailure
        });
    };

    /* This function seems to work as intended and not need any further edits? Was able to add a post from main start option 
        Need to add the time handler to the post insertion*/



    /**
     * Insert smile into smiles container in UI
     * @param  {Object}  smile       smile JSON
     * @param  {boolean} beginning   if true, insert smile at the beginning of the list of smiles
     * @return {None}
     */
    var insertSmile = function(smile, beginning) {
        // Start with the template, make a new DOM element using jQuery
        var newElem = $(smileTemplateHtml);
        //console.log(newElem);
        // Populate the data in the new element
        // Set the "id" attribute 
        newElem.attr('id', smile.id); 
        // Now fill in the data that we retrieved from the server
        newElem.find('.title').text(smile.title);
        newElem.find('.story').text(smile.story);

        //default from template post is happiness level 1, the added class overrides
        //want to find a way to fix the redundancy but im not there yet
        newElem.find('.happiness-level-1').addClass("happiness-level-"+smile.happiness_level);
        
        
        try {

            var initDate = new Date(smile.created_at);//create date with epoch time
            var updatedDate = new Date(smile.updated_at);//create date with epoch time
            var date;
            if(initDate>updatedDate)
            {
                date = initDate;
            }
            else
            {
                date = updatedDate;
            }

            
            if(date == "Invalid Date")//if invalid, use post plaintext
            {
                throw error;
            }
            //else adding time and formating
            var timestamp = date.getHours().toString()+"\:";
            timestamp+= date.getMinutes().toString();

            //to convert utc month # to string
            const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ];
            timestamp+= " "+monthNames[date.getMonth()];
            
            timestamp+= " "+date.getDate().toString()+",";
            timestamp+= " "+date.getFullYear().toString();

            if(date == initDate)
            {
                newElem.find('.timestamp').text("Posted at "+timestamp);
            }
            else
            {
                newElem.find('.timestamp').text("Updated at "+timestamp);
            }
        } catch (error) {
            console.log("invalid time format, using old");
            newElem.find('.timestamp').text(smile.created_at);
        }

        newElem.find('.count').text(smile.like_count);
        //newElem.find('.happiness-level').text(smile.happiness-level);
        //TODO: ADD HAPPINESS LEVEL INFO
        //TODO: ADD TIME HANDLER TO FUNCTION
        // FINISH ME (Task 2): fill-in the rest of the data
        if (beginning) {
            smiles.prepend(newElem);
        } else {
            smiles.append(newElem);
        }
    };


     /**
     * Get recent smiles from API and display 10 most recent smiles
     * @return {None}
     */
    var displaySmiles = function() {
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function(data) {
            /* FINISH ME (Task 2): display smiles with most recent smiles at the beginning */
            console.log("it works my dude");


            //data.smiles is our return information
            //for loop that autoinserts posts 
            //false for append post, true for prepend
            for(i = 0; i<data.smiles.length; i++){
                insertSmile(data.smiles[i],false);
            }
            
            console.log(data);
        };
        var onFailure = function() { 
            console.error('display smiles failed'); 
        };
        var req_url = "/api/smiles?space="+smileSpace+"&count=10&order_by=created_at";
        makeGetRequest(req_url,onSuccess,onFailure);

        //request works and rets status 1, but no data?
    };

    

    clk_like = function(id) {
        console.log(id);
        var liked_post = $(id)[0];
        attachLikeHandler(liked_post);

    }


    /**
     * Add event handlers for clicking like.
     * @return {None}
     */

    var attachLikeHandler = function(e) {
        // Attach this handler to the 'click' action for elements with class 'like'

        //e.target gets current element
        //jquery get parent by class or get parent by element
        //postman

        smiles.on('click', '.like', function(e) {
            // FINISH ME (Task 3): get the id of the smile clicked on to use in the POST request
            var smileId = '123'; 
            // Prepare the AJAX handlers for success and failure
            var onSuccess = function() {
                /* FINISH ME (Task 3): update the like count in the UI */ 
                document.getElementById(val).querySelector('.count').textContent++;
        
            };
            var onFailure = function() { 
                console.error('like smile error'); 
                
            };
            // console.log(e);
            //console.log($(e.target).parents('article').attr('id'));
            var val = $(e.target).parents('article').attr('id')
            
            //to make like request since no data coming in
            makeLikeRequest("/api/smiles/"+val+"/like",onSuccess,onFailure);

        });
    };




    /**
     * Add event handlers for submitting the create form.
     * @return {None}
     */
    var attachCreateHandler = function(e) {
        // First, hide the form, initially 
        create.find('form').hide();

        create.on('click', '.share-smile',function(e)
        {
            e.preventDefault();
            create.find('form').show();
            create.find('.share-smile').hide();
            smiles.hide();
        });


        create.on('click', '.cancel',function(e)
        {
            e.preventDefault();
            create.find('form').hide();
            create.find('.share-smile').show();
            smiles.show();
        });



        // The handler for the Post button in the form
        create.on('click', '.submit-form', function (e) {
            e.preventDefault (); // Tell the browser to skip its default click action
            
            var smile = {}; // Prepare the smile object to send to the server
            smile.title = create.find('.title-input').val();
            smile.story = create.find('.story-input').val();
            smile.happiness_level = create.find('.happiness-level-input').val();
            smile.like_count=0;
            smile.space=smileSpace;
            console.log(smile);

            function validateForm()
            {
                var title = create.find('.title-input').val();
                var story = create.find('.story-input').val();
                var happy = create.find('.happiness-level-input').val();

                if(title.length<0 || title.length>64)
                {
                    alert("Title length error");
                    return false;
                }

                if(story.length==0 ||story.length >2048)
                {
                    alert("Story length error");
                    return false;
                }

                if(happy <1 || happy >4)
                {
                    alert("You need some anti-depressants dude");

                    return false;
                }

                
            }

            validateForm();

            // FINISH ME (Task 4): collect the rest of the data for the smile
            var onSuccess = function(data) {
                // FINISH ME (Task 4): insert smile at the beginning of the smiles container
                console.log(data);
                insertSmile(data.smile,true);
                create.find('form').hide();
                create.find('.share-smile').show();
                smiles.show();
                create.find('form').reset();

            };
            var onFailure = function() { 
                console.error('create smile failed'); 

            };
            makePostRequest("/api/smiles",smile,onSuccess,onFailure);
           
        });

    };

    var click_id = function()
    {
        var log = $('#log');
        $('like').click(function(event) {
            console.log(event.target);
        });
    }
    
    /**
     * Start the app by displaying the most recent smiles and attaching event handlers.
     * @return {None}
     */
    var start = function() {
        smiles = $(".smiles");
        create = $(".create");

        // Grab the first smile, to use as a template
        smileTemplateHtml = $(".smiles .smile")[0].outerHTML;
        // Delete everything from .smiles
        smiles.html('');

        displaySmiles();
        attachLikeHandler();
        attachCreateHandler();
    };
    

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Smile.key_name, e.g. Smile.start()
    return {
        start: start
    };
    
})();
