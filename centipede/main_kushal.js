// JavaScript Document
	var canvas,context;
	var WIDTH = 1280; 
	var HEIGHT = 720;
	var rows=0;
	var cols=0;
	var FPS = 60;
	var player,backGround,ship;
	var obj1,obj2;
	var max,min;
	var sceneObjects = [];

	var numberofsceneObjects = 75;
	var elapsedTime=0;
	var startelapsedTime = false;
    var debrisimages = ['imgs/debris_40_1.png','imgs/debris1.png','imgs/debris2.png'];
	var meteorimages = ['imgs/debris_40_2.png','imgs/meteor1.png','imgs/meteor2.png'];
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

	function InitGame(){
		SetUpCanvas();
		player = new Centipede(300,100,'imgs/c_hn_30.png','imgs/c_bn_30.png','imgs/c_en_30.png');
		backGround = new Background(HEIGHT,'imgs/bg.png');
		ship = new Ship(500,600,40,40,'imgs/ship_b.png');
		
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
	},1000/15);

	setInterval(function(){
		ship.playAnimation();
		player.playAnimation();
	},1000/10);

	function Update(){
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

	}

	function Draw(){
		context.clearRect(0,0,WIDTH,HEIGHT);
		backGround.draw();
		
		for(i=0;i<numberofsceneObjects;i++)
		{
			if(sceneObjects[i]!=null){
			sceneObjects[i].draw();
			//sceneObjects[i].getCollider().draw();
			}
		}
		player.draw();
		ship.draw();

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
	
