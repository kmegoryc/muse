var socket = io();

//var light = 0;
var left_z_ness;
var left_x_ness;
var left_y_ness;
var right_x_ness;
var right_y_ness;
var right_z_ness;
var z_scale = 2;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    strokeWeight(2);
    stroke('white');
    fill('lightblue');
    c = 0;
    x = 250;
    y = 250;
    r = 100;

    //register to receive data updates, 
    //when we get data, dataReceived will get called automatically
    socket.on('osc', function(msg){
        //var key = msg["address"];
        left_x_ness = msg[1];
        left_y_ness = msg[2];
        left_z_ness = msg[3];
        right_x_ness = msg[4];
        right_y_ness = msg[5];
        right_z_ness = msg[6];
        dataReceived(left_x_ness, left_y_ness, left_z_ness, right_x_ness, right_y_ness, right_z_ness);
    });
}

function dataReceived(leftx, lefty, leftz, rightx, righty, rightz){
    console.log("left x_ness:" + leftx);
    console.log("left y_ness:" + lefty);
    console.log("left z_ness:" + leftz)
    console.log("right x_ness:" + rightx);
    console.log("right y_ness:" + righty);
    console.log("right z_ness:" + rightz);
}

function draw() {
    background(0);

    //left hand ellipse
    ellipse((map(left_x_ness, 0, 1000, 0, windowWidth)), (map(left_y_ness, 0, 1000, 0, windowHeight)), left_z_ness*z_scale, left_z_ness*z_scale);  

    //right hand ellipse
    ellipse((map(right_x_ness, 0, 1000, 0, windowWidth)), (map(right_y_ness, 0, 1000, 0, windowHeight)), right_z_ness*z_scale, right_z_ness*z_scale);  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}