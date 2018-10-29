var timeTable = [
  addTimeSlot("Period 1","7:45","9:5"),
  addTimeSlot("Break","9:5","9:15"),
  addTimeSlot("Period 2","9:15","10:35"),
  addTimeSlot("Flex","10:35","11:25"),
  addTimeSlot("Period 3","11:25","12.45"),
  addTimeSlot("Period 4","12:50","14:10"),
  addTimeSlot("Period 5","14:15","15:35")
];
var currentMin;
var currentMax;
function addTimeSlot(x,y,z){
  return {
      name:x,
      min:y,
      max:z
  }
}
function timeStampToSeconds(input){
  var h = input.split(":")[0];
  var m = input.split(":")[1];
  return h*60*60+m*60;
}
function getTimeInSeconds(){
  var d = new Date();
  var r = d.getSeconds();
  r+=d.getMinutes()*60;
  r+= d.getHours()*60*60;
  return r;
}
function isBetween(time,min,max){ // min & max == string
  return time < timeStampToSeconds(max) && timeStampToSeconds(min) < time;
}
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
  var t = getTimeInSeconds();
  var r = timeTable.filter(x => isBetween(t,x.min,x.max))[0];
  currentMin = timeStampToSeconds(r.min);
  currentMax = timeStampToSeconds(r.max);
  return r.name;
}

function percentOfClass() {
  return (getTimeInSeconds()-currentMin)/(currentMax-currentMin);
}
function update() {
  var p = getPeriod();
  updateBar(percentOfClass()*100, 1);
  document.getElementById('t').innerHTML = p;
}
setInterval(update, 1000);
