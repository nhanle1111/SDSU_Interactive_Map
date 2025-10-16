//Nhan Le
// Professor: Andre Skupin
//Project: Interactive SDSU Map

//Defining all variables concerning main map
let imgW=0;
let imgH=0;
let imgX=0;
let imgY=0;
let bldgName='';
let permit ='';
let paycode='';

//Defining all zoom var
//easing is how much/how fast one want to zoom in or out
let minzoom = 1;
let maxzoom = 10;
let easing = 0.1

//Defining all pan var
let panfromY=0;
let panfromX=0;
let pantoX=0;
let pantoY=0;


function preload(){
  Campusmap = loadImage('Campus.png');
  bld = loadImage('Buildings.png');
  bldcode = loadTable('Building_Codes.csv','csv','header');     
}
function setup() {
  createCanvas(800,450);
  imgW = Campusmap.width;
  imgH = Campusmap.height;
}



// zoom funtion
function keyPressed() { 
if (key == '+'){
    console.log('pressed');
    imgW = constrain(int(imgW * (1+ easing)),Campusmap.width * minzoom, Campusmap.width * maxzoom);
    imgH = constrain(int(imgH * (1 + easing)),Campusmap.height * minzoom, Campusmap.height * maxzoom);
    imgX = imgX - int(easing*(mouseX - imgX));
    imgY = imgY - int(easing*(mouseY - imgY));
  bind();
}

if (key == '-'){ 
    console.log('pressed');
    imgW = constrain(int(imgW / (1+ easing)),Campusmap.width * minzoom, Campusmap.width*maxzoom);
    imgH = constrain(int(imgH / (1 + easing)),Campusmap.height * minzoom, Campusmap.height*maxzoom);
    imgX = imgX + (mouseX - imgX) * (easing / (1 + easing));
    imgY = imgY + (mouseY - imgY) * (easing / (1 + easing));
  bind();
}

if (keyCode === UP_ARROW) { 
  imgY += 20;   
  bind();
}
if (keyCode === DOWN_ARROW) { 
  imgY -= 20;   
  bind();}
  
if (keyCode === RIGHT_ARROW) { 
  imgX -= 20;   
  bind();}

if (keyCode === LEFT_ARROW) { 
  imgX += 20;   
  bind();}
}

function mouseWheel(event){
  if(event.delta < 0){
  if (imgW * (1 + easing) <= Campusmap.width * maxzoom){
  imgW = int(imgW * (1+ easing));
  imgH = int(imgH * (1 + easing));
  imgX = imgX - int(easing*(mouseX - imgX));
  imgY = imgY - int(easing*(mouseY - imgY))
  }
  bind();}
  else
    if (imgW /(1 + easing) >= Campusmap.width * minzoom){
    {imgW = int(imgW / (1+ easing));
    imgH = int(imgH / (1 + easing));
    imgX = imgX + (mouseX - imgX) * (easing / (1 + easing));
    imgY = imgY + (mouseY - imgY) * (easing / (1 + easing));
    bind();
    }}

}

function mousePressed() {
  panfromX = mouseX;
  panfromY = mouseY;
}

function mouseDragged() {
  dx = mouseX - panfromX;
  dy = mouseY - panfromY;
  imgX += dx;
  imgY += dy;

  // update the baseline for the next frame
  panfromX = mouseX;
  panfromY = mouseY;
  
  bind();
}

function doubleClicked() {
  bldgCode = red(bld.get(pixelX, pixelY));
  bldgName = getFeatureName(bldgCode, bldcode);
  permit = getPermits(bldgCode,bldcode);
  paycode = getPaybyPhone(bldgCode,bldcode);
  console.log(bldgName);}

function draw() {
  background(220);
  image(Campusmap,imgX,imgY,imgW,imgH);
  fill(0);
  stroke(0);
  rect(600,0,200,450);
  fill(200,200,200);
  noStroke();
  rect(610,160,180,180);
  image(Campusmap,600,0,200,150);
  
//all the ratio
  mapratio = 200/Campusmap.width;
  sX = imgW/Campusmap.width;
  sY = imgH/Campusmap.height;
  
//display region  
  viewX = -imgX/sX;
  viewY = -imgY/sY;
  viewW = 600/sX;
  viewH = 450/sY;
  
//scale to inset map
  rectX = 600 + viewX * mapratio;
  rectY = 0 + viewY * mapratio;
  rectW = viewW * mapratio;
  rectH = viewH * mapratio;
  
  stroke(125, 249, 255);
  strokeWeight(2);
  noFill();
  rect(rectX, rectY, rectW, rectH); 
  
//building related
  bldW = bld.width;
  bldH = bld.height;
  
  pixelX = bldW * (mouseX - imgX) / imgW;
  pixelY = bldH * (mouseY - imgY) / imgH; 
  
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text(bldgName, 610, 170,180,280);
  textSize(13);
  textAlign(LEFT);
  text(permit,615,200,170,280);
  textSize(13);
  textAlign(LEFT);
  text(paycode,615,270,170,280);
  
  // users'instruction
  fill(255);
  textAlign(LEFT);
  textSize(11);
  text("Drag mouse to pan",605,385);
  text("Use mousewheel/+,- to zoom",605,400);
  text("Or use ↑ ↓ → ← to control the map",605,415);
  text("Double click on building for information",605,430);
  textSize(15);
  stroke(0,255);
  strokeWeight(1);
  text("HOW TO USE",605,365);
  

}


function bind() {
  if (imgX > 0) imgX = 0;                                  
  if (imgY > 0) imgY = 0;                                  
  if (imgX + imgW < 600) imgX = 600 - imgW;                
  if (imgY + imgH < height) imgY = height - imgH;          
}

function getFeatureName(grayVal, tbl) {
  name ="";
  for (var i=1; i<tbl.getRowCount(); i++) {
    var code = tbl.get(i,"Pixel_Val");
    if(grayVal == code) {
      name = tbl.get(i, "Name");
          console.log(name);
      return name;}
  }
}
function getPermits(grayVal, tbl) {
  permit ="";
  for (var i=1; i<tbl.getRowCount(); i++) {
    var code = tbl.get(i,"Pixel_Val");
    var name = bldcode.get(i,"Name");
    if(grayVal == code && name.startsWith("PS")) {
      permit = tbl.get(i, "Permits");
          console.log(permit);
      return 'Permits:'+' '+ permit;}
  }
}

function getPaybyPhone(grayVal, tbl) {
  paycode ="";
  for (var i=1; i<tbl.getRowCount(); i++) {
    var code = tbl.get(i,"Pixel_Val");
    var name = bldcode.get(i,"Name");
    if(grayVal == code && name.startsWith("PS")) {
      paycode = tbl.get(i, "PaybyPhone");
          console.log(paycode);
      return 'PaybyPhone Zone#:'+' '+ paycode;}
  }
}


