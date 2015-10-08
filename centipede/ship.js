Ship = function(i_x,i_y,width,height,image){
	
	this.x = i_x;
	this.y = i_y;
	this.width = width;
	this.height = height;
	
	this.speed = 10;
	this.bulletspeed=20;
	this.bulletPool = new Pool(8);
	this.bulletPool.init();
    
	this.CentipedeInShipZone = false;
	var fireRate = 10;
	var counter = 0;
	var health = 5;
	var animationImagesSrc = ['imgs/ship_a_1.png','imgs/ship_a_2.png','imgs/ship_a_3.png','imgs/ship_a_4.png','imgs/ship_a_5.png'];
	this.spaceshipImage = new Image();
	var Body;
	var active=false;
	var playanimation = false;
	var animelapsedTime=0;
	var numberofSprite=0;
	this.Init = function(){
		this.active = true;
		this.playanimation = false;
		this.health = 1;
		this.CentipedeInShipZone = false;
		this.animelapsedTime = 0;
		this.numberofSprite = 0;
		this.spaceshipImage.src = image;
		this.canvasWidth = canvas.width;
		this.canvasHeight =canvas.height;
		this.Body = new BoundingBox(this.x,this.y,this.width,this.height);
	};
	
	this.fire = function() {
		if(!this.CentipedeInShipZone){
			this.bulletPool.getTwo(this.x+6, this.y, this.bulletspeed,
		                       this.x+20, this.y, this.bulletspeed);
		}else{//////////// if centipede enters ship zone then fire bullets in sideways
			this.bulletPool.getTwo(this.x,this.y,-this.bulletspeed,
								   this.x+30,this.y,this.bulletspeed,this.CentipedeInShipZone);
		}
	};
	
	this.update = function(){
		if(this.playanimation)return;
		counter++;
			if (keydown.left) {
				this.x -= this.speed 
				if (this.x <= 0) // Keep player within the screen
					this.x = 0;
			} else if (keydown.right) {
				this.x += this.speed
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			} else if (keydown.up) {
				this.y -= this.speed
				if (this.y <= this.canvasHeight/4*3)
					this.y = this.canvasHeight/4*3;
			} else if (keydown.down) {
				this.y += this.speed
				if (this.y >= this.canvasHeight - this.height)
					this.y = this.canvasHeight - this.height;
			}
		this.Body.update(this.x,this.y);
		
		if (keydown.insert && counter >= fireRate) {
			this.fire();
			var audio = new Audio('audio/laserfire01.wav');
			audio.volume = 0.5;
			audio.play();
			counter = 0;
		}
		this.CheckCollision();
		
	}
	
	this.CheckCollision = function(){
		//////////////////////////////SHIP Collision With Centipede///////////////////////////////////////////////
			if(this.active && this.Body.Collide(player.getNodes()[0].getCollider())){
				this.health--;
			}
		///////////////////////////////CHECK IF Centipede is in ship zone/////////////////////////////////////////
		    if(this.active && player.getNodes()[0].pos_y >= this.canvasHeight/4*3){
				this.CentipedeInShipZone = true;
			}else{
				this.CentipedeInShipZone = false;
			}
		
		
		//////////////////////////////SHIP Collision WITH DEBRIS//////////////////////////////////////////////////
		for(i=0;i<sceneObjects.length;i++){
			if(sceneObjects[i]!=null &&this.Body.Collide(sceneObjects[i].getCollider())){
				sceneObjects[i]=null;
				this.health--;
				console.log(this.health);
				return;
			}
		}
		if(this.health<0){
			this.playanimation = true;
			var audio = new Audio('audio/Ship_Explosion.mp3');
			audio.volume = 0.5;
			audio.play();
			setTimeout(function(){ 
			stateofgame=5; 
			}, 1000);
			//this.active = false;
		}
	}
	this.playAnimation = function(){
		if(!this.active) return;
		
		if(this.playanimation){
				if(this.numberofSprite >= animationImagesSrc.length){
					this.numberofSprite=0;
					this.active = false;
				}
				this.spaceshipImage.src = animationImagesSrc[this.numberofSprite];
				this.numberofSprite++;
		}else
		{
			this.numberofSprite=0;
		}
	} 
	
	this.draw = function(){
		if(!this.active) return;
		context.drawImage(this.spaceshipImage, this.x, this.y);
		this.bulletPool.animate();
		//this.Body.draw();
	};
	
}

