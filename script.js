// INITIAL CODE FROM Coding Train / Daniel Shiffman
// Sound Visualization:  Frequency analysis with FFT

const progressBar = document.getElementById('progressBar')

const currentLevel = document.getElementById('currentLevel');
const summativeLevel = document.getElementById('summativeLevel');
const sliderVal = document.getElementById('sliderVal');
const myRange = document.getElementById('myRange');

let sumLev = 0;
let limit = myRange.value;
sliderVal.innerText = "/ " + limit;

let pencilRotation = 0;

let micBool = false;
let beepBool = false;

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
  createCanvas(windowHeight/2, windowHeight/2);
  colorMode(HSB);
  angleMode(DEGREES);

  amp = new p5.Amplitude();
  // mic = new p5.AudioIn();

  wave = new p5.Oscillator();  

  // Set smoothing to 0, 256 bins
  fft = new p5.FFT(0.9, 64);
  w = width / 64;
}

function windowResized() {
  if (windowWidth > windowHeight) {
    resizeCanvas(windowHeight/2, windowHeight/2);
  } else {
    resizeCanvas(windowWidth/2, windowWidth/2);
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
    mic = "";
  } else {
    song.stop();
    mic = new p5.AudioIn();
    mic.start();
    amp = new p5.Amplitude();
    micBool = true;
  }
  console.log(micBool);
}

function toggleBeep() {
  if (beepBool){
    beepBool = false;
    
    switch (wave.getType()) {
      case 'sine':
        wave.setType('square');
        break;
      case 'square':
        wave.setType('triangle');
        break;
      case 'triangle':
        wave.setType('sawtooth');
        break;
      case 'sawtooth':
        wave.setType('sine');
        break;
    }
    
    wave.start();
    wave.freq(Math.floor(Math.random() * 700) + 200);
    wave.amp(.1);
  } else {
    beepBool = true;
    wave.stop();
  }
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

  sliderVal.innerText = "/ " + myRange.value;
  updateProgressBar();
}

function updateProgressBar() {
  let limit = myRange.value;
  rawPercent = sumLev / limit * 100;
  roundPercent = Math.round(rawPercent);
  rotation = roundPercent * 4
  updatePencilRotation();
  
  if (rawPercent <= 100) {
    progressBar.style.height = rawPercent + "%"
    percentage.innerText = roundPercent + "%";
  } else {
    progressBar.style.height = 100 + "%"
    percentage.innerText = 100 + "%";
  }
}

function updatePencilRotation() {
  offset = rotation % 50 - 25;
  starter = 60;
  step = 20;

  newGradient = "linear-gradient(90deg, " +
      "hsl(56, 100%, " + (starter - (offset / 50 * step)) +"%) 0% " + (25 + offset) + "%, " +
      "hsl(56, 100%, " + (starter - step - (offset / 50 * step)) + "%) " + (25 + offset) + "% " + (75 + offset) + "%, " +
      "hsl(56, 100%, " + (starter - (2 * step) - (offset / 50 * step)) + "%) " + (75 + offset) + "% 100%)"

  // console.log(newGradient)
  progressBar.style.background = newGradient;
}

function clearSum() {
  // progressBar.style.transition = "height 0.5s ease-in-out"
  sumLev = 0;
  // removeTransition = setTimeout(function() {
  //   progressBar.style.transition = ""
  // }, 500)
}
