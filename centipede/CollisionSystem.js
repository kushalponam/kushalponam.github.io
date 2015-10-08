// JavaScript Document

BoundingBox = function(x,y,width,height){
	
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.CollidingObject;
	
	this.Collide = function(box){
		
	 if( this.x < (box.x+box.width)   &&
	    (this.x + this.width) > box.x &&
		 this.y < (box.y+box.height)  &&
		(this.y + this.height) > box.y){
	
			this.CollidingObject = box;
			return true;
		}
		this.CollidingObject = null;
	  return false;	
	}
	
	this.update = function(i_x,i_y){
		this.x = i_x;
		this.y = i_y;
	}	
	
	this.draw = function(){
		context.fillStyle = "#FFFFFF";
		context.fillRect(this.x,this.y,this.width,this.height);
	}
}
