var fullTextArea = [];			//	The full text that the user has been writing gets pushed here

//	Functions below are for the text entry box in the HTML page, not part of the keylogger code
function textInput() {
	//Creates canvas on screen for P5.js animation

   	textArea = document.getElementById('myText');
   	var text = textArea.value;

   	//	This code below is for the font interface (Bold, italicized, underlined). Not working right now. 
  	//  Make sure html and php tags are unusable by disabling < and >.
		// text = text.replace(/\</gi, "<");
		// text = text.replace(/\>/gi, ">");
		
		// // Exchange newlines for <br />
		// text = text.replace(/\n/gi, "<br />");
		
		// Basic BBCodes.
		// text = text.replace(/\[b\]/gi, "<b>");
		// text = text.replace(/\[\/b\]/gi, "</b>");
		// text = text.replace(/\[i\]/gi, "<i>");
		// text = text.replace(/\[\/i\]/gi, "</i>");
		// text = text.replace(/\[u\]/gi, "<u>");
		// text = text.replace(/\[\/u\]/gi, "</u>");
			
   	document.getElementById('myText').value = '';	   	//	Resets the entry box.
   	fullTextArea.push(text);				//	Add text to the array
   	document.getElementById('textWritten').innerHTML = addText();
}

function addText () {					//	Add the user's current message to the rest of the text on the screen
	printThis = "";
	fullTextAreaLength = fullTextArea.length;
	for (var i=0; i<fullTextAreaLength; i++) {
			printThis += "<br>" + fullTextArea[i];	
	}
	// charLengthCount = charLength + charLengthCount;
	return printThis; // <-- to be printed to the div
	// return charLengthCount; 
}


//	Functions for some UI
function handleKeyPress(e){				//	Did the user hit enter / return?
	var key=e.keyCode || e.which;
  	if (key==13){
    	textInput();						//	If so, send the current message the user is typing
     	return false;
   }
}