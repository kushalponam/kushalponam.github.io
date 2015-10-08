	var canvas,context;
	var WIDTH = 1280; 
	var HEIGHT = 720;
	var rows=0;
	var cols=0;
	var FPS = 60;
	var centiFPS = 15;
	var player,backGround,ship;
	var obj2;
	var max,min;
	var sceneObjects = [];
	var numberofsceneObjects = 75;
	var elapsedTime=0;
	var startelapsedTime = false;
	var debrisimages = ['imgs/debris_40_1.png','imgs/debris1.png','imgs/debris2.png'];
	var meteorimages = ['imgs/debris_40_2.png','imgs/meteor1.png','imgs/meteor2.png'];
	var stateofgame=0;
	var audio;
	var canvas = document.getElementById("c");
	var context = canvas.getContext("2d");
	var width = canvas.getAttribute('width');
	var height = canvas.getAttribute('height');
	var Backgroundheight = 2160;
	var mouseX;
	var mouseY;
	///////////Menu Screen Images///////
	var bgImage = new Image();
	var logoImage = new Image();
	var playImage = new Image();
	var instructImage = new Image();
	var settingsImage = new Image();
	var creditsImage = new Image();
	var shipImage = new Image();
	/////////Individual Screen Images/////
	var controlsimage = new Image();
	var creditsimage = new Image();
	var playerwinimage = new Image();
	var centipedewinimage = new Image();
	////////Positions of Buttons for Menu///////
	var StartpositionX = 540;
	var StartpositionY = 220;
	var ControlspositionX = 490;
	var ControlspositionY =280 ;
	var CreditspositionX =550 ;
	var CreditspositionY = 400;
	var QuitpositionX = 520;
	var QuitpositionY = 340;
	var logox = 320;
	var logoy = 100;
	////////////Background Logic////////
	var backgroundY = 0;
	var speed = 1;
	////////////////////////////////////
	var buttonX = [StartpositionX,ControlspositionX,CreditspositionX,QuitpositionX];
	var buttonY = [StartpositionY,ControlspositionY,CreditspositionY,QuitpositionY];
	var buttonWidth = [140,232,128,192];
	var buttonHeight = [60,60,60,60];
	var shipX = [0,0];
	var shipY = [0,0];
	var shipWidth = 35;
	var shipHeight = 40;
	var shipVisible = false;
	var menuclicked=false;
	var shipSize = shipWidth;
	var shipRotate = 0;
	
	var frames = 60;
    var timerId = 0;
	var fadeId = 0;
	var time = 0.0;
