function onsuccessPermission(){
	console.log("Success");
	
}

function onErrorPermission(e){
	console.log("error "+ JSON.stringify(e));
}

tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo", onsuccessPermission, onErrorPermission);


