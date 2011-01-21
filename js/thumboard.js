 /*
 * thumboard virtual keyboard - v0.2
 * Copywright 2011, Rich Wright
 *   
 */
var thumboard = {};
thumboard.inputs = []; // Array of input type = text in the document
//TODO: Determine which blur events should cause an input to be removed
//      from active. (Virtual keyboard click causes such a blur event.)
thumboard.active = null; // Array index of the input with focus
thumboard.target = null; // Input with focus
// Basic qwerty keys
thumboard.qwerty = ['1234567890','qwertyuiop','asdfghjkl ','zxcvbnm   '];
// Control keys (display and internal 'switch' values)
thumboard.ctlDspl = ['&larr;','&rarr;','B','H','E','T',' ',' ',' ',' '];
thumboard.ctlAbbr = ['left','right','back','home','end','tab',' ',' ',' ',' '];

// Initialize the virtual keyboard display
// (Uses abbr attribute to identify key types. This value used in switch
//  in keyClick function.)
// Add keyboard click event to div
// Add focus events to all inputs
thumboard.init = function (id) {
    var kb, out, i, j, tmp;
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
    for(i = 0; i < thumboard.inputs.length; i++) {
        if(thumboard.inputs[i] === thumboard.target) {
            thumboard.active = i;
            break;
        }
    }
};

// Display words that match input from the virtual keyboar
// Matches on from insertion point back to prior word gap or beginning
// of the input area.
// The word list is the top 1000 words used.
// Source is: http://www.duboislc.org/EducationWatch/First100Words.html
// The list is shown in order of frequency of word use.
thumboard.wordsList = function () {
    var tmp, out, i, j;
    if(!thumboard.target) {
        tmp = '';
    } else {
        tmp = thumboard.target.value;
        j = thumboard.target.selectionStart;
        i = j;
        while(i > 0 && tmp.substr(i-1,1) !== ' ') {
            i -= 1;
        }
        tmp = tmp.substr(i, j-i);    
    }
    out = '<table class="words"><tr>';
    for(i = 0, j = 0; i < words.list.length && j < 20; i++) {
      if(tmp.length < words.list[i].length) {
        if(tmp === words.list[i].substr(0, tmp.length)) {
            out += '<td abbr="word">' + words.list[i] + '</td>';
            j += 1;
        }
      }
    }
    out += '</tr></table>'; 
    document.getElementById('thumb').innerHTML = out;
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
    case 'tab':
        thumboard.active =
            (thumboard.active < thumboard.inputs.length-1) ?
                thumboard.active + 1 : 0;
        thumboard.target = thumboard.inputs[thumboard.active];
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
    thumboard.wordsList();
};

function initIt() {
    thumboard.init('qwerty');
    document.getElementById('form1').reset();
}
window.onload=initIt; 