// JavaScript Document

	function SetUpCanvas(){
		canvas = document.getElementById("c");
		context = canvas.getContext('2d');
		canvas.height = HEIGHT;
		canvas.width = WIDTH;
		//canvas.style.left = "500px";
		//canvas.style.top = "100px";
		canvas.style.position = "absolute";
		canvas.background= "transparent";
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function InitGame()
	{
		SetUpCanvas();
		player = new Centipede(300,100,'imgs/c_hn_30.png','imgs/c_bn_30.png','imgs/c_en_30.png');
		backGround = new Background(HEIGHT,'imgs/bg.png');
		ship = new Ship(500,600,40,40,'imgs/ship_b.png');
		//centiFPS = 50;
		//////Menu Scree/////
		shipImage.src = "imgs/ship_b.png";
		bgImage.src = "imgs/bg.png";
		logoImage.src = "imgs/title.png";
		playImage.src = "imgs/start.png";
		instructImage.src = "imgs/controls.png";
		settingsImage.src = "imgs/quit.png";
		creditsImage.src = "imgs/credits.png";
		/////////////////////////////
		//////Screens////////////////
		controlsimage.src = "imgs/controlscreen.png";
		creditsimage.src = "imgs/creditscreen.png";
		playerwinimage.src = "imgs/winnerspaceship.png";
		centipedewinimage.src = "imgs/winnercentipede.png";
		/////////////////////////////////////////////////////////
		audio = new Audio('audio/SpaceIdea.mp3');
		audio.volume = 0.6;
		audio.loop = true;
		audio.play();
		canvas.addEventListener("mousemove", checkPos);
		canvas.addEventListener("mouseup", checkClick);
		
		for (var i = 0; i < numberofsceneObjects; i++) 
		{
			temp=getRandomInt(rows,1280);
			if(i%2==0)
			{
			sceneObjects[i] = new MovableBody(temp,cols,debrisimages[0]);
			}
			else
			{
			sceneObjects[i] = new MovableBody(temp,cols,meteorimages[0]);
			}
			cols=cols+40;
			if(cols>480)
			{
				cols=0;
			}
				
		}
	
		for(i=0;i<numberofsceneObjects;i++)
		{
			sceneObjects[i].Init();
		}
		player.Init();
		backGround.Init();
		ship.Init();
}

	setInterval(function(){
		Update();
		Draw();
	},1000/FPS);

	setInterval(function(){
		player.Move();
	},1000/centiFPS);

	setInterval(function(){
		ship.playAnimation();
		player.playAnimation();
	},1000/10);

	function Update(){
		switch(stateofgame)
		{
		case 0:
				clear();
				move();
				Draw();
				break;
				
		case 1:	
				audio.volume =0.3;
				backGround.update();
				player.update();
				ship.update();
				for(i=0;i<numberofsceneObjects;i++)
				{
					if(sceneObjects[i]!=null && sceneObjects[i].pos_y > HEIGHT){
						sceneObjects[i] = null;
					}
					if(sceneObjects[i]!=null){
					sceneObjects[i].update();
					}
				}
				if(startelapsedTime){
					elapsedTime += (1/FPS);
				}else{
					elapsedTime = 0;
				}
				
				break;
		case 2:
				audio.volume =0.3;
				Draw();
				break;
		case 3:
				audio.volume =0.3;
				Draw();
				break;		
		case 4:
				audio.volume =0;
				Draw();
				break;
		case 5:
				audio.volume =0;
				Draw();
				break;		
		}
	}
	
	function clear() {
		context.clearRect(0, 0, width, height);
	}
	
	function move()
	{
				backgroundY += speed;
				if(backgroundY >= Backgroundheight){
					backgroundY = 0;
				}
				if(shipSize == shipWidth){
					shipRotate = -1;
				}
				if(shipSize == 0){
					shipRotate = 1;
				}
				shipSize += shipRotate;
	}
	
	

	function Draw(){
		switch(stateofgame)
		{
		case 0:
				context.drawImage(bgImage, 0, backgroundY);
				// Draw another image at the top edge of the first image
				context.drawImage(bgImage, 0, backgroundY - Backgroundheight);
				// If the image scrolled off the screen, reset
				if (backgroundY >= Backgroundheight)
					backgroundY = 0;
				//context.drawImage(bgImage, 0, backgroundY);
				context.drawImage(logoImage, logox,logoy);
				context.drawImage(playImage, buttonX[0], buttonY[0]);
				context.drawImage(instructImage, buttonX[1], buttonY[1]);
				context.drawImage(settingsImage, buttonX[2], buttonY[2]);
				context.drawImage(creditsImage, buttonX[3], buttonY[3]);
				if(shipVisible == true){
					context.drawImage(shipImage, shipX[0] - (shipSize/2), shipY[0], shipSize, shipHeight);
					context.drawImage(shipImage, shipX[1] - (shipSize/2), shipY[1], shipSize, shipHeight);
									   }
				break;
		
		case 1:
				context.clearRect(0,0,WIDTH,HEIGHT);
				backGround.draw();
				for (var i = 0; i < numberofsceneObjects; i++) 
				{
					if(sceneObjects[i]!=null) {
						sceneObjects[i].draw();
					}
				}
				player.draw();
				ship.draw();
				break;
		case 2:
				context.clearRect(0,0,WIDTH,HEIGHT);
				context.drawImage(controlsimage, 0,0);
				window.addEventListener("keydown", checkBackspaceKeyPressed, false);
				break;
		case 3:
				context.clearRect(0,0,WIDTH,HEIGHT);
				context.drawImage(creditsimage, 0,0);
				window.addEventListener("keydown", checkBackspaceKeyPressed, false);
				break;
		case 4:
				context.clearRect(0,0,WIDTH,HEIGHT);
				context.drawImage(playerwinimage, 0,0);
				window.addEventListener("keydown", checkEnterKeyPressed, false);
				break;		
		case 5:
				context.clearRect(0,0,WIDTH,HEIGHT);
				context.drawImage(centipedewinimage, 0,0);
				window.addEventListener("keydown", checkEnterKeyPressed, false);
				break;		
		}
	}
	
	function checkBackspaceKeyPressed(e) 
	{
    if (e.keyCode == "8") {
        console.log("The 'Backspace' key is pressed.");
		stateofgame=0;
		window.removeEventListener("keydown", checkBackspaceKeyPressed, false);
						}
	}
	
	function checkEnterKeyPressed(e) 
	{
	if (e.keyCode == "13") {
        console.log("The 'Enter' key is pressed.");
		audio.pause();
		InitGame();
		stateofgame=1;
		window.removeEventListener("keydown", checkEnterKeyPressed, false);
							}						
	}
	function checkPos(mouseEvent)
	{
				if(mouseEvent.pageX || mouseEvent.pageY == 0)
				{
					mouseX = mouseEvent.pageX - this.offsetLeft;
					mouseY = mouseEvent.pageY - this.offsetTop;
					//console.log(mouseX);
					//console.log(mouseY);
				}	else if(mouseEvent.offsetX || mouseEvent.offsetY == 0)
					{
					mouseX = mouseEvent.offsetX;
					mouseY = mouseEvent.offsetY;
					}
					for(i = 0; i < buttonX.length; i++)
					{
						if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i])
						{
						if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i])
							{
							shipVisible = true;
							shipX[0] = buttonX[i] - (shipWidth/2) - 2;
							shipY[0] = buttonY[i] + 2;
							shipX[1] = buttonX[i] + buttonWidth[i] + (shipWidth/2); 
							shipY[1] = buttonY[i] + 2;
							}
						}else{
						shipVisible = false;
							}
					}
		}
	
	
	function checkClick(mouseEvent)
	{
		for(i = 0; i < buttonX.length; i++)
		{
					if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]){
						if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]){
							console.log(mouseX);
							console.log(mouseY);
							console.log("X for The button pressed is" + buttonX[i]);
							console.log("Y for The button pressed is"+ buttonY[i]);
							if(buttonX[i]==StartpositionX && buttonY[i]==StartpositionY)
							{
							console.log("Clicked Start Button");
							stateofgame=1;
							}
							if(buttonX[i]==ControlspositionX && buttonY[i]==ControlspositionY)
							{
							console.log("Clicked Controls Button");
							stateofgame=2;
							}
							if(buttonX[i]==QuitpositionX && buttonY[i]==QuitpositionY)
							{	
							console.log("Clicked Credits Button");
							stateofgame=3;
							}
							if(buttonX[i]==CreditspositionX && buttonY[i]==CreditspositionY)
							{
							console.log("Clicked Quit Button");
							window.close();
							}
							fadeId = setInterval("fadeOut()", 1000/frames);
							clearInterval(timerId);
							canvas.removeEventListener("mousemove", checkPos);
							canvas.removeEventListener("mouseup", checkClick);
						}
					}
		}
	}
	
	
	function fadeOut(){
		context.fillStyle = "rgba(0,0,0, 0.2)";
		context.fillRect (0, 0, width, height);
		time += 0.1;
		if(time >= 2){
			clearInterval(fadeId);
			time = 0;
			timerId = setInterval("Update()", 1000/frames);
			canvas.addEventListener("mousemove", checkPos);
			canvas.addEventListener("mouseup", checkClick);
		}
	}

	function DebugLog(debugtext){
		document.getElementById("debug").innerHTML = debugtext;
	}
	
	var TO_RADIANS = Math.PI/180; 
	function drawRotatedImage(image, x, y, angle) { 
	 
		// save the current co-ordinate system 
		// before we screw with it
		context.save(); 
	 
		// move to the middle of where we want to draw our image
		context.translate(x, y);
	 
		// rotate around that point, converting our 
		// angle from degrees to radians 
		context.rotate(angle * TO_RADIANS);
	 
		// draw it up and to the left by half the width
		// and height of the image 
		context.drawImage(image, -(image.width/2), -(image.height/2));
	 
		// and restore the co-ords to how they were when we began
		context.restore(); 
	}