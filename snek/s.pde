PFont myfont;
Snake s1;
Snake s2;
boolean gameOver = false;
boolean pause = false;
int scl = 20; //scale = pixel size of snake elements
int score = 0;
PVector food1;
PVector food2;
void printS() {
    fill(#F4F59E);
    textFont(myfont);
    textAlign(CENTER, CENTER);
    text("Game Over \n Your Score:" + score + "\n Press enter to continue",width/2,height/2);
}
void setup() 
{
  myfont = loadFont("OCRAExtended-48.vlw");
  size(1200, 625);
  s1 = new Snake(0, 0, 0, 0, 600, 600);
  s2 = new Snake(30, 0, 600, 0, 1200, 600);
  frameRate(100);
  food1 = pickLocation(0, width/2/scl);
  food2 = pickLocation(width/2/scl+1, width/scl); //of food
}

PVector pickLocation(float low, float high) //new random food location
{
  int cols = width/scl;
  int rows = (height-25)/scl;
  PVector food = new PVector(floor(random(low, high)), floor(random(rows)));
  food.mult(scl);
  return food;
}
void tick() {
  background(0);
  noStroke();
  fill(205);
  rect(0, 0, 600, 600);
  fill(50);
  rect(600, 0, 600, 600);
  stroke(4);
  if (s1.eat(food1)) 
  {
    food1 = pickLocation(0, width/2/scl);
  }
  if (s2.eat(food2)) 
  {
    food2 = pickLocation(width/2/scl+1, width/scl);
  }
  fill(200, 0, 0);
  ellipseMode(CORNER);
  fill(0);
  ellipse(food1.x, food1.y, scl, scl);
  fill(255);
  ellipse(food2.x, food2.y, scl, scl);
  s1.update();
  s2.update();
  s1.deathCheck();
  s2.deathCheck();
  s1.show(0, 0, 0);
  s2.show(255, 255, 255);
}
void draw() 
{
  if (frameCount % 10 == 0)
  {
    tick();
  }
  showTimer(s1, 0, height-25);
  showTimer(s2, width/2, height-25);
  s1.countDown.tickdown();
  s2.countDown.tickdown();
}

void keyPressed() {
  if (!gameOver && !pause)
  {
  if (keyCode == UP) 
    s2.dir(0, -1);
  if (keyCode == DOWN) 
    s2.dir(0, 1);
  if (keyCode == RIGHT) 
    s2.dir(1, 0);
  if (keyCode == LEFT)
    s2.dir(-1, 0);
  if (key == 'w') 
    s1.dir(0, -1);
  if (key == 's')
    s1.dir(0, 1);
  if (key == 'd') 
    s1.dir(1, 0);
  if (key == 'a')
    s1.dir(-1, 0);
  }
  if (keyCode == ENTER && gameOver)
  {
    food1 = pickLocation(0, width/2/scl);
    food2 = pickLocation(width/2/scl+1, width/scl);
    loop();
    gameOver = false;
  }
  if (key == ' '  && !gameOver && pause == false)
  {
    noLoop();
    pause = true;
    fill(#F4F59E);
    textFont(myfont);
    textAlign(CENTER, CENTER);
    text("Paused",width/2,height/2);
  } else if (key == ' '  && !gameOver && pause == true)
  {
    loop();
    pause = false;
  }
    
}
void showTimer(Snake snek, int x, int y) {
  float percent = snek.countDown.percentDone();
  float barWidth = floor((width/2)*percent);
  fill(255, 0, 0);
  rect(x, y, barWidth, 25);
}

class Snake {
  float x, y;
  float dspawnx, dspawny; 
  float xspeed, yspeed;
  float lastxspeed, lastyspeed;
  float boundsx1, boundsy1, boundsx2, boundsy2;
  int total;
  ArrayList<PVector> tail = new ArrayList<PVector>();
  ArrayList<PVector> move = new ArrayList<PVector>();
  Timer countDown;
  Snake(int gx, int gy, int bx1, int by1, int bx2, int by2) {
    x = gx*scl;
    y = gy*scl;
    dspawnx = x;
    dspawny = y;
    xspeed = 1;
    yspeed = 0;
    lastxspeed = 1;
    lastyspeed = 0;
    boundsx1 =bx1;
    boundsy1 =by1;
    boundsx2 = bx2;
    boundsy2 = by2;
    total = 2;
    tail = new ArrayList<PVector>();
    countDown = new Timer(1200);
  }

  void die() {
    noLoop();
    gameOver = true;
    x = dspawnx;
    y = dspawny;
    xspeed = 1;
    yspeed = 0;
    lastxspeed = 1;
    lastyspeed = 0;
    total = 2;
    tail = new ArrayList<PVector>();
    score = 0;
    countDown.reset();
  }

  void dir(float x, float y) { //set snake motion direction
    move.add(new PVector(x, y));
  }

  boolean eat(PVector pos) {
    float d = dist(x, y, pos.x, pos.y);
    if (d < 1) { //means the head position is on top of the food position
      total+=2;//increase total to add one more PVector to the tail
      score++;
      countDown.reset();
      return true;
    } else 
    return false;
  }

  boolean insidebounds() {
    if (boundsx1 <= x && x < boundsx2 && boundsy1 <= y && boundsy2 > y)
    {
      return true;
    } else {
      return false;
    }
  }

  void deathCheck() {  //what to do if you run into yourself==condition of starting over
    for (int i = 0; i < tail.size(); i++) { // This check if running into self or wall.
      PVector pos = tail.get(i);
      float d = dist(x, y, pos.x, pos.y);
      if (d < 1) {
        printS();
        s1.die();
        s2.die();
      }
    }
    if (!insidebounds()) {
      printS();
      s1.die();
      s2.die();
    }
    if (countDown.timeUp()) {
      printS();
      s1.die();
      s2.die();
    }
  }

  void update() {
    if (total > 0) {
      if (total == tail.size() && !tail.isEmpty()) {
        tail.remove(0);  //if you don't grow then remove the oldest element
      }
      tail.add(new PVector(x, y));  //add the current position to the end of the arraylist
    }
    if (move.size() != 0)
    {
      xspeed = move.get(0).x;
      yspeed = move.get(0).y;
      move.remove(0);
    }
    if ((xspeed*-1)==lastxspeed || (yspeed*-1)==lastyspeed) {//Prevents from going directly backwards.
      xspeed = lastxspeed;
      yspeed = lastyspeed;
    }
    x = x + xspeed*scl;
    y = y + yspeed*scl;
    lastxspeed = xspeed;
    lastyspeed = yspeed;
  }
  void show(int r, int g, int b) 
  {
    fill(r, g, b);
    for (PVector v : tail) {
      noStroke();
      rect(v.x, v.y, scl, scl);
    } 
    //rect(x, y, scl, scl);
    drawHead();
  }
  void drawHead() {
    int tl =0;
    int tr =0;
    int br =0;
    int bl =0;
    int r= 50;
    PVector h = new PVector(lastxspeed, lastyspeed);
    if (h.x == 0 && h.y == -1) {
      tl=r;
      tr=r;
    } else if (h.x == 0 && h.y == 1) {
      bl=r;
      br=r;
    } else if (h.x == 1 && h.y ==0) {
      tr=r;
      br=r;
    } else if (h.x == -1 && h.y ==0) {
      tl=r;
      bl=r;
    }
    rect(x, y, scl, scl, tl, tr, br, bl);
  }
}
class Timer {
  float timeLeft;
  float maxTimeLeft;
  float start;
  Timer(float vaule) {
    start = vaule;
    timeLeft = vaule;
    maxTimeLeft = vaule;
  }
  void tickdown() {
    timeLeft--;
  }
  void reset() {
    float a = constrain(pow(0a.98,score)*1200,570,1201);
    maxTimeLeft = a;
    timeLeft = a;
  }
  boolean timeUp() {
    if (timeLeft <= 0) {
      return true;
    }
    return false;
  }
  float percentDone(){
  return timeLeft/maxTimeLeft;
  }
}  
