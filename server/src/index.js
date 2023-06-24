const { stt, tts } = require('./speech.js');
const { talkToGPT } = require('./gpt.js');
const { recordAudio } = require('./record.js');
const player = require('play-sound')(opts = {});
const path = require('path');

async function main() {
  const start = performance.now();
  const audio = await recordAudio();
  const text = await stt(audio);
  await play(path.join(process.cwd(), 'recordings/think.wav'));
  const reply = await talkToGPT(text);
  const audioResponsePath = await tts(reply);
  console.log(`\n${performance.now() - start}ms`);
  await play(audioResponsePath);
};
main();

async function play(filePath) {
  return new Promise(function (resolve, reject) {
    player.play(filePath, function (err) {
      if (err) {
        console.error(`Failed to play audio: ${err}`);
        reject();
      }
      resolve();
    })
  })
}