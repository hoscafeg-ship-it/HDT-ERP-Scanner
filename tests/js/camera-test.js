console.log("V4-ZBAR-TEST-001 로드됨");

const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

statusEl.textContent = "JS 로드 성공: V4-ZBAR-TEST-001";
resultEl.textContent = "카메라 시작 버튼을 눌러주세요.";

let timer = null;
let scanImageData = null;
let zbarReady = false;
let lastValue = "";

startBtn.addEventListener("click", async () => {
  try {
    statusEl.textContent = "카메라 권한 요청 중...";

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    video.srcObject = stream;
    await video.play();

    statusEl.textContent = "카메라 실행 성공";
    resultEl.textContent = "zbar 엔진 로딩 중...";

    await loadZbar();

    startScanLoop();
  } catch (error) {
    console.error(error);
    statusEl.textContent = "오류 발생";
    resultEl.textContent = error.message;
    startBtn.disabled = false;
  }
});

async function loadZbar() {
  try {
    const zbar = await import("@undecaf/zbar-wasm");

    if (zbar.setModuleArgs) {
      zbar.setModuleArgs({
        locateFile: (filename) => {
          console.log("WASM 요청 파일:", filename);
          return filename;
        },
      });
    }

    scanImageData = zbar.scanImageData;
    zbarReady = true;

    statusEl.textContent = "zbar 로딩 성공";
    resultEl.textContent = "바코드를 카메라에 비춰주세요.";
  } catch (error) {
    console.error("zbar 로딩 실패:", error);
    statusEl.textContent = "zbar 로딩 실패";
    resultEl.textContent = error.message;
  }
}

function startScanLoop() {
  if (timer) return;

  timer = setInterval(async () => {
    try {
      if (!zbarReady || !scanImageData) {
        resultEl.textContent = "zbar 준비 대기 중...";
        return;
      }

      if (video.readyState < 2) {
        resultEl.textContent = "비디오 준비 대기 중...";
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const symbols = await scanImageData(imageData);

      if (symbols && symbols.length > 0) {
        const value = symbols[0].decode();

        if (value && value !== lastValue) {
          lastValue = value;
          statusEl.textContent = "스캔 성공";
          resultEl.textContent = `스캔 성공: ${value}`;
          console.log("스캔 성공:", value);
        }
      } else {
        statusEl.textContent = "스캔 중...";
      }
    } catch (error) {
      console.error("스캔 오류:", error);
      statusEl.textContent = "스캔 오류";
      resultEl.textContent = error.message;
    }
  }, 500);
}