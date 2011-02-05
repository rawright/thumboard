// helper_functions.js

// Class helper functions from snipplr.com
function hasClass(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
    if(!this.hasClass(ele,cls)) ele.className += ' '+cls;
}

function removeClass(ele,cls) {
    if(hasClass(ele,cls)) {
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
        ele.className = ele.className.replace(reg,' ');
    }
}

// My class helper addition
function toggleClass(ele,cls) {
    if(this.hasClass(ele,cls)) {
        this.removeClass(ele,cls);
    } else {
        this.addClass(ele,cls);
    }
}

// Event functions
function addEvent(ele,event,callback) {
    if(ele.addEventListener) {
        ele.addEventListener(event,callback,false);
    } else {
        ele.attachEvent(event,callback);
    }
}