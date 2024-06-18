// INITIAL CODE FROM Coding Train / Daniel Shiffman
// Sound Visualization:  Frequency analysis with FFT

const progressBar = document.getElementById('progressBar')

const currentLevel = document.getElementById('currentLevel');
const summativeLevel = document.getElementById('summativeLevel');
let sumLev = 0;
let limit = 100000;

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

  updateProgressBar();
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

function updateProgressBar() {
  
  percentage = sumLev / limit * 100;
  
  if (percentage <= 100) {
    progressBar.style.height = percentage + "%"
  }
}

function clearSum() {
  sumLev = 0;
}