//JS references from assignment
//high likelihood that these will work "
var Main = (function(){
    function start(){
        $('.register').click(createStudent);
    }
    return {
        start: start
    };
    
})();