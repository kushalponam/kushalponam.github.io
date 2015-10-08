//setting up variables....
var xv = 0;
var yv = 0;
var xpos = 200;
var ypos = 200;

var keys = [];

var keyPressed = function() { 
  keys[keyCode] = true;
};
 
var keyReleased = function() { 
  keys[keyCode] = false; 
};

//Now for the function.
var draw = function() {
    background(0, 0, 0); //background is kept black
    fill(255, 255, 255); //fill white
    ellipse(xpos, ypos, 30, 30); //moves the circle
    if (keyIsPressed && keys[UP]) { //this checks if up arrow is pressed
        yv = yv - 1;
    }
    if (keyIsPressed && keys[DOWN]) {
        yv = yv + 1;
    }
    if (keyIsPressed && keys[LEFT]) {
        xv = xv - 1;
    }
    if (keyIsPressed && keys[RIGHT]) {
        xv = xv + 1;
    }
    xv = xv * 0.9; //slowing it down
    yv = yv * 0.9;
    xpos += xv; //setting the positions to the positions + movement
    ypos += yv;
};// JavaScript Document