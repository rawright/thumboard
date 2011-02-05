// thumboard virtual keyboard - v0.2.2
// Copywright 2011, Rich Wright

var thumboard = {

// Todo: disallow direct manipulation of config parameters
'config' : {
    'id' : 'thumboard',
    'kb' : null,
    'hidden' : true,
    'url' : 'json/top1000.json',
    'words' : [],
    'inputs' : [],
    'target' : null,
    'ctlDspl' : ['H','&larr;','B','T','space','t','D','&rarr;','E'],
    'ctlAbbr' : ['home','left','back','shift_tab','space','tab','delete','right','end']
},
        
'init' : function(id) {
    var i, inputs,
        ajaxCallback = function(xhr) {
            thumboard.config.words = eval(xhr.responseText);
            thumboard.buildKeyboard('',0);
        };
        
    // Get reference to the keyboard location and hide that element
    thumboard.config.id = id || thumboard.config.id;
    thumboard.config.kb = document.getElementById(thumboard.config.id);
    addClass(thumboard.config.kb,'hide');
    thumboard.config.hidden = true;
    
    // Get words list from server
    thumboard.ajax(thumboard.config.url, ajaxCallback);
    
    // Save references to input elements
    // Todo: capture dynamically added input elements??
    inputs = document.getElementsByTagName('input');
    for(i = 0; i < inputs.length; i++) {
        if(inputs[i].type === 'text') {
            thumboard.config.inputs.push(inputs[i]);
            addEvent(inputs[i],'focus',thumboard.gotFocus);
        }
    }
    
    // Add click event keyboard
    addEvent(thumboard.config.kb,'click',thumboard.keyClick);
    // Add click event to test for lost focus and then hide keyboard
    addEvent(document,'click',thumboard.lostFocus);
},
    
'gotFocus' : function(e) {
    // If input receives focus save it as the current target
    // and reshow the keyboard if it was hidden
    // Note that this event will fire whenever the virtual keyboard
    // is clicked, since it will return focus to the previous target
    thumboard.config.target = e.target;
    if(thumboard.config.hidden) {
        removeClass(thumboard.config.kb,'hide');
        thumboard.config.hidden = false;
    }
},

'lostFocus' : function(e) {
    var i;
    
    // If clicked element is one of saved inputs then return
    for(i = 0; i < thumboard.config.inputs.length; i++) {
        if(e.target === thumboard.config.inputs[i]) {
            return;
        }
    }
    
    // If clicked element is not the virtual keyboard, hide the keyboard
    if(e.target.abbr === undefined) {
        addClass(thumboard.config.kb,'hide');
        thumboard.config.hidden = true;
    }
},

// Keyboard clicked
'keyClick' : function(e) {
    var obj = {};

    var helper = {
    // Todo: prefer not to let tab functions directly reference DOM
    'tab' : function(obj) {
        var o = obj;
        o.current = o.current < o.inputs.length-1 ? o.current + 1 : 0;
        o.target = o.inputs[o.current];
        o.start = o.target.selectionStart;
        o.end = o.target.selectionEnd;
        o.value = o.target.value;
        return o;
    },
    'shift_tab' : function(obj) {
        var o = obj;
        o.current = o.current > 0 ? o.current - 1 : o.inputs.length - 1;
        o.target = o.inputs[o.current];
        o.start = o.target.selectionStart;
        o.end = o.target.selectionEnd;
        o.value = o.target.value;
        return o;
    },
    'left' : function(obj) {
        var o = obj;
        o.start = (o.start < o.end) ? o.start : o.start - 1;
        o.start = (o.start < 0) ? 0 : o.start;
        o.end = o.start;
        return o;
    },
    'right' : function(obj) {
        var o = obj;
        o.start = (o.start < o.end) ? o.end : o.start + 1;
        o.start = (o.start > o.len) ? o.len : o.start;
        o.end = o.start;
        return o;
    },
    'back' : function(obj) {
        var o = obj;
        if(o.start < o.end) {
            o.value = o.str1 + o.str2;
        } else {
            o.start -= (o.start > 0) ? 1 : 0;
            o.value = o.str1.substr(0, o.start) + o.str2;
        }
        o.end = o.start;
        return o;
    },
    'delete' : function(obj) {
        var o = obj;
        if(o.start < o.end) {
            o.value = o.str1 + o.str2;
        } else {
            o.value = o.str1 + (o.str2.length > 0 ? o.str2.substr(1) : '');
        }
        o.end = o.start;
        return o;
    },
    'home' : function(obj) {
        var o = obj;
        o.start = o.end = 0;
        return o;
    },
    'end' : function(obj) {
        var o = obj;
        o.start = o.end = o.len;
        return o;
    },
    'word' : function(obj) {
        var o = obj;
        // Todo: do this with regex
        while(o.start > 0 && o.value.charAt(o.start-1) !== ' ') {
            o.start -= 1;
        }
        o.str1 = o.value.substr(0,o.start);
        o.str2 = o.value.substr(o.end);
        o.value = o.str1 + o.key + o.str2;
        o.start = o.str1.length + o.key.length;
        o.end = o.start;
        while(o.end < o.value.length && o.value.charAt(o.end) !== ' ') {
            o.end += 1;
        }
        return o;
    },
    'chr' : function(obj) {
        var o = obj;
        if(o.value.length < o.max) {
            o.value = o.str1 + o.key + o.str2;
            o.start += 1;
            o.end = o.start;
        }
        return o;
    }
    };
    
    // If target didn't have focus then return
    if(!thumboard.config.target) {
        return;
    }

    // Set up working variables
    obj.target = thumboard.config.target;
    obj.inputs = thumboard.config.inputs;
    obj.current = 0;
    while(obj.current < obj.inputs.length &&
        obj.target !== obj.inputs[obj.current]) {
        obj.current += 1;
    }
    obj.key = e.target.innerHTML;
    obj.keytype = e.target.abbr || 'none';
    if(obj.keytype === 'space') {
        obj.key = ' ';
        obj.keytype = 'chr';
    }
    obj.start = obj.target.selectionStart;
    obj.end = obj.target.selectionEnd;
    obj.len = obj.target.value.length;
    obj.str1 = obj.target.value.substr(0,obj.start);
    obj.str2 = obj.target.value.substr(obj.end,obj.len-obj.end);
    obj.max = (obj.target.maxLength > -1) ?
        obj.target.maxLength : obj.len + 1;
    obj.value = obj.target.value;
    
    // Process clicked keyboard item
    if(helper[obj.keytype]) {
        obj = helper[obj.keytype](obj);
        thumboard.config.target = obj.target;
        obj.target.value = obj.value;
        obj.target.selectionStart = obj.start;
        obj.target.selectionEnd = obj.end;
        thumboard.buildKeyboard(obj.value, obj.start);
    }
    // Return focus to target (or new target if tabbed)
    thumboard.config.target.focus();
},

'buildKeyboard' : function(value, start) {
    var i, j, out, seed, words, letters, arr, abbr;
    
    seed = thumboard.getSeed(value,start);
    words = thumboard.getWords(seed,thumboard.config.words);
    letters = thumboard.getLetters(seed,words,10);
    
    words = words.slice(0,15).sort();
    letters.sort();
    
    arr = ['abcdefghijklm',
        'nopqrstuvwxyz',
        thumboard.config.ctlDspl,
        letters,
        words];
    abbr = ['chr','chr',thumboard.config.ctlAbbr,'chr','word'];
    out = '';
    for(i = 0; i < arr.length; i++) {
        out += '<table class="thumboard"><tr>';
        for(j = 0; j < arr[i].length; j++) {
            out += '<td abbr="';
            out += typeof abbr[i] === 'string' ?
                abbr[i] : abbr[i][j];
            out +=  '">' + arr[i][j] + '</td>';
        }
        out += '</tr></table>';
    }
    thumboard.config.kb.innerHTML = out;
    
},

'getSeed' : function(value, start) {
    return value.substr(0,start).match(/\s*(\S*)$/)[1];
},

'getWords' : function(seed, words, max) {
    var i, arr = [],
        re = new RegExp('^'+seed+'[\\S]+', 'i');
        
    max = max ? max : words.length;
    
    for(i = 0; i < words.length; i++) {
        if(words[i].search(re) > -1) {
            arr.push(words[i]);    
        }
    }
    return arr.slice(0,max);    
},

'getLetters' : function(seed, words, max) {
    var i, x, letters = {}, arr = [],
        re = new RegExp('^'+seed+'[a-z]+', 'i');
    
    max = max ? max : words.length;
        
    // Count occurrences of letter after seed in words
    for(i = 0; i < words.length; i++) {
        if(words[i].search(re) > -1) {
            x = words[i].charAt(seed.length);
            letters[x] = (!letters[x]) ?
                1 : letters[x] + 1;
        }
    }
    for(x in letters) {
        if(letters[x].hasOwnProperty) {
            arr.push(x);
        }
    }

    // Sort first by descending frequency and second by 
    // ascending character value
    arr.sort(function(a,b) {
        if(letters[a] === letters[b]) {
            return (a < b) ? -1 : 1;
        }
        return letters[b] - letters[a];
    });

    return arr.slice(0,max); 
},
    
'ajax' : function(url, callback) {
    var xmlhttp = window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXOBject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp);
        }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
}

};