function Pool(maxSize) {
	var size = maxSize; // Max bullets allowed in the pool
	var pool = [];
    var bulletCounter = 0;

	this.init = function() {
		for (var i = 0; i < size; i++) {
			// Initalize the bullet object
			var bullet = new Bullet();
			bullet.init(0,0, 40,40);
			pool[i] = bullet;
		}
	};
	
	this.get = function(x, y, speed,centiInShipZone) {   // Grabs the last item in the list and initializes it and pushes it to the front of the array.
		if(bulletCounter< (pool.length) ){
			pool[bulletCounter].spawn(x,y,speed,centiInShipZone);
			bulletCounter++;
		}

	};
	
	/*
	 * Used for the ship to be able to get two bullets at once. If
	 * only the get() function is used twice, the ship is able to
	 * fire and only have 1 bullet spawn instead of 2.
	 */
	this.getTwo = function(x1, y1, speed1, x2, y2, speed2,centiInShipZone) {
		     this.get(x1, y1, speed1,centiInShipZone);
			 this.get(x2, y2, speed2,centiInShipZone);

	};
	
	/*
	 * Draws any in use Bullets. If a bullet goes off the screen,
	 * clears it and pushes it to the front of the array.
	 */
	this.animate = function() {
		for (var i = 0; i < size; i++) {
			// Only draw until we find a bullet that is not alive
			if(pool[i].alive){
				pool[i].update();
				pool[i].draw();
			}
			if(bulletCounter == pool.length){
				startelapsedTime = true;
				//console.log(''+elapsedTime);   
				if(elapsedTime>=(1/2)){
					bulletCounter = 0;
					startelapsedTime = false;
				}
			}

		}
	};
}

function Bullet() {	
	this.alive = false; // Is true if the bullet is currently in use
	this.bulletImage = new Image();
	this.bulletImage.src = "imgs/bullet.png";
	var hitcount=0;
	this.CentiInShipZone = false;
	/*
	 * Sets the bullet values
	 */
	 var collider;
	  
	 this.getCollider = function(){
		return collider;
	}

	 this.init =function(x,y,width,height){
		 this.x=x;
		 this.y=y;
		 this.width=width;
		 this.height=height;
	 };
	this.spawn = function(x, y, speed,centiInShipZone) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
		this.CentiInShipZone = centiInShipZone; 
		if(this.CentiInShipZone){
			this.bulletImage.src = "imgs/bulletc.png";
		}else{
			this.bulletImage.src = "imgs/bullet.png";
		}
		this.collider = new BoundingBox(this.x,this.y,this.width/3,this.height);

	};

	this.update = function() {
		if(this.CentiInShipZone){
			this.x += this.speed;
		}else{
			this.y -= this.speed;
		}
		
		this.collider.update(this.x,this.y);
		this.CheckCollision();

	};
	this.draw = function(){
		
		if(this.CentiInShipZone){
			if(Math.sign(this.speed)<0){
				drawRotatedImage(this.bulletImage,this.x,this.y+20,180);
			}else{
				context.drawImage(this.bulletImage, this.x, this.y);
			}
		}else{
			context.drawImage(this.bulletImage, this.x, this.y);
		}
	}
	
	this.CheckCollision = function(){
		/////////////////////////////////////////// BULLET COLLISION WITH WALLS AND DEBRIS///////////////////////////////////////////////////////////////////
		if (this.y <= 0 || this.x<=0 || this.x>= WIDTH) {	
			this.alive = false;
			return;
		}
		for(i=0;i<sceneObjects.length;i++){
			
			if(sceneObjects[i]!=null && this.collider.Collide(sceneObjects[i].getCollider())){
				sceneObjects[i].hitcount++;
				console.log(sceneObjects[i].hitcount);
				if(sceneObjects[i].hitcount>=3)
				{
				sceneObjects[i] = null;				
				}
				else {
					if(i%2==0)
					{
						sceneObjects[i].base_Image.src=debrisimages[sceneObjects[i].hitcount];
					}
					else
					{
						sceneObjects[i].base_Image.src=meteorimages[sceneObjects[i].hitcount];
					}
				}
				this.alive = false;
			}
		}
		/////////////////////////////////////////////BULLET COLLSION WITH CENTI///////////////////////////////
		if(player.getNodes()[0].active && this.collider.Collide(player.getNodes()[0].getCollider())){
				player.getNodes()[0].health--;
				console.log('Centi health '+player.getNodes()[0].health);
				this.alive = false;
		}
		
		for(i=1;i<player.getNodes().length;i++)
		{
			if( player.getNodes()[i]!=null && this.collider.Collide(player.getNodes()[i].getCollider()))
			{
				player.getNodes()[i] = null;
				player.ShiftTailtoEmptySpot(i);
				this.alive = false;
				break;
			}	
		}
		
		
	}

	
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
		this.collider = null;
	};
}
//Bullet.prototype = new Drawable();
