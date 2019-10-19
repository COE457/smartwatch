var boolean NoMsg=true;
function remove(id){
	var lastChar = id[id.length -1];
	var temp= document.getElementById('message-view');

	document.getElementById('msgSender'+lastChar).remove();
	document.getElementById('msg'+lastChar).remove();
	if (temp.childElementCount===0) {
		alert("No new messages");
		var eldiv = document.createElement('div');
		var elspan=document.createElement('span');
		elspan.classList.add('noMsgs');
		elspan.innerHTML = "No messages";
		eldiv.appendChild(elspan);
		temp.appendChild(eldiv);
	}
}

/** 
 * @function genMsg
 * @desciption generates the message to be previewed
 * @param messageBody: object
 * 
 */
function receiveMsg(messageBody){
	switch(messageBody){
	case"foodIsRead":
	break;
	case"goToSleep":
	break;
	case"wakeUp":
		break;
	case"comeHere":
		break;
	}
	
}






