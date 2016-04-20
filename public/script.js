$(document).ready(function() {
    $(".btn").click(function(event){
    	var numImages=0;
    	var numCaptions=0;
    	var images = $("[name='images']").serializeArray();
    	var captions = $("[name='captions']").serializeArray();
    	var imagesLength = images.length;
    	var captionsLength = captions.length;
    	for(var i = 0; i < imagesLength; i++) {
    		if(images[i].value){
    			numImages++;
    		}
    	}
    	for(var i = 0; i < captionsLength; i++){
    		if(captions[i].value){
    			numCaptions++;
    		}
    	}
    	if(numImages != numCaptions){
    		event.preventDefault();
    		alert("Number of captions doesn't match number of images!");
    	}
    }); 
});