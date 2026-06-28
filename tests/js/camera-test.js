const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

let scanning = false;
let zbarReady = false;
let scanImageData = null;
let lastValue = "";

startBtn.addEventListener("click", async () => {
  try {
    statusEl.textContent = "카메라 권한 요청 중...";
    startBtn.disabled = true;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
      },
      audio: false,
    });

    video.srcObject = stream;
    await video.play();

    statusEl.textContent = "카메라 실행 성공. 바코드 엔진 준비 중...";
    scanning = true;

    loadZbar();
    requestAnimationFrame(scanLoop);
  } catch (error) {
    console.error("카메라 실행 실패:", error);
    statusEl.textContent = "카메라 실행 실패: " + error.message;
    startBtn.disabled = false;
  }
});

async function loadZbar() {
  try {
    const zbar = await import("@undecaf/zbar-wasm");

    scanImageData = zbar.scanImageData;

    if (zbar.setModuleArgs) {
      zbar.setModuleArgs({
        locateFile: (filename) => `/HDT-ERP-Scanner/${filename}`,
      });
    }

    zbarReady = true;
    statusEl.textContent = "카메라 실행 성공. 바코드를 비춰주세요.";
  } catch (error) {
    console.error("zbar 로딩 실패:", error);
    statusEl.textContent = "카메라는 켜졌지만 바코드 엔진 로딩 실패";
  }
}

async function scanLoop() {
  if (!scanning) return;

  if (!zbarReady || !scanImageData) {
    requestAnimationFrame(scanLoop);
    return;
  }

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
  }

  requestAnimationFrame(scanLoop);
}