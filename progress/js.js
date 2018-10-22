// ------------- Time functions --------------------
function th() {
  var d = new Date();
  return d.getHours();
}
function tm() {
  var d = new Date();
  return d.getMinutes();
}
function ts() {
  var d = new Date();
  return d.getSeconds();
}
// --------------------------------------------------
function updateBar(p, z) {
  if (p <= 3) {
    document.getElementById(z).style = "width:" + 5 + "%";
    document.getElementById(z).innerHTML = Math.ceil(p * 10) / 10 + "%"
  } else {
    document.getElementById(z).style = "width:" + p + "%";
    document.getElementById(z).innerHTML = Math.ceil(p * 10) / 10 + "%"
  }
}
function getPeriod() {
  if (timeToSecs(7, 45, 0) <= timeToSecs(th(), tm(), ts()) && timeToSecs(th(), tm(), ts()) <= timeToSecs(9, 5, 0)) { return 1; }
  if (timeToSecs(9, 15, 0) <= timeToSecs(th(), tm(), ts()) && timeToSecs(th(), tm(), ts()) <= timeToSecs(10, 35, 0)) { return 2; }
  if (timeToSecs(11, 25, 0) <= timeToSecs(th(), tm(), ts()) && timeToSecs(th(), tm(), ts()) <= timeToSecs(12, 45, 0)) { return 3; }
  if (timeToSecs(12, 50, 0) <= timeToSecs(th(), tm(), ts()) && timeToSecs(th(), tm(), ts()) <= timeToSecs(14, 10, 0)) { return 4; }
  if (timeToSecs(14, 15, 0) <= timeToSecs(th(), tm(), ts()) && timeToSecs(th(), tm(), ts()) <= timeToSecs(15, 35, 0)) { return 5; }
  return 0;
}
function timeToSecs(a, b, c) {
  var a = a * 60 * 60;
  var b = b * 60;
  return a + b + c;
}
function partOfClass(wc) {
  if (wc == 1) {
    return (timeToSecs(th(), tm(), ts()) - timeToSecs(7, 45, 0)) / 4800
  }
  if (wc == 2) {
    return (timeToSecs(th(), tm(), ts()) - timeToSecs(9, 15, 0)) / 4800
  }
  if (wc == 3) {
    return (timeToSecs(th(), tm(), ts()) - timeToSecs(11, 25, 0)) / 4800
  }
  if (wc == 4) {
    return (timeToSecs(th(), tm(), ts()) - timeToSecs(12, 50, 0)) / 4800
  }
  if (wc == 5) {
    return (timeToSecs(th(), tm(), ts()) - timeToSecs(14, 15, 0)) / 4800
  }
  if (wc == 0) {
    return 1;
  }
}
function update() {
  updateBar(partOfClass(getPeriod()) * 100, 1);
}
setInterval(function () { update() }, 1000);
console.log("It is now period:" + getPeriod());
/*
th(){
var d = new Date();
return d.getHours();
}
tm(){
var d = new Date();
return d.getMinutes();
}
ts(){
var d = new Date();
return d.getSeconds();
}
time = timeToSecs(th(),tm(),ts())
-------------------------------------------------------------------------
Period 1 = 7:45-9:05 = if(timeToSecs(7,45,0)<=time&&time<=timeToSecs(9,5,0)){return 1;}
Period 2 = 9:15-10:35 = if(timeToSecs(9,15,0)<=time&&time<=timeToSecs(10,35,0)){return 2;}
Period 3 = 11:25-12:45 = if(timeToSecs(11,25,0)<=time&&time<=timeToSecs(12,45,0)){return 3;}
Period 4 = 12:50-14:10 = if(timeToSecs(12,50,0)<=time&&time<=timeToSecs(14,10,0)){return 4;}
Period 5 = 14:15-15:35 = if(timeToSecs(14,15,0)<=time&&time<=timeToSecs(15,35,0)){return 5;}
*/
