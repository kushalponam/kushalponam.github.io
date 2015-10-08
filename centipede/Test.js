// JavaScript Document

function MovableBody(i_pos_x,i_pos_y,image){
	
	var Body;
	var WeakPoint;
	var MoveBody = false;
	var hitcount;
	var direction;
	this.getCollider = function(){
		return this.Body;
	}
	this.getWeakPoint = function(){
		return this.WeakPoint;
	}
	
	this.Init = function(){
		this.pos_x = i_pos_x;
		this.pos_y = i_pos_y;
		this.hitcount = 0;
		this.direction = 0;
		this.base_Image = new Image();
		this.base_Image.src = image;
		this.Body = new BoundingBox(this.pos_x,this.pos_y,30,30);
		this.WeakPoint = new BoundingBox(this.pos_x,this.pos_y,30,30);
	}
	
	this.update = function(){
	  if(this.MoveBody){
		  this.setTargetDirection(ship);
		  this.pos_x += ((this.direction)/40);
		  this.pos_y += 10;
	  }
	  this.Body.update(this.pos_x,this.pos_y);
	  this.WeakPoint.update(this.pos_x,this.pos_y);
	  //this.CheckCollision();
	}
	
	this.setTargetDirection = function(target){
		this.direction = target.x - this.pos_x;
		
	}
	
	this.draw = function(){
		context.drawImage(this.base_Image,this.Body.x,this.Body.y,30,30);
		//this.WeakPoint.draw();
	}
	
}