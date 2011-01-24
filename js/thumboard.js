 /*
 * thumboard virtual keyboard - v0.2.1
 * Copywright 2011, Rich Wright
 *   
 */
var thumboard = {};

thumboard.words = [];    // List of most used words
thumboard.inputs = [];   // Array of monitored input elements
thumboard.target = null; // Monitored input element with focus

thumboard.qwerty = ['1234567890','qwertyuiop','asdfghjkl ','zxcvbnm   '];
thumboard.ctlDspl = ['&larr;','&rarr;','B','H','E','T',' ',' ',' ',' '];
thumboard.ctlAbbr = ['left','right','back','home','end','tab',' ',' ',' ',' '];

// Initialize the virtual keyboard display
// (Uses abbr attribute to identify key types. This value used in switch
//  in keyClick function.)
// Add keyboard click event to div
// Add focus events to all inputs
thumboard.init = function (id) {
    var kb, out, i, j, tmp;
    thumboard.ajax('json/top1000.json',
        '',
        function(xmlhttp) {
            thumboard.words = eval(xmlhttp.responseText);
        },
        'GET');
    kb = thumboard.qwerty;
    out = '<table id="thumboard" class="thumboard">';
    for(i = 0; i < kb.length; i++) {
        out += '<tr>';
        for(j = 0; j < kb[i].length; j++) {
            out += '<td abbr="chr">' + kb[i].charAt(j) + '</td>';
        }
        out += '</tr>';
    }
    out += '<tr>';
    for(i = 0; i < thumboard.ctlDspl.length; i++) {
        out += '<td abbr="' + thumboard.ctlAbbr[i] + '">' +
            thumboard.ctlDspl[i] + '</td>';
    }
    out += '</tr></table>';
    document.getElementById(id).innerHTML = out;
    tmp = document.getElementsByTagName('input');
    for(i = 0; i < tmp.length; i++) {
        if(tmp[i].type === 'text') {
            thumboard.inputs.push(tmp[i]);
            tmp[i].addEventListener('focus', thumboard.gotFocus, false);
        }
    }
    document.getElementById(id).addEventListener('click',
        thumboard.keyClick, false);
    document.getElementById('words').addEventListener('click',
        thumboard.keyClick, false);
};

// Save as target the input receiving focus
// Also set the inputs index matching target in active (this used
//  for tabbing)
thumboard.gotFocus = function (e) {
    var i;
    thumboard.target = e.target;
};


// Capture virtual keyboard clicks and process virtual keystrokes
//  myTarget points to the last monitored element to receive focus
//  Since virtual keyboard steals focus, return focus to myTarget
//  Only process if tagName is 'td' and abbr attribute initialized
//  Initialize working fields:
//      key = the value of the td element clicked
//      i, j, l equate to curstor start, end, and current length
//      s1 and s2 hold prefix and suffix to selected text
//      max holds the working max input text length
//      tmp holds the input text replacement value
//  Process keyboard action and reset input contest and seletion
//      start and end values
// Todo: handle selectionStart and selectionEnd correctly for IE    
thumboard.keyClick = function (e) {
    var key, i, j, l, s1, s2, max, tmp;
    if(!thumboard.target) { // don't process unless input taret has focus
        return;
    }
    thumboard.target.focus(); // return focus from keyboard to input
    // Make sure a monitored key was clicked
    if(e.target.tagName.toLowerCase() !== 'td' ||
            !e.target.abbr) {
        return;
    }
    key = e.target.innerHTML;
    i = thumboard.target.selectionStart;
    j = thumboard.target.selectionEnd;
    l = thumboard.target.value.length;
    s1 = thumboard.target.value.substr(0,i);
    s2 = thumboard.target.value.substr(j,l-j);
    max = (thumboard.target.maxLength > -1) ?
        thumboard.target.maxLength : l + 1;
    tmp = thumboard.target.value;
    switch(e.target.abbr) {
    case 'chr': // Clicked a character
        if(tmp.length < max) {
            tmp = s1 + key + s2;
            i += 1;
            j = i;
        }
        break;
    case 'word':
        while(i > 0 && tmp.charAt(i-1) !== ' ') {
            i -= 1;
        }
        s1 = tmp.substr(0,i);
        s2 = tmp.substr(j);
        tmp = s1 + key + s2;
        i = s1.length + key.length;
        j = i;
        while(j < tmp.length && tmp.charAt(j) != ' ') {
            j += 1;
        }
        break;
    case 'tab':
        thumboard.target =
            thumboard.tab(thumboard.inputs, thumboard.target);
        thumboard.target.focus();
        i = thumboard.target.selectionStart;
        j = thumboard.target.selectionEnd;
        l = thumboard.target.value.length;
        tmp = thumboard.target.value;
        break;
    case 'left':
        i = (i < j) ? i : --i;
        i = (i < 0) ? 0 : i;
        j = i;
        break;
    case 'right':
        i = (i < j) ? j : ++i;
        i = (i > l) ? l : i;
        j = i;
        break;
    case 'back':
        if(i < j) {
            tmp = s1 + s2;
        } else {
            i -= (i > 0) ? 1 : 0;
            tmp = s1.substr(0, i) + s2;
        }
        j = i;
        break;
    case 'home':
        i = 0;
        j = 0;
        break;
    case 'end':
        i = l;
        j = i;
        break;
    }
    thumboard.target.value = tmp;
    thumboard.target.selectionStart = i;
    thumboard.target.selectionEnd = j;
    document.getElementById('words').innerHTML = 
        thumboard.getFormattedWordsList(tmp, i, thumboard.words, 20);

};

thumboard.tab = function(inputs, target) {
    var i = 0;
    target = target || inputs[inputs.length-1];
    while(i < inputs.length && inputs[i] !== target) {
        i += 1;
    }
    i = i > inputs.length - 2 ? 0 : i + 1;
    return inputs[i]; 
}

// Return word segment preceding start in value
thumboard.getWordSeed = function(value, start) {
    var i;
    i = (start < 0) ? 0 : (start > value.length) ? value.length : start;
    while(i > 0 && value.charAt(i-1) !== ' ') {
        i -= 1;
    }
    return value.substr(i, start-i);
};

// Return words prefixed with seed but not fully equal to seed
thumboard.getWordsList = function(seed, wordsArray) {
    var i, arr = [];
    for(i = 0; i < wordsArray.length; i++) {
        if(seed.length < wordsArray[i].length &&
            seed === wordsArray[i].substr(0,seed.length)) {
            arr.push(wordsArray[i]);    
        }
    }
    return arr;
};

// getFormatedWordsList
// value is the input string
// start equates to selectionStart
// wordsArray is an array of words
// max is the maximum number of words to extract
// returns a table of words ready to add to the DOM
thumboard.getFormattedWordsList = function (value, start, wordsArray, max) {
    var arr, out, i;
    arr = thumboard.getWordsList(thumboard.getWordSeed(value, start),
        wordsArray);
    if(arr.length > max) {
        arr.length = max;
    }
    out = '<table class="words"><tr>';
    for(i = 0; i < arr.length; i++) {
        out += '<td abbr="word">' + arr[i] + '</td>';
    }
    out += '</tr></table>';
    return out;
};

// ajax request
thumboard.ajax = function (url, data, callback, type) {
    type = 'GET'; // only type currently supported
    var xmlhttp = window.XMLHttpRequest ?
        new XMLHttpRequest() : new ActiveXOBject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp);
        }
    };
    xmlhttp.open(type, url, true);
    xmlhttp.send();
};