function setup(){
	createCanvas(windowWidth,windowWidth*0.5051194539249146*2)
	const mapx = width*0.8; 
	const mapy = height*0.4; 
	//print(windowHeight/windowWidth)
}

var sealevel = 95
var sandlevel = 110
var grasslevel = 140
var forestlevel = 170
var tundralevel = 185

var showgrid = true;
var camerazoom = 1;
var camerasensitivity;
var camerajoystickmoving = false;
var camerax = 0
var cameray = 0

var paused = false;
var showmainmenu = true;
var menu = 0; //0: nothing, 1: premade map selector, 2: map generation settings
var gamestarted = false;

var citiesx = [];
var citiesy = [];
var terrainval = [];
var resources = []; //1: food, 2:iron, 3:wood, 4:stone, 5:animals, 6:oil

//below are functions


function biome(X,Y){
return	255*noise(2*X/width,4*Y/width)
}
///////////////////////////////////////////////////////////////////////////////////
function mapgen(){
terrainval = [];
const mapx = width*0.8; 
const mapy = height*0.4;	
for(var x = 0; x <=2*mapx; x+= mapx/40){
	for(var y = 0; y <=2*mapy; y+= mapy/20){
		terrainval.push(round(biome(x,y-(mapy/20))))
		}
	}	
}
///////////////////////////////////////////////////////////////////////////////////
function resourceget(x,y){
return 100*noise(213-x*543,50*y)
}
///////////////////////////////////////////////////////////////////////////////////
function resourcegen(){
resources = [];
const mapx = width*0.8; 
const mapy = height*0.4; 
var i = 0;
	for(var X = 0; X <=mapx*2; X+= mapx/40){
	for(var Y = mapy/20; Y <=(mapy*2)+mapy/20; Y+= mapy/20){	
		i++
		var x=round(X)
		var y = round(Y)
		if(terrainval[i]<=sealevel){ //water
				
				if(resourceget(x,y)<=20){
					resources.push([x,y,6])
				}
				else if(resourceget(x,y)<=30){
					resources.push([x,y,1])											 
				}	
		}
		else if(terrainval[i]<=sandlevel){ //sand
				if(resourceget(x,y)<=10){
					resources.push([x,y,6])
				}
				else if(resourceget(x,y)<=20){
					resources.push([x,y,5])
				}
				else if(resourceget(x,y)<=40){
					resources.push([x,y,4])
				}
				else if(resourceget(x,y)<=43){
					resources.push([x,y,1])
				}			
		}
		else if(terrainval[i]<=grasslevel){ //grassland						1: food, 2:iron, 3:wood, 4:stone, 5:animals, 6:oil
			  if(resourceget(x,y)<=20){
					resources.push([x,y,5])
				}
				else if(resourceget(x,y)<=35){
					resources.push([x,y,1])
				}
				else if(resourceget(x,y)>=80){
					resources.push([x,y,4])
				}
			  else if(resourceget(x,y)>=75){
					resources.push([x,y,6])
				}
				else if(resourceget(x,y)>=70){
					resources.push([x,y,2])
				}
		}
		else if(terrainval[i]<=forestlevel){ //forest			
				if(resourceget(x,y)<=10){
					resources.push([x,y,6])
				}
				else if(resourceget(x,y)<=15){
					resources.push([x,y,5])
				}
				else if(resourceget(x,y)<=25){
					resources.push([x,y,1])
				}
			  else if(resourceget(x,y)<=40){
					resources.push([x,y,3])
				}
				else if(resourceget(x,y)>=65){
					resources.push([x,y,4])
				}
				else if(resourceget(x,y)>=60){
					resources.push([x,y,2])
				}
		}
		else if(terrainval[i]<=185){ //tundra
				if(resourceget(x,y)>=75){
					resources.push([x,y,6])
				}
				else if(resourceget(x,y)>=72){
					resources.push([x,y,5])
				}
				else if(resourceget(x,y)<=50){
					resources.push([x,y,2])
				}		
			  else if(resourceget(x,y)<=60){
					resources.push([x,y,4])
				}	
		}
		else{ //snow
			if(resourceget(x,y)<=30){
					resources.push([x,y,6])
				}
			else if(resourceget(x,y)>=90){
					resources.push([x,y,5])
				}
		}
	}
	}
}
///////////////////////////////////////////////////////////////////////////////////
function displaymap(){
const mapx = width*0.8; 
const mapy = height*0.4;
var i = 0;
for(var x = 0; x <=2*mapx; x+= mapx/40){
	for(var y = 0; y <=2*mapy; y+= mapy/20){
		
		var color = terrainval[i]
		i++
		if(showgrid){stroke(200,200,200,100)}
		if(showgrid == false){noStroke()}
		
		if(color<=sealevel){
		fill(color,color,150+color)
		}
		else if(color<=sandlevel){
		fill(310-color,310-color,100)
		}
		else if(color<=grasslevel){
		fill(240-color,295-color,100)
		}
		else if(color<=forestlevel){
		fill(50,color-25,50)
		}else if(color<=tundralevel){
		fill(color-25,color-25,color)
		}else {fill(255)}
		
		rect(camerazoom*x+camerax,camerazoom*y+cameray,camerazoom*mapx/40+1,camerazoom*mapy/20+1);	
		fill(0)
		//text(round(100*noise((x-camerax)*100,(y-cameray)*100)),x,y)
		//fill(255,0,255)
		//text(round(biome(x-camerax,y-cameray)),x,y+(mapy/40))
	}
}
		noFill();
strokeWeight(camerazoom*width/500);
for(var i = 0; i <=resources.length-1; i++){
	if(resources[i][2] == 1){stroke(20,200,20)}				//1: food, 2:iron, 3:wood, 4:stone, 5:animals, 6:oil
	else if(resources[i][2] == 2){stroke(170,200,200)}
	else if(resources[i][2] == 3){stroke(150,100,0)}
	else if(resources[i][2] == 4){stroke(120)}
	else if(resources[i][2] == 5){stroke(200,150,150)}
	else if(resources[i][2] == 6){stroke(50)}
	rect(camerazoom*resources[i][0]+camerax+(camerazoom*width/1000),camerazoom*resources[i][1]+cameray+(camerazoom*width/1000),camerazoom*mapx/40-(camerazoom*width/500),camerazoom*mapy/20-(camerazoom*width/500))
}
strokeWeight(1);	
}
///////////////////////////////////////////////////////////////////////////////////
function displaywhiterectangles(){
fill(255)			
stroke(0)	
rect(width*0.8,0,width-(width*0.8),height)
rect(0,height*0.4,width*0.8,height)
}
///////////////////////////////////////////////////////////////////////////////////
function nextmult(x){
return ((10*x)*(x+1))/2
}
///////////////////////////////////////////////////////////////////////////////////
function greennextmult(x){
return ((5*x)*(x-1))/2
}
///////////////////////////////////////////////////////////////////////////////////
function loadgame(){
	terrainval = [];
	resources = [];
var game = prompt('Please paste the text you got when you clicked the box that said, "Save Game"')
	data = game.split('~')
	//terrainval,resourceX,resourceY,resourceval
	terrainval = data[1].split(',')
	var resourceRaw = data[2].split(',')
	for(var i = 0; i <=(resourceRaw.length)/3; i++){
	resources.push([width*resourceRaw[3*i]/data[0],height*resourceRaw[3*i+1]/(data[0]*0.5051194539249146*2),resourceRaw[3*i+2]])
	}
}
///////////////////////////////////////////////////////////////////////////////////
function savegame(){
for(var i = 0; i <= 500; i++){print("HEYHEYHEY YOU SHOULD SCROLL DOWN TO WHERE YOU SEE NUMBERS AND IGNORE THE STUFF ABOVE!!!")}
print(width+'~'+terrainval+'~'+resources)
}
///////////////////////////////////////////////////////////////////////////////////
function mainmenu(){
	var buttons = [
									["Load Game",width*0.1,height*0.1,width*0.3,height*0.15,height*0.1+(width/20),190,190,238,38,38,48,width/20],
									[" New Game",width*0.6,height*0.1,width*0.3,height*0.15,height*0.1+(width/20),190,238,190,38,48,38,width/20],
									["Choose A Pre-Existing Map",width*0.1,height*0.3,width*0.3,height*0.15,height*0.3+(width/30),238,190,190,38,48,48,width/25],
									["Map Generation Settings",width*0.45,height*0.1,width*0.1,height*0.045,height*0.106,180,255,255,38,48,48,width/68],
									["How the hecc do I play this game?",width*0.45,height*0.15,width*0.1,height*0.045,height*0.16,255,200,255,48,38,48,width/80],
									["Empty Button",width*0.45,height*0.2,width*0.1,height*0.045,height*0.2,255,255,200,48,48,38,width/50]
									];
if(gamestarted){buttons.splice(1,1,["Resume Game",width*0.6,height*0.1,width*0.3,height*0.15,height*0.1+(width/40),190,238,190,38,48,38,width/20])}

	background(190,238,238);

for(var i = 0; i <= buttons.length-1; i++){
textSize(buttons[i][12]);
	
if(rectbutton(buttons[i][1],buttons[i][2],buttons[i][3],buttons[i][4])){
	stroke(200,200,150)
	if(mouseIsPressed){stroke(150,200,150)}
}else{stroke(0);}	
	
fill(buttons[i][6],buttons[i][7],buttons[i][8]);
rect(buttons[i][1],buttons[i][2],buttons[i][3],buttons[i][4]);
fill(buttons[i][9],buttons[i][10],buttons[i][11])
text(buttons[i][0],buttons[i][1],buttons[i][5],buttons[i][3],buttons[i][4]);
}
	
	

if(rectbutton(width*0.1,height*0.1,width*0.3,height*0.15)&&mouseIsPressed){
	loadgame();
	showmainmenu = false
}

if(rectbutton(width*0.6,height*0.1,width*0.3,height*0.15)&&mouseIsPressed&&gamestarted == false){
	mapgen();
	resourcegen();
	showmainmenu = false
	gamestarted = true
}if(rectbutton(width*0.6,height*0.1,width*0.3,height*0.15)&&mouseIsPressed&&gamestarted){showmainmenu = false}
}
///////////////////////////////////////////////////////////////////////////////////
function pausemenu(){


for(var i = 0; i <= 10; i++){
	fill(0,0,0,1)
	rect(0,0,width,height)
}
	fill(238);
	savebutton()
	mainmenubutton()
}
///////////////////////////////////////////////////////////////////////////////////
function rectbutton(x,y,w,h){
return (mouseX>=x&&mouseX<=x+w&&mouseY>=y&&mouseY<=y+h)
}
///////////////////////////////////////////////////////////////////////////////////
function circlebutton(x,y,r){
return (dist(x,y,mouseX,mouseY)<=r)
}
///////////////////////////////////////////////////////////////////////////////////
function cameramove(){
	const mapx = width*0.8; 
const mapy = height*0.4; 
const x = (width*0.9)
const y = (height*0.15)
var hypotenuse = dist(x,y,mouseX,mouseY)
var r = min(max(hypotenuse,0),(width/10)-(2*width/30))
fill(255)
ellipse(x,y,width/10,width/10)
	
	if(circlebutton(x,y,width/20)){
		if(mouseIsPressed){
		camerajoystickmoving = true
		}
	}
	
	fill(200)
	if(mouseIsPressed&&camerajoystickmoving){
		camerajoystickmoving = true
		
		ellipse(r*((mouseX-x)/hypotenuse)+x,r*((mouseY-y)/hypotenuse)+y,(width/30),(width/30))
		ellipse(r*((mouseX-x)/hypotenuse)+x,r*((mouseY-y)/hypotenuse)+y,(width/35),(width/35))

		
		camerax -= camerasensitivity*((mouseX-x)/hypotenuse)		
		cameray -= camerasensitivity*((mouseY-y)/hypotenuse)
	
	}
	else{
		camerajoystickmoving = false
		ellipse(x,y,(width/30),(width/30))
		ellipse(x,y,(width/35),(width/35))
	}
	
	rect(0.815*width,0.125*height,width/40,width/40)
	rect(0.815*width,0.125*height+(width/40),width/40,width/40)
	
	fill(0)
	textSize(width/25)
	
	text("+",0.815*width+(width/80),0.125*height+(width/40))	
	text("-",0.815*width+(width/80),0.125*height+(width/20))
	
	if(rectbutton(0.815*width,0.125*height,width/40,width/40)&&mouseIsPressed&&camerazoom<2&&camerajoystickmoving == false){
		camerazoom+=0.05
	}
	if(rectbutton(0.815*width,0.125*height+(width/40),width/40,width/40)&&mouseIsPressed&&camerazoom>0.5&&camerajoystickmoving == false){
		camerazoom-=0.05
	}	
}
///////////////////////////////////////////////////////////////////////////////////
function savebutton(){

textSize(width/50)

	if(rectbutton((width/2)-((width*0.2-(width/30))/2),height*0.1,width*0.2-(width/30),height/40)){
		stroke(150,200,150)
		if(mouseIsPressed){
		savegame()
		}
	}else{stroke(0)}

fill(190,190,190);
rect((width/2)-((width*0.2-(width/30))/2),height*0.1,width*0.2-(width/30),height/40)	
fill(0);
text('Save Game',(width/2)-((width*0.2-(width/30))/2),height*0.1,width*0.2-(width/30),height/40)
}
///////////////////////////////////////////////////////////////////////////////////
function mainmenubutton(){
fill(0);
textSize(width/50)

	if(rectbutton((width/2)-((width*0.2-(width/30))/2),height*0.14,width*0.2-(width/30),height/40)){
		stroke(150,200,150)
		if(mouseIsPressed){
		showmainmenu = true
		paused = false
		}
	}else{stroke(0)}
	
fill(190,190,190);
rect((width/2)-((width*0.2-(width/30))/2),height*0.14,width*0.2-(width/30),height/40)
fill(0);
text('Go to Main Menu',(width/2)-((width*0.2-(width/30))/2),height*0.14,width*0.2-(width/30),height/40)
}

function keyPressed(){
	if(keyCode == ESCAPE&&paused == false&&showmainmenu == false){
		paused = true
	}
	else if(keyCode == ESCAPE&&paused == true&&showmainmenu == false){	
		paused 	= false
	}	
}
///////////////////////////////////////////////////////////////////////////////////

//BELOW IS THE MAIN LOOP

function draw() {
	textAlign(CENTER)

	textFont('Bookman')
	const mapx = width*0.8; 
	const mapy = height*0.4; 
	
	camerasensitivity = camerazoom*30
	
	camerax = max(min(camerax,0),-2*(camerazoom-0.5)*mapx)
	cameray = max(min(cameray,0),-2*(camerazoom-0.5)*mapy)

	noStroke();	
	
	if(showmainmenu === false&&paused == false){
		displaymap();
		displaywhiterectangles();
		cameramove();
	}
	
	if(paused && showmainmenu == false){pausemenu()}
	
	if(showmainmenu){mainmenu();}

	noStroke()
	rectMode(CORNER)

}
