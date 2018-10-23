// ------------- Time functions -------------------- 
var timeTable = [
  {
    name:"Period 1",
    min:"7:45",
    max:"9:5"
  },{
    name:"BREAK",
    min:"9:5",
    max:"9:15"
  },{
    name:"Period 2",
    min:"9:15",
    max:"10:35"
  },{
    name:"FLEX",
    min:"10:35",
    max:"11:25"
  },{
    name:"Period 3",
    min:"11:25",
    max:"12:45"
  },{
    name:"Period 4",
    min:"12:50",
    max:"14:10"
  },{
    name:"Period 5",
    min:"14:15",
    max:"15:35"
  }
]
/*
var timeTable = [
  addTimeSlot(x,y,z),
  addTimeSlot(x,y,z),
  addTimeSlot(x,y,z),
  addTimeSlot(x,y,z),
  addTimeSlot(x,y,z),
  addTimeSlot(x,y,z),
  addTimeSlot(x,y,z),
  addTimeSlot(x,y,z),
  addTimeSlot(x,y,z)
]
*/
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
