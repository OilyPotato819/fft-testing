const cnv = document.getElementById('canvas');
const ctx = cnv.getContext('2d');

cnv.width = window.innerWidth - 20;
cnv.height = window.innerHeight - 60;

let analyser, bufferLength, dataArray;
const audioElement = document.getElementById('audio');

document.addEventListener('click', () => {
  audioElement.play();
  console.log('now playing');

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  //   let source = audioCtx.createMediaStreamSource(stream);
  let source = audioCtx.createMediaElementSource(audioElement);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;

  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  draw();
});

function draw() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  analyser.getByteFrequencyData(dataArray);
  cnv.width = window.innerWidth - 20;
  cnv.height = window.innerHeight - 60;

  const data = smoothData(50);

  drawCircle(data);
  drawGraph(data);

  requestAnimationFrame(draw);
}

function drawCircle(data) {
  const circle = { x: cnv.width / 2, y: cnv.height / 2, r: 5, spikyness: 10 };
  let angle = 0;
  let start = {};
  const pieceNum = 10;
  const remove = 500;

  let grd = ctx.createRadialGradient(circle.x, circle.y, 400, circle.x, circle.y, circle.r + 50);
  grd.addColorStop(1 / 7, 'red');
  grd.addColorStop(2 / 7, 'orange');
  grd.addColorStop(3 / 7, 'yellow');
  grd.addColorStop(4 / 7, 'green');
  grd.addColorStop(5 / 7, 'blue');
  grd.addColorStop(6 / 7, 'indigo');
  grd.addColorStop(7 / 7, 'violet');

  ctx.fillStyle = grd;

  ctx.beginPath();
  for (let i = 0; i < pieceNum; i++) {
    circlePiece(1 - (i % 2), i);
  }
  ctx.fill();

  function circlePiece(clockwise, pieceI) {
    let angleChange = (2 * Math.PI) / pieceNum / (bufferLength - remove);
    let i, iStart, iExp, iAdd;

    if (clockwise) {
      iStart = 0;
      iExp = function () {
        return i < bufferLength - remove;
      };
      iAdd = 1;
    } else {
      iStart = bufferLength - remove;
      iExp = function () {
        return i > 0;
      };
      iAdd = -1;
    }

    for (i = iStart; iExp(); i += iAdd) {
      dist = circle.r + Math.sqrt(data[i]) * circle.spikyness;

      let x = circle.x + dist * Math.sin(angle);
      let y = circle.y + dist * Math.cos(angle);

      if (i == 1 && pieceI == 0) {
        ctx.moveTo(x, y);
        start.x = x;
        start.y = y;
      } else {
        ctx.lineTo(x, y);
      }

      angle += angleChange;
    }
  }
}

function drawGraph(data) {
  let pos = {};

  ctx.beginPath();

  for (let i = 0; i <= bufferLength; i++) {
    pos.y = cnv.height - data[i];

    if (i == 0) {
      pos.x = 0;

      ctx.moveTo(0, cnv.height);
    }

    ctx.lineTo(pos.x, pos.y);

    pos.x += cnv.width / bufferLength;
  }

  ctx.fill();
}

function smoothData(windowSize) {
  const smoothedData = [];

  for (let i = 0; i < dataArray.length; i++) {
    const windowStart = Math.max(0, i - Math.floor(windowSize / 2));
    const windowEnd = Math.min(dataArray.length - 1, i + Math.ceil(windowSize / 2));
    let sum = 0;

    for (let j = windowStart; j <= windowEnd; j++) {
      sum += dataArray[j];
    }

    const average = sum / (windowEnd - windowStart + 1);
    smoothedData.push(average);
  }

  return smoothedData;
}
