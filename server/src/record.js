const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const mic = require("mic");
const { Readable } = require("stream");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

// Record audio
exports.recordAudio = async () => {
  const audioFilename = "recordings/recorded_audio.wav";
  return new Promise((resolve, reject) => {
    const micInstance = mic({
      rate: "16000",
      channels: "1",
      fileType: "wav",
    });

    const micInputStream = micInstance.getAudioStream();
    const output = fs.createWriteStream(audioFilename);
    const writable = new Readable().wrap(micInputStream);

    console.log("Recording... Press Ctrl+C to stop.");

    writable.pipe(output);

    micInstance.start();

    process.on("SIGINT", () => {
      micInstance.stop();
      console.log("Finished recording");
      return resolve(path.join(process.cwd(), audioFilename));
    });

    micInputStream.on("error", (err) => {
      reject(err);
    });
  });
}