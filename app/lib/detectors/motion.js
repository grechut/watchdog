import resemble from 'resemblejs';

export default function MotionDetector(stream, options = {}) {
  this.stream = stream;
  this.options = Object.assign({}, options, {
    threshold: 10,
    interval: 1000,
  });

  this.isRunning = false;
  this.previousFrame = null;
  this.currentFrame = null;
  this.onEvent = function () {};

  this.video = document.createElement('video');
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');

  this.video.setAttribute('autoplay', true);
  this.video.src = window.URL.createObjectURL(this.stream);
  this.video.play();
}

MotionDetector.prototype.start = function () {
  this.isRunning = true;
  compare.bind(this)();

  function compare() {
    if (this.isRunning) {
      this.currentFrame = takeScreenshot.bind(this)();

      if (!this.previousFrame) {
        this.previousFrame = this.currentFrame;
        window.setTimeout(compare.bind(this), this.options.interval);
        return;
      }

      resemble(this.currentFrame).compareTo(this.previousFrame).ignoreColors().onComplete(function result(data) {
        console.log('Motion detector:', data);

        if (data.misMatchPercentage > this.options.threshold) {
          this.onEvent(data);
        }

        this.previousFrame = this.currentFrame;
        window.setTimeout(compare.bind(this), this.options.interval);
      }.bind(this));
    }
  }

  function takeScreenshot() {
    this.ctx.drawImage(this.video, 0, 0);
    return this.canvas.toDataURL('image/png');
  }
};

MotionDetector.prototype.stop = function () {
  this.isRunning = false;
  this.previousFrame = null;
  this.currentFrame = null;
};
