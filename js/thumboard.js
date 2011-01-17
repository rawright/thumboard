 /*
 * thumboard virtual keyboard - v0.1
 * Copywright 2011, Rich Wright
 *   
 */

var myTarget;   // Temporary global until figure out how to get
                // addressability from virtual keyboard click event
// log function for test purposes only
function log(message) {
    var el, msg;
    el = document.getElementById('log');
    if(el) {
        msg = message.replace(/</g,'&lt;').replace(/>/g,'&gt;');
        el.innerHTML = '<br />' + msg + el.innerHTML;
    } else {
        alert(message);
    }
}
// Thumboard class
function Thumboard() {
    this.qwerty = ['1234567890','qwertyuiop','asdfghjkl ','zxcvbnm   '];
    this.ctlDspl = ['&larr;','&rarr;','B','H','E',' ',' ',' ',' ',' '];
    this.ctlAbbr = ['left','right','back','home','end',' ',' ',' ',' ',' '];
    
    // 1) Build the virtual keyboard
    //      Users abbr attribute to store key type
    //          'chr' for characters
    //          'left', 'right', 'back', 'home', 'end' for control keys
    // 2) Find all input type='text' elements and add listers
    //      for focus and blur events
    // Todo: support textarea elements
    // 4) Add click event for the keyboard
    this.init = function(id) {
        var kb, out, i, ii, j, jj, el;
        kb = this.qwerty;
        out = '<table id="thumboard" class="thumboard">';
        for(i = 0, ii = kb.length; i < ii; i++) {
            out += '<tr>';
            for(j = 0, jj = kb[i].length; j < jj; j++) {
                out += '<td abbr="chr">' + kb[i].charAt(j) + '</td>';
            }
            out += '</tr>';
        }
        out += '<tr>';
        for(i = 0; i < this.ctlDspl.length; i++) {
            out += '<td abbr="' + this.ctlAbbr[i] + '">' +
                this.ctlDspl[i] + '</td>';
        }
        out += '</tr>';
        out += '</table>';
        el = document.getElementById(id);
        el.innerHTML = out;
        
        // Find all of the text type inputs in the document
        tmp = document.getElementsByTagName('input');
        for(i = 0, ii = tmp.length; i < ii; i++) {
            if(tmp[i].type === 'text') {
                // Add focus and blur listeners for this input element
                tmp[i].addEventListener('focus', this.gotFocus, false);
                tmp[i].addEventListener('blur', this.lostFocus, false);
                tmp[i].addEventListener('keypress', this.keyPress, false);
            }
        }
        // Remove this code when done testing this part of the app
        if(tmp.length > 0) {
            tmp[0].focus();
        }
        // ----------
        
        // Add listener for the click event on the keyboard
        el.addEventListener('click', this.keyClick, false);
    };
    
    this.keyPress = function() {
        //log(this.selectionStart + ' ' + this.selectionEnd);
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
    this.keyClick = function(e) {
        var key, i, j, l, s1, s2, max, tmp;
        if(!myTarget) {
            return;
        }
        myTarget.focus(); // return focus from keyboard to myTarget
        if(e.target.tagName.toLowerCase() !== 'td' ||
            !e.target.abbr) {
            return;
        }
        key = e.target.innerHTML;
        i = myTarget.selectionStart;
        j = myTarget.selectionEnd;
        l = myTarget.value.length;
        s1 = myTarget.value.substr(0,i);
        s2 = myTarget.value.substr(j,l-j);
        max = (myTarget.maxLength > -1) ?
            myTarget.maxLength : l + 1;
        tmp = myTarget.value;
        switch(e.target.abbr)
        {
        case 'chr':
            if(tmp.length <= max) {
                tmp = s1 + key + s2;
                i += 1;
                j = i;
            }
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
        myTarget.value = tmp;
        myTarget.selectionStart = i;
        myTarget.selectionEnd = j;
        
    };

    // Set myTarget to the monitored input item that has received focus    
    this.gotFocus = function(e) {
        myTarget = e.target;
    };
    this.lostFocus = function(e) {
        // Todo: Intent is to null out myTarget when it loses focus
        // however, not sure how to do this yet since the virtual
        // keyboard click causes it to lose focus
    };

    // id is where the div where virtual keyboard will be added
    this.run = function(id) {
        this.init(id);
    };
}

function initThumboard()
{
    var i, tb;
    for(i = 0; i < document.forms.length; i++) {
        document.forms[i].reset();
    }
    tb = new Thumboard();
    tb.run('qwerty');
}
window.onload=initThumboard; 