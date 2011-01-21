var words = {};
words.list = [];
words.xmlhttp = window.XMLHttpRequest ?
    new XMLHttpRequest() : new ActiveXOBject("Microsoft.XMLHTTP");
words.xmlhttp.onreadystatechange=function() {
    if (words.xmlhttp.readyState==4 && words.xmlhttp.status==200) {
        words.list = eval(words.xmlhttp.responseText);
    }
};
words.xmlhttp.open("GET","json/top1000.json",true);
words.xmlhttp.send();
