$(function(){

    if(sessionStorage.getItem('accessToken')){

    }
    else{
        location.replace('index.html');
    }
    // let mesrDiv = '<div id="measureLnkAccordion" class="accordion-item" style="display:noneX"><h2 class="accordion-header" id="measure1"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#measure1a" aria-expanded="false" aria-controls="measure1a"><i class="far fa-drafting-compass"></i> Measure</button></h2><div id="measure1a" class="accordion-collapse collapse" aria-labelledby="measure1" data-bs-parent="#accordionExample"><div class="accordion-body"><form><label for="type">Measurement type  </label><select id="type" class="form-control form-select"><option value="LineString">Length (LineString)</option><option value="Polygon">Area (Polygon)</option></select><div class="form-check">    <input class="form-check-input" type="checkbox" checked id="segments">    <label class="form-check-label" for="segments">    Show segment lengths:    </label>  </div><div class="form-check">    <input class="form-check-input" type="checkbox" checked id="clear">    <label class="form-check-label" for="clear">    Clear previous measure:     </label>  </div> <div class="btn btn-sm btn-info" id="startMeasrBtn" >Start</div>  </form></div></div></div>';
    // $("#accordionExample").append(mesrDiv);

    $(document).on('click','#home', function(){
        //alert("Sfsdfsdfsd");
        $("#mainDiv > #mapParentDiv").removeClass("col-md-9").addClass("col-md-12");
        $("#workArea").toggle().draggable();
    })
    $(document).on('click','.closeBtn', function(){
        //$(this).parentsUntil('.col-md-3').hide();
        $("#workArea").toggle();
    })
    $(document).on('click','#toggleSwipe', function(){
        // alert("Sfsdfsdfsd");
         $("#swipe").toggle();
     })
     $(document).on('click','#toggleAttrData', function(){
        // alert("Sfsdfsdfsd");
         $("#attrData").toggle();
     }) 

     $(document).on('click','#measureLnk', function(){
        // alert("measureLnk");
         $("#measureLnkAccordion").toggle();
          
     })

});


