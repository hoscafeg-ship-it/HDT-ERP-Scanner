import { scanImageData } from "@undecaf/zbar-wasm";

const video = document.querySelector("#camera");
const resultBox = document.querySelector("#result");

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

let scanning = false;
let lastValue = "";
let lastScanTime = 0;

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    video.srcObject = stream;
    await video.play();

    resultBox.textContent = "카메라 실행 완료! 바코드를 비춰주세요.";
    scanLoop();

  } catch (err) {
    console.error(err);
    resultBox.textContent = "카메라 실행 실패: " + err.message;
  }
}

async function scanLoop() {
  if (!video.videoWidth || !video.videoHeight) {
    requestAnimationFrame(scanLoop);
    return;
  }

  if (!scanning) {
    scanning = true;

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const symbols = await scanImageData(imageData);

      if (symbols.length > 0) {
        const symbol = symbols[0];
        const value = symbol.decode();

        const now = Date.now();

        if (value && (value !== lastValue || now - lastScanTime > 2000)) {
          lastValue = value;
          lastScanTime = now;

          resultBox.textContent = `스캔 성공: ${value}`;
          console.log("스캔 성공:", value, symbol);
        }
      }

    } catch (err) {
      console.error("스캔 오류:", err);
    }

    scanning = false;
  }

  requestAnimationFrame(scanLoop);
}

startCamera();