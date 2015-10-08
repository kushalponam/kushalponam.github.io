// JavaScript Document

Node = function(){
	
	this.pos_x = 0;
	this.pos_y = 0;
	this.lastpos_x = 0;
	this.lastpos_y = 0;
	this.rotateAngle = 0;
	this.Colliding = false;
	this.CollidingWeakPoint = false;
	this.active = false;
	this.health = 5;
	this.base_Image=new Image();
	this.collider = new BoundingBox(0,0,0,0);
	this.colliderInit = function(i_x,i_y,width,height){
		this.collider.x = i_x;
		this.collider.y = i_y;
		this.collider.width = width;
		this.collider.height = height;
		
	}
	
	this.getCollider = function(){
		
		return this.collider;
	}
	
}

function Centipede(i_posx,i_posy,headimage,bodyimage,tailimage){
	var width = 30;
	var height = 30;

	var movementSpeed = 5;
	var spacebetweenNodes = 30;
	var centilength = 10;
	var Nodes = [];
	var pushObject = null;
	var CollidingObject = null;
	var playanimation = false;
	var numberofSprite = 0;
	var animationImagesSrc = ['imgs/centi_a_1.png','imgs/centi_a_2.png','imgs/centi_a_3.png','imgs/centi_a_4.png','imgs/centi_a_5.png'];
	
	this.getNodes = function(){
		return Nodes;
	}
	
	this.Init = function(){
		this.playanimation = false;
		this.numberofSprite = 0;
		this.centilength = 10;
		this.hitPoints = this.centilength;
		for(i=0; i<centilength ;i++)
		{
			Nodes[i] = new Node();
		}
		Nodes[0].base_Image.src=headimage;
		Nodes[0].pos_x = i_posx;
		Nodes[0].pos_y = i_posy;
		Nodes[0].colliderInit(Nodes[0].pos_x,Nodes[0].pos_y,spacebetweenNodes,spacebetweenNodes);
		Nodes[0].lastpos_x = Nodes[0].pos_x ;
		Nodes[0].lastpos_y = Nodes[0].pos_y ;
		Nodes[0].active = true;
		Nodes[0].health = 1;
		for(i=1;i<centilength;i++)
		{
			Nodes[i].base_Image.src=bodyimage;
			Nodes[i].pos_x = Nodes[i-1].pos_x - spacebetweenNodes;
			Nodes[i].pos_y = Nodes[i-1].pos_y ;
			Nodes[i].colliderInit(Nodes[i].pos_x,Nodes[i].pos_y,spacebetweenNodes,spacebetweenNodes);
			Nodes[i].lastpos_x = Nodes[i].pos_x ;
			Nodes[i].lastpos_y = Nodes[i].pos_y ;
		}
		Nodes[centilength-1].base_Image.src = tailimage;
		
		Nodes[0].rotateAngle = -90;
		for(i=1; i<centilength ;i++)
		{
			Nodes[i].rotateAngle = -90;
		}
	}
	
	var direction= {
		up:0,
		down:1,
		left:2,
		right:3,
	};
	var dir;
	
	this.update = function(){
        if(this.playanimation) return;
		if(Nodes[0].health<0){
			this.playanimation = true;
			//Nodes[0].active = false;
			var audio = new Audio('audio/centideath.mp3');
			audio.volume =0.5;
			audio.play();
			setTimeout(function(){ 
			stateofgame=4; 
			}, 1000);
		}
		this.CheckCollision();
		this.CheckCollisionWithWeakPoints();
		
	}
	
	
	
	this.Move = function()
	{
		 if(this.playanimation) return;
		 if(keydown.space && Nodes[0].CollidingWeakPoint){
			   
			   if(pushObject!=null){
			  // pushObject.setTargetDirection(ship);  
			   pushObject.MoveBody = true;
			   }
			    var audio = new Audio('audio/centifire.wav');
				audio.volume =1;
				audio.play();
			   //console.log(pushObject.MoveBody);
			   //pushObject = null;
		 }else if(keydown.d) {
			 this.AdjustOnCollision(); 
			 if(Nodes[0].Colliding && dir==direction.right) return;
			  	
			  Nodes[0].lastpos_x =  Nodes[0].pos_x;
			  Nodes[0].lastpos_y =  Nodes[0].pos_y;
			  Nodes[0].pos_x += spacebetweenNodes;
			  Nodes[0].getCollider().update(Nodes[0].pos_x,Nodes[0].pos_y);
			  dir = direction.right;

		 }else if(keydown.w) {
               this.AdjustOnCollision();
			 if(Nodes[0].Colliding && dir==direction.up) return;
               
			  Nodes[0].lastpos_x =  Nodes[0].pos_x;
			  Nodes[0].lastpos_y =  Nodes[0].pos_y;
			  Nodes[0].pos_y -= spacebetweenNodes;
			  Nodes[0].getCollider().update(Nodes[0].pos_x,Nodes[0].pos_y);
			  dir = direction.up;
		 }else if(keydown.s){
			  this.AdjustOnCollision();
			  if(Nodes[0].Colliding && dir==direction.down) return;
			  
			   Nodes[0].lastpos_x =  Nodes[0].pos_x;
			   Nodes[0].lastpos_y =  Nodes[0].pos_y;
			   Nodes[0].pos_y += spacebetweenNodes;
			   Nodes[0].getCollider().update(Nodes[0].pos_x,Nodes[0].pos_y);
			   dir = direction.down;
		 }else if(keydown.a)
		 {
			  this.AdjustOnCollision();
			  if(Nodes[0].Colliding && dir==direction.left) return;
			  
			  Nodes[0].lastpos_x =  Nodes[0].pos_x;
			  Nodes[0].lastpos_y =  Nodes[0].pos_y;
			  Nodes[0].pos_x -= spacebetweenNodes;
			  Nodes[0].getCollider().update(Nodes[0].pos_x,Nodes[0].pos_y);
			  dir = direction.left;
		 }
		 
		 
		 if(keydown.d || keydown.w || keydown.s||keydown.a){  // Move the tail objects
			 for(i=1;i<centilength;i++)
			  {
				if(Nodes[i]!=null){
					Nodes[i].lastpos_x = Nodes[i].pos_x;
					Nodes[i].lastpos_y = Nodes[i].pos_y;
					
					var orientationX = (Nodes[i].pos_x - Nodes[i-1].lastpos_x);
					var orientationY = (Nodes[i].pos_y - Nodes[i-1].lastpos_y);
					
					if(orientationX == 0){ // going up or down
						if(Math.sign(orientationY)<0){
							Nodes[i].rotateAngle = 0; 
						}else{
							Nodes[i].rotateAngle = -180; 
						}
						
					}else if(orientationY == 0){ // going left or right
						if(Math.sign(orientationX)<0){
							Nodes[i].rotateAngle = -90;
						}else {
							Nodes[i].rotateAngle = 90;
						}
						
					}
					
					Nodes[i].pos_x = Nodes[i-1].lastpos_x;
					Nodes[i].pos_y = Nodes[i-1].lastpos_y;
					Nodes[i].getCollider().update(Nodes[i].pos_x,Nodes[i].pos_y);
				  }
			  }
		 }
		 
	}
	
	this.AdjustOnCollision = function(){
		
		switch(dir){
			case direction.up:
				 Nodes[0].rotateAngle =-180;
			     if(Nodes[0].Colliding && Nodes[0].getCollider().CollidingObject!=null){
			     var distancey = Math.abs((Nodes[0].pos_y) - (Nodes[0].getCollider().CollidingObject.y+spacebetweenNodes));
				  Nodes[0].pos_y += distancey;
				 }
			break;
			
			case direction.left:
			     Nodes[0].rotateAngle = 90;
				if(Nodes[0].Colliding && Nodes[0].getCollider().CollidingObject!=null){
			      var distancex = Math.abs((Nodes[0].pos_x) - (Nodes[0].getCollider().CollidingObject.x + spacebetweenNodes));
				  Nodes[0].pos_x += distancex ;
				}
			
			break;
			case direction.right:
			   Nodes[0].rotateAngle = -90;
			  if(Nodes[0].Colliding && Nodes[0].getCollider().CollidingObject!=null){
				  var distancex = Math.abs((Nodes[0].pos_x+spacebetweenNodes) - Nodes[0].getCollider().CollidingObject.x);
				  Nodes[0].pos_x -= distancex ;
			  }
			break;
			case direction.down:
			 Nodes[0].rotateAngle = 0;
			if(Nodes[0].Colliding && Nodes[0].getCollider().CollidingObject!=null){
			      var distancey = Math.abs((Nodes[0].pos_y+spacebetweenNodes) - Nodes[0].getCollider().CollidingObject.y);
				  Nodes[0].pos_y -= distancey ;
			}
			break;
			default:
			break;
		}
		
		
	}
	
	this.playAnimation = function(){
		if(!Nodes[0].active) return;
		if(this.playanimation){
			if(this.numberofSprite >= animationImagesSrc.length){
					this.numberofSprite=0;
					Nodes[0].active = false;
			}
			for(i=0;i<Nodes.length;i++){
				Nodes[i].base_Image.src = animationImagesSrc[this.numberofSprite];
			}
			this.numberofSprite++;
			
		}else
		{
			this.numberofSprite=0;
		}
	} 
	
	this.draw = function(){
		if(!Nodes[0].active) return;
		drawRotatedImage(Nodes[0].base_Image, Nodes[0].pos_x+(spacebetweenNodes/2), Nodes[0].pos_y+(spacebetweenNodes/2),  Nodes[0].rotateAngle);
		for(i=1;i<centilength;i++)
		{
			//context.drawImage(Nodes[i].base_Image,Nodes[i].pos_x,Nodes[i].pos_y,width,height);
			if(Nodes[i]!=null)drawRotatedImage(Nodes[i].base_Image, Nodes[i].pos_x+(spacebetweenNodes/2), Nodes[i].pos_y+(spacebetweenNodes/2), Nodes[i].rotateAngle);
			//Nodes[].getCollider().draw();
		}
		
	}
	
	this.CheckCollision = function()
	{
		////////////////////////////////////BLOCK Centipede UP and Down////////////////////////////////////////////////
		  if(Nodes[0].pos_y < 0){
			 Nodes[0].pos_y = 0;
		 }else if(Nodes[0].pos_y+height > HEIGHT){
			 Nodes[0].pos_y = HEIGHT-height;
		 }
		 ///////////////////////////////////Worm hole effect//////////////////////////////////////////////
		 if(Nodes[0].pos_x<0){
			 Nodes[0].pos_x = WIDTH;
		 }else if(Nodes[0].pos_x>WIDTH){
			 Nodes[0].pos_x = 0;
		 }
		//////////////////////////////////// Head Collision with Scene Objects///////////////////////////////////////////////////////////
			for(j=0;j<sceneObjects.length;j++){
				if( sceneObjects[j]!=null && Nodes[0].getCollider().Collide(sceneObjects[j].getCollider()))
				{
					Nodes[0].Colliding = true;
					DebugLog("YAY");					
					return true;
				}else
				{
					Nodes[0].Colliding = false;
				}		
			}
		
		DebugLog("NOPE");
		return false;
	}
	
	this.CheckCollisionWithWeakPoints = function(){
	   /////////////////////////////////////////HEAD collision with Scene Objects weak point//////////////////////////////	
			for(j=0;j<sceneObjects.length;j++){
				if( sceneObjects[j]!=null && Nodes[0].getCollider().Collide(sceneObjects[j].getWeakPoint()))
				{
					DebugLog("YAYW");
					Nodes[0].CollidingWeakPoint = true;
					pushObject = sceneObjects[j];	
					return true;
				}else
				{
					pushObject =null;
					Nodes[0].CollidingWeakPoint = false;
				}
			}
			return false;
	}
	
	
	this.ShiftTailtoEmptySpot = function(spot){
		
		for(i=spot;i<Nodes.length-1;i++)
		{
			//if(Nodes[i]==null){console.log(''+'empty spot at'+i);}
			if(Nodes[i+1]!=null){
			 Nodes[i]=Nodes[i+1];
			}
		}
		
		
	}
	
}