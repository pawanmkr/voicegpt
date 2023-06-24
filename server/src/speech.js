const fs = require('fs');
const path = require('path');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
require('dotenv').config({
    path: path.join(process.cwd(), '../.env')
})

const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
speechConfig.speechRecognitionLanguage = "en-US";

exports.stt = async (filePath) => {
    let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(filePath));
    let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    try {
        const result = await new Promise((resolve, reject) => {
            speechRecognizer.recognizeOnceAsync((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            });
        });

        switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
                console.log(`RECOGNIZED:\n${result.text}`);
                return result.text; // Return the recognized text
            case sdk.ResultReason.NoMatch:
                console.log("NOMATCH: Speech could not be recognized.");
                break;
            case sdk.ResultReason.Canceled:
                const cancellation = sdk.CancellationDetails.fromResult(result);
                console.log(`CANCELED: Reason=${cancellation.reason}`);

                if (cancellation.reason == sdk.CancellationReason.Error) {
                    console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                    console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                    console.log("CANCELED: Did you set the speech resource key and region values?");
                }
                break;
        }
    } catch (error) {
        console.error("An error occurred during speech recognition:", error);
    } finally {
        speechRecognizer.close();
    }

    return null; // Return null if no recognized text is available
};

exports.tts = async (text) => {
    const outputPath = path.join(process.cwd(), 'output/jenny.wav');
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputPath);
    // The language of the voice that speaks.
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

    // Create the speech synthesizer.
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    try {
        return await new Promise((resolve, reject) => {
            synthesizer.speakTextAsync(text, (result) => {
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    console.log("\nSynthesis finished.\n");
                    resolve(outputPath);
                } else {
                    reject(new Error("Speech synthesis canceled. " + result.errorDetails +
                        "\nDid you set the speech resource key and region values?"));
                }
            }, (error) => {
                reject(error);
            });
        });
    } catch (error) {
        console.error("An error occurred during speech synthesis:", error);
    } finally {
        synthesizer.close();
        synthesizer = null;
    }
};
