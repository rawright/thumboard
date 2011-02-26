/**
util.js provides browser independant functions
@author <a href="mailto:rich@ghostdeveloper.com">Rich Wright</a>
*/
var ghostdeveloper;
ghostdeveloper = ghostdeveloper === undefined ? {} : ghostdeveloper;

ghostdeveloper.util = {
    
    'hasClass' : function(element,class) {
        return element.className.match(new RegExp('(\\s|^)'+class+'(\\s|$)'));
    },
    
    'addClass' : function(element,class) {
        if(!this.hasClass(element,class)) {
            element.className += ' ' + class;
        }
    },
    
    'removeClass' : function(element,class) {
        if(this.hasClass(element, class)) {
            var reg = new RegExp('(\\s|^)'+class+'(\\s|$)');
            element.className = element.className.replace(reg, ' ');
        }
    },
    
    'toggleClass' : function(element,class) {
        if(this.hasClass(element, class)) {
            this.removeClass(element, class);
        } else {
            this.addClass(element, class);
        }
    },
    
    // This method will be remapped upon first entry to
    // addEventListener or attachEvent as applicable
    'addEvent' : function(element, event, callback) {
        this.initAddEvent(element, event, callback);
    },
    
    'addEventListener' : function(element, event, callback) {
        element.addEventListener(event, callback, false);
    },
    
    'attachEvent' : function(element, event, callback) {
        element.attachEvent(event, callback);
    },
    
    'initAddEvent' : function(element, event, callback) {
        if(document.body.addEventListener) {
            this.addEvent = this.addEventListener;
            this.addEvent(element, event, callback);
        } else {
            this.addEvent = this.attachEvent;
            this.addEvent(element, event, callback);
        }
    }
};
