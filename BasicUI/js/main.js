
window.onload = function () {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
	try {
	    tizen.application.getCurrentApplication().exit();
	} catch (ignore) {
	}
    });

    var textbox = document.querySelector('#textbox');
    textbox.addEventListener("click", sendMsg());
    		    		   
};

function sendMsg()
{
	var i=0;
		console.log('Imhere');

	 $.ajax({	 
	  		type: 'GET',
	  		dataType:'text',
	   		url: 'http://192.168.137.1:5555/test',
	   		data: {myData: "Msg  "},
	   		success: function(data){
	   			box = document.querySelector('#textbox');
	   			box.innerHTML = data;
	    		 }
	    		 }) 
	    		 i++;
}