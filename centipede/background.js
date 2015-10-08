function Background(height,image){
	
	this.Init = function(){
		this.x =0;
		this.y =0;
		this.speed = 1/2;
		this.canvasHeight = 2160;
		base_Image = new Image();
		base_Image.src = image;
	}
	
	this.update = function(){
	  
	  this.y += this.speed;
	  if (this.y >= this.canvasHeight)
			this.y = 0;
	}
	
	this.draw = function(){
		// Pan background
		context.drawImage(base_Image, this.x, this.y);
		
		// Draw another image at the top edge of the first image
		context.drawImage(base_Image, this.x, this.y - this.canvasHeight);

		// If the image scrolled off the screen, reset
		if (this.y >= this.canvasHeight)
			this.y = 0;
	};
	
}