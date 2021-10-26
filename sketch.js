var song;
var img;
var fft; //fast forward transform
var particles = [];
var songList = []; //json di songs
var myCursor;

//To insure that the audio file is loaded properly before anything else happens
function preload() {
  song = loadSound("SomebodyElse.mp3");
  img = loadImage("albumcover2.jpg");
  data = loadJSON("songlist.json"); //load data
  myCursor = loadImage("myCursor.png");
}

function setup() {
  // image(img, 0, 0, width + 100, height + 100);

  // background(img);
  textFont("Libre Franklin");
  console.log(data);
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  fft = new p5.FFT(0.3);
  noCursor();

  // img.filter(BLUR, 3);

  //dati
  for (let i = 0; i < data.songs.length; i++) {
    addSongs(
      random(windowWidth),
      random(windowHeight),
      data.songs[i].preference,
      data.songs[i].album,
      data.songs[i].song
    );
  }
}

function draw() {
  image(myCursor, mouseX, mouseY);
  //dati
  for (let i = 0; i < songList.length; i++) {
    songList[i].run();
  }

  translate(width / 2, height / 2);

  fft.analyze();
  amp = fft.getEnergy(20, 200);

  push();
  if (amp > 230) {
    rotate(random(-0.5, 0.5));
  }

  pop();

  var alpha = map(amp, 0, 255, 180, 150);
  fill(0, alpha);
  noStroke();
  rect(0, 0, width, height);

  stroke(255);
  strokeWeight(3);
  noFill();

  var wave = fft.waveform();

  for (var t = -1; t <= 1; t += 2) {
    beginShape();
    for (var i = 0; i <= 180; i += 0.5) {
      var index = floor(map(i, 0, 180, 0, wave.length - 1));

      var r = map(wave[index], -1, 1, 150, 350);

      var x = r * sin(i) * t;
      var y = r * cos(i);
      vertex(x, y);
    }
    endShape();
  }

  var p = new Particle();
  particles.push(p);

  for (var i = 0; i < particles.length; i++) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 188);
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }
  }
}

//To ensure that the audio plays regardless of the browser
function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

//particelle
class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));

    this.w = random(3, 5);

    this.color = [random(0, 255), random(0, 20), random(0, 200)];
  }

  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }

  edges() {
    if (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > height / 2
    ) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 4);
  }
}

//funzione per constructor bubbles
function addSongs(x, y, size, album, song) {
  let bubbleColor;
  if (album == "The 1975") {
    bubbleColor = "white";
  } else if (
    album == "I like it when you sleep, fro you are so beautiful yet so unaware"
  ) {
    bubbleColor = "pink";
  } else if (album == "Notes On A Conditional Form") {
    bubbleColor = "yellow";
  }
  const aNewBubble = new Bubble(x, y, size, bubbleColor, song);
  songList.push(aNewBubble);
}

//canzoni bubble
class Bubble {
  constructor(temp_x, temp_y, temp_r, temp_color, temp_name) {
    this.x = temp_x;
    this.y = temp_y;
    this.r = temp_r;
    this.color = temp_color;
    this.name = temp_name;

    this.speed = 0.5;
    this.yDir = 1;
    this.xDir = 1;
  }

  display() {
    push();
    noStroke();
    fill(color(this.color));
    ellipse(this.x, this.y, this.r);
    textAlign(CENTER);
    fill(0);
    text(this.name, this.x, this.y);
    pop();
  }

  updatePosition() {
    this.x += this.speed * this.xDir;
    this.y += this.speed * this.yDir;
    if (this.y >= height || this.y <= 0) {
      this.yDir *= -1;
    }
    if (this.x >= width || this.x <= 0) {
      this.xDir *= -1;
    }
  }

  run() {
    this.updatePosition();
    this.display();
  }
}
