var fft;
var maxSpectrum = 128; //spectrum.length

var maxX = 800;
var maxY = 500;

var socket = io();

var right_x_ness;
var right_y_ness;
var right_z_ness;

var lines = []; // empty array of lines

function preload() {
  mySound = loadSound('assets/birthday.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  mySound.setVolume(0.1);
  mySound.play();
  
  //fft
  fft = new p5.FFT();
  fft.setInput(mySound);
  
  //amplitude
  analyzer = new p5.Amplitude();
  analyzer.setInput(mySound);
  
  colorMode(HSB);
  
}

function draw() {
  background(0);
  var spectrum = fft.analyze();
  var rms = analyzer.getLevel();

  socket.on('osc', function(msg){
        //var key = msg["address"];
        right_x_ness = msg[4];
        right_y_ness = msg[5];
        right_z_ness = msg[6];
  });

  lines.push(new Line(map(right_x_ness, 0, maxX, 0, windowWidth), map(right_y_ness, 0, maxY, 0, windowHeight)));
  
  for (var i = 0; i < lines.length; i++) {
    stroke(map(spectrum[i], 0, 128, 0, 255), map(spectrum[i], 0, 128, 97, 255), 255);
    fill(spectrum[i], 128, 128);
    strokeWeight(2);
    lines[i].grow(spectrum[i]);
    lines[i].display();
  }
  
  if (lines.length > 128) { //rms
    lines.splice(0, 1);
  }
  
  strokeWeight(8);
  line(map(right_x_ness, 0, maxX, 0, windowWidth), map(right_y_ness, 0, maxY, 0, windowHeight), map(right_x_ness, 0, maxX, 0, windowWidth), map(right_y_ness, 0, maxY, 0, windowHeight)-spectrum[0]/2);
}

function Line(xin, yin) {
  
  this.x = xin;
  this.y = yin;
  this.yheight = 100;
  
  this.grow = function(heightin) {
    this.yheight = heightin*2;
  }
  
  this.display = function() {
    // draw line to screen
    line(this.x, this.y, this.x, this.y-(this.yheight/2));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}