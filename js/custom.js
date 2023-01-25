$(function(){

    $(document).on('click','#home', function(){
       // alert("Sfsdfsdfsd");
        $("#workArea").toggle().draggable();
    })
    $(document).on('click','.btn-close', function(){
        //$(this).parentsUntil('.col-md-3').hide();
    })
    
     
});


