// MP3 VISUALIZATION PROJECT

// var song;
// var button;
// var amp;
// var mic;

// var micBool = true;

// function preload(){
//     song = loadSound("hall.mp3");
// }

// function setup() {
//     createCanvas(200, 200);
//     button = createButton('play');
//     button.mousePressed(togglePlaying);
//     amp = new p5.Amplitude();
// }

// function togglePlaying() {
//     if (micBool){
//         startMic();
//         micBool = false;
//     }
//     if (!song.isPlaying()) {
//         song.play();
//         button.html('pause');
//     } else {
//         song.pause();
//         button.html('play');
//     }
// }

// async function startMic() {
//     mic = new p5.AudioIn();
//     mic.start();
// }

// function draw() {
//     background(0);

//     var vol = mic.getLevel();
//     var diam = map(vol, 0, 1, 10, 200);

//     fill(0,255,0)
//     ellipse(width/2, height/2, diam, diam);
// }


// MIC INPUT PROJECT

// let mic;

// function setup(){
//   let cnv = createCanvas(100, 100);
//   cnv.mousePressed(userStartAudio);
//   cnv.style.position = "absolute";
//   cnv.style.bottom = "0px";
//   textAlign(CENTER);
//   mic = new p5.AudioIn();
//   mic.start();
// }

// function draw(){
//   micLevel = mic.getLevel();
//   let y = micLevel * height;
//   if(y < 1){
//     y = 0;
//   }

//   fill(0, 150, 0)
//   noStroke();
//   ellipse(width/2, height/2, width, height)

//   fill(0, 255, 0);
//   stroke(0, 255, 0);
//   strokeWeight(height/50);
  
//   arc(width/2, height*3/5, width*.66, min(max(y*5, 0.00001), height*.66), 0, PI);

//   noFill();
//   arc(width/3, height/3, width/10, min(max(y*2, 0.00001), height/10), PI, 0) 
//   arc(width*2/3, height/3, width/10, min(max(y*2, 0.00001), height/10), PI, 0) 

// }


// Coding Train / Daniel Shiffman
// Sound Visualization:  Frequency analysis with FFT

// Code for https://www.youtube.com/watch?v=2O3nm0Nvbi4

// "Just Like a Rainbow" by the Columbians (rainbow.mp3) can be downloaded from
// https://github.com/CodingTrain/website-archive/blob/main/Tutorials/P5JS/p5.js_sound/17.1_playSong/rainbow.mp3

const currentLevel = document.getElementById('currentLevel');
const summativeLevel = document.getElementById('summativeLevel');
let sumLev = 0;

let micBool = false;

let mic;

currentLevel.innerText = '0';
summativeLevel.innerText = '0';

let song;
let fft;
let w;
let button;

function preload() {
  song = loadSound("hall.wav");
}

function setup() {
  createCanvas(windowHeight, windowHeight);
  colorMode(HSB);
  angleMode(DEGREES);
  // plauseButton = createButton("plause");
  // plauseButton.mousePressed(toggleSong);
  // micButton = createButton("mic");
  // micButton = mousePressed(toggleMic);
  amp = new p5.Amplitude();
  mic = new p5.AudioIn();
  // song.play();

  // Set smoothing to 0, 256 bins
  fft = new p5.FFT(0.9, 64);
  w = width / 64;
}

function windowResized() {
  if (windowWidth > windowHeight) {
    resizeCanvas(windowHeight, windowHeight);
  } else {
    resizeCanvas(windowWidth, windowWeight);
  }
}

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    if (!micBool) {
      song.play();
      amp = new p5.Amplitude();
    }
  }
}

function toggleMic() {
  if (micBool === true) {
    micBool = false;
    mic.stop();
  } else {
    song.stop();
    mic.start();
    micBool = true;
  }
  console.log(micBool);
}

function draw() {
  background(0);
  lev = 0;

  if (song.isPlaying()) {
    lev = Math.round(amp.getLevel() * 1000);
  }
  if (micBool) {
    lev = Math.round(mic.getLevel() * 1000);
  }

  sumLev += lev;

  // console.log(lev);
  currentLevel.innerText = lev;
  summativeLevel.innerText = sumLev;
  
  let spectrum = fft.analyze();
  // console.log(spectrum);
  // stroke(255);
  for (let i = 0; i < spectrum.length; i++) {
    let ampl = spectrum[i];
    fill(i, 255, 255);
    let y = map(ampl, 0, 256, height, 0);
    rect(i*w, y, w, height - y);
  }
  // Default length is 1024;
  // console.log(spectrum.length);

  // translate(width / 2, height / 2);
  // //beginShape();
  // for (let i = 0; i < spectrum.length; i++) {
  //   let angle = map(i, 0, spectrum.length, 0, 360);
  //   let ampl = spectrum[i];
  //   let r = map(ampl, 0, 256, 20, 100);
  //   //fill(i, 255, 255);
  //   let x = r * cos(angle);
  //   let y = r * sin(angle);
  //   stroke(i, 255, 255);
  //   line(0, 0, x, y);
  //   //vertex(x, y);
  // }
  // //endShape();
}