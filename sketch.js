// I really liked the example that was given on the actual quiz example so I tused that as a base
// and added a couple of tweaks here and there to make it look a bit different.

let song;
let fft;
let particles = [];
let nyquist = 22050;
let centroidplot = 0.0;
let spectralCentroid = 0;
const offsetCentroid = 300;

function preload() {
  song = loadSound("./audio/sample-visualisation.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);
  fft = new p5.FFT(0.5, 512);
  song.connect(fft);
  noLoop();
}

function draw() {
  background(0);
  fill(255, 255, 255); // text is white
  if (song.isPlaying()) {
    text("Hit space bar to stop playing music!", width / 2.2, 20);
  } else {
    text("Hit space bar to play some music!", width / 2.2, 20);
  }

  fill(255);
  text("Centroid: ", width / 2.2, 45);
  text(round(spectralCentroid) + " Hz", width / 2.2, 60);

  let spectrum = fft.analyze();
  translate(width / 2, height / 2);

  amp = fft.getEnergy(20, 200);

  push();
  if (amp > 230) {
    rotate(random(-1, 1));
  }

  pop();

  fill(33);
  noStroke();
  rect(0, 30, width, height - 70);

  strokeWeight(3);
  noFill();

  for (let i = 0; i < spectrum.length; i += 6) {
    let angle = map(i, 1, spectrum.length, 0, 360) - 90;
    let amp2 = spectrum[i];
    let r = map(amp2, 0, 256, 80, 250);
    let x = r * sin(angle);
    let y = r * cos(angle);

    line(0, 0, x, y);
    line(x * 1.05, y * 1.05, x * 1.06, y * 1.06);
    stroke(i / 0.4, 200, 200);

    spectralCentroid = fft.getCentroid();

    // // The mean_freq_index calculation is for the display.
    let mean_freq_index = spectralCentroid / (nyquist / spectrum.length);

    // // Use a log scale to match the energy per octave in the FFT display
    centroidplot = map(log(mean_freq_index), 0, log(spectrum.length), 0, width);

    rect(
      centroidplot - width + offsetCentroid,
      0,
      width / spectrum.length,
      height
    );
  }

  noStroke();
  colorMode(RGB);
  fill(0);
  circle(0, 0, 155);
  
}

function keyPressed() {
  if (keyCode === 32) {
    if (song.isPlaying()) {
      song.pause();
      noLoop();
    } else {
      song.play();
      loop();
    }
  }
}
