import { scanImageData, setModuleArgs } from "@undecaf/zbar-wasm";

const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

let stream = null;
let scanning = false;
let lastValue = "";

// zbar.wasm 위치 설정
setModuleArgs({
  locateFile: (filename) => `/HDT-ERP-Scanner/${filename}`,
});

startBtn.addEventListener("click", async () => {
  try {
    statusEl.textContent = "카메라 권한 요청 중...";
    startBtn.disabled = true;

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    video.srcObject = stream;
    await video.play();

    statusEl.textContent = "카메라 실행 성공. 바코드를 비춰주세요.";
    scanning = true;

    requestAnimationFrame(scanLoop);
  } catch (error) {
    console.error(error);
    statusEl.textContent = "카메라 실행 실패";
    startBtn.disabled = false;
  }
});

async function scanLoop() {
  if (!scanning) return;

  try {
    if (video.readyState >= 2) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const symbols = await scanImageData(imageData);

      if (symbols && symbols.length > 0) {
        const value = symbols[0].decode();

        if (value && value !== lastValue) {
          lastValue = value;
          resultEl.textContent = `스캔 성공: ${value}`;
          statusEl.textContent = "바코드 인식 완료";
          console.log("스캔 성공:", value);
        }
      }
    }
  } catch (error) {
    console.error("스캔 오류:", error);
    statusEl.textContent = "스캔 중 오류 발생";
  }

  requestAnimationFrame(scanLoop);
}