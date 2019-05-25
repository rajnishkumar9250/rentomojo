console.log("post list");


var xmlhttp = new XMLHttpRequest();
var url = "/post/list";

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        console.log("post list: ", myArr);
        myFunction(myArr);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();