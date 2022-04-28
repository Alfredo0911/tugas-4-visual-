let vs = []
function setup (){
  createCanvas( 600, 400);
  v =new Vehicle ( 200, 200);
}

function draw (){
   background(32 ,32 ,32);
  
  v.display()
  v.edges()
  v.update();
  v.wander();

}

class Vehicle{
  constructor(x,y){
    this.location = createVector(x,y);
    this.velocity = createVector(1,0);
    this.acceleration = createVector(0,0);
    this.l = 30;
    this.maxspeed = 1;
    this.maxforce = 0.01;
    this.wanderTheta = PI/2;
  }
  
  wander(){
    let projVector = this.velocity.copy();
    projVector.setMag(100);
    let projPoint = projVector.add(this.location);
    
    let wanderRadius = 20;
    let theta = this.wanderTheta + this.velocity.heading();
    let xBar = wanderRadius * cos(theta);
    let yBar = wanderRadius * sin(theta);
    
    let wanderPoint = p5.Vector.add(projPoint, createVector(xBar, yBar));
    
    let debug = true;
    
    if (debug){
      push()
      fill(32, 32, 32);
      stroke('0')
      line(this.location.x, this.location.y, projPoint.x, projPoint.y)
      stroke('0');
      circle(projPoint.x, projPoint.y, 30);
      noFill();
      stroke('0');
      circle(projPoint.x, projPoint.y, wanderRadius*2);
      
      line(this.location.x, this.location.y, wanderPoint.x, wanderPoint.y)
      stroke('#00BCD4')
      fill('#00BCD4')
      circle(wanderPoint.x, wanderPoint.y, 16);
      pop()
    }
    
    let steeringForce = wanderPoint.sub(this.location);
    steeringForce.setMag(this.maxforce);
    this.applyForce(steeringForce);
    
    this.wanderTheta += random(-0.5, 0.5);
  }
  
  seek(vektorTarget){
    // percieve target location 
    var desired = p5.Vector.sub(vektorTarget, this.location);
    desired.normalize();
    desired.mult(this.maxspeed);
    
    //kemudi
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }
  
  arrive(vektorTarget){
    // percieve target location
    var desired = p5.Vector.sub(vektorTarget, this.location);
    var jarak = desired.mag()

    if (jarak < 100){
      var m = map(jarak, 0, 100, 0, this.maxspeed);
      desired.normalize();
      desired.mult(m);
    }
    else{
      desired.normalize();
      desired.mult(this.maxspeed);    
    }
    
    //kemudi
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }
  
  update(){
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }
  applyForce(force){
    this.acceleration.add(force);
  }
  display(){
    var theta = this.velocity.heading()// + PI/2;
    push();
    noStroke();
    translate(this.location.x, this.location.y)
    rotate(theta)
    stroke('white');
    fill('yellow')
    arc(1,1,70,70,radians(30),radians(310))
    pop();
  }

  edges() {
    if (this.location.x > width + 10) {
      this.location.x = -10;
    } else if (this.location.x < -10) {
      this.location.x = width + 10;
    }
    if (this.location.y > height + 10) {
      this.location.y = -10;
    } else if (this.location.y < -10) {
      this.location.y = height + 10;
    }
  }
}