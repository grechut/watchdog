import resemble from 'resemblejs';

export default function MotionDetector(stream, options = {}) {
  this.name = 'Motion';
  this.stream = stream;
  this.options = Object.assign({}, options, {
    interval: 500, // compare every 500ms
    threshold: 10, // 10% difference between frames
  });

  this.isRunning = false;
  this.firstFrame = true;
  this.previousFrame = null;
  this.currentFrame = null;
  this.onEvent = function () {};

  this.video = document.createElement('video');
  this.canvas = document.createElement('canvas');
  this.canvas.width = this.video.width = 400;
  this.canvas.height = this.video.height = 300;
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

      resemble(this.currentFrame)
        .compareTo(this.previousFrame)
        .ignoreColors()
        .onComplete((data) => {
          if (data.misMatchPercentage > this.options.threshold) {
            // FIXME: Lame workaround to skip the first frame,
            // which for some strange reason is empty.
            if (!this.firstFrame) {
              this.onEvent(data);
            }

            this.firstFrame = false;
          }

          this.previousFrame = this.currentFrame;
          window.setTimeout(compare.bind(this), this.options.interval);
        });
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
