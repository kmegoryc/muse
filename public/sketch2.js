/*
Noisy rainbow

Controls:
	- Move the mouse along the lines to interact with it.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var socket = io();

var maxX;
var maxY;

var right_x_ness;
var right_y_ness;
var right_z_ness;

var steps = 5;
var restSize = 3;

var allParticles = [];
var t;
var globalHue = 0;


function Particle(x, y) {
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
  
  this.target = new p5.Vector(x, y);
  this.h = globalHue;
  
  globalHue += 1;
  if (globalHue > 255) {
    globalHue = 0;
  }
  
  this.move = function() {
    // Shift particle to the left.
    this.pos.x -= 1;
    this.target.x -= 1;
    
    var d = dist(right_x_ness, right_y_ness, this.pos.x, this.pos.y);
    
    // Resolve collision with mouse.
    if (d < 200) {
      var mousePos = new p5.Vector(right_x_ness, right_y_ness);
      
      var vec = new p5.Vector(this.pos.x, this.pos.y);
      vec.sub(mousePos);
      vec.normalize();
      vec.mult(0.6);
      this.acc.add(vec);
    }
    
    // Seek its original position.
    var seek = new p5.Vector(this.target.x, this.target.y);
    seek.sub(this.pos);
    seek.normalize();
    
    var targetDist = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
    if (targetDist < 5) {
      // When it gets close enough, decrease the multiplier so it can settle!
      seek.mult(0.5*map(targetDist, 5, 0, 1, 0));
    } else {
      seek.mult(0.5);
    }
    
    this.acc.add(seek);
    
    // Add some drag.
    this.vel.mult(0.95);
    
    // Move it.
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  colorMode(HSB, 255);
  
  textAlign(CENTER);
  textSize(16);
  
  t = width;
  
  // Spawn particles along the screen's width.
  for (var x = 0; x < width; x += steps) {
    var y = height/4+noise(x*0.005)*500;
    allParticles.push(new Particle(x, y));
  }
} 


function draw() {
  background(50);

  socket.on('osc', function(msg){
        //var key = msg["address"];
        right_x_ness = msg[4];
        right_y_ness = msg[5];
        right_z_ness = msg[6];

        /*if(right_x_ness > maxX) {
          maxX = right_x_ness;
        }
        if(right_y_ness > maxY) {
          maxY = right_y_ness;
        }

        console.log("MaxX: "  + maxX);
        console.log("MaxY: "  + maxY);*/
  });

  ellipse(right_x_ness, right_y_ness, right_z_ness, right_z_ness);
  
  for (var i = 0; i < allParticles.length; i++) {
    allParticles[i].move();
    
    // Draw lines.
    if (i > 0) {
      var d = dist(allParticles[i].pos.x, allParticles[i].pos.y, 
                   allParticles[i].target.x, allParticles[i].target.y);
      
      // The further away it's from its target, the more it's saturated and bigger.
      stroke(allParticles[i].h, d*10, 255);
      strokeWeight(min(1+d*0.1, 7));
      
      line(allParticles[i].pos.x, allParticles[i].pos.y, 
           allParticles[i-1].pos.x, allParticles[i-1].pos.y);
    }
    
    // Delete the particle if it's out of bounds.
    if (allParticles[i].pos.x < 0) {
      allParticles.splice(i, 1);
    }
  }
  
  // Spawn a new particle.
  if (t % steps == 0) {
    var y = height/4+noise(t*0.005)*500;
    allParticles.push(new Particle(width, y));
  }
  t += 1;
  
  noStroke();
  fill(255);
  text("Move your hand over the lines", width/2, 100);
}