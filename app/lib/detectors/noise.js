export default function NoiseDetector(stream, options = {}) {
  // Common stuff
  this.name = 'Noise';
  this.stream = stream;
  this.options = Object.assign({}, options, {
    interval: 500, // check every 500ms
    threshold: 50, // in range 0-100
  });

  this.isRunning = false;
  this.onEvent = function () {};

  // Specific stuff
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();
  const analyser = context.createAnalyser();

  // analyser.minDecibels = -90;
  // analyser.maxDecibels = -10;
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.0; // range 0-1

  const source = context.createMediaStreamSource(stream);
  source.connect(analyser);

  this.analyser = analyser;
}

NoiseDetector.prototype.start = function () {
  this.isRunning = true;
  run.bind(this)();

  function run() {
    if (this.isRunning) {
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);

      const volume = Math.max(...dataArray);     // range 0-255
      const scaledVolume = (volume * 100) / 255; // range 0-100

      if (scaledVolume > this.options.threshold) {
        this.onEvent(scaledVolume);
      }

      window.setTimeout(run.bind(this), this.options.interval);
    }
  }
};

NoiseDetector.prototype.stop = function () {
  this.isRunning = false;
};
