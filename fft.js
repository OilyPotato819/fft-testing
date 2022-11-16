const fft = require('fft-js').fft;
const fftUtil = require('fft-js').util;

let signal = [];
const signalSection = [100, 0, 0, 0];
const sampleNum = 2 ** 6;

for (let i = 0; i < Math.ceil(sampleNum / signalSection.length); i++) {
   signal.push(...signalSection);
}

signal.splice(sampleNum);

let phasors = fft(signal);

let frequencies = fftUtil.fftFreq(phasors, 8000), // Sample rate and coef is just used for length, and frequency step
   magnitudes = fftUtil.fftMag(phasors);

let both = frequencies.map(function (f, ix) {
   return { frequency: f, magnitude: magnitudes[ix] };
});

module.exports = both;
