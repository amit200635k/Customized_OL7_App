$(function(){

    if(sessionStorage.getItem('accessToken')){

    }
    else{
        location.replace('index.html');
    }


    $(document).on('click','#home', function(){
       // alert("Sfsdfsdfsd");
        $("#workArea").toggle().draggable();
    })
    $(document).on('click','.closeBtn', function(){
        //$(this).parentsUntil('.col-md-3').hide();
        $("#workArea").toggle();
    })
    
     
});


