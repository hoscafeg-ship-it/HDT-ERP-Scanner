console.log("V4-ROI-SCAN-001 로드됨");

const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

statusEl.textContent = "JS 로드 성공: V4-ROI-SCAN-001";
resultEl.textContent = "카메라 시작 버튼을 눌러주세요.";

let scanImageData = null;
let timer = null;
let lastValue = "";

startBtn.addEventListener("click", async () => {
  try {
    startBtn.disabled = true;
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
    resultEl.textContent = "zbar 로딩 중...";

    const zbar = await import("@undecaf/zbar-wasm");
    scanImageData = zbar.scanImageData;

    statusEl.textContent = "스캔 준비 완료";
    resultEl.textContent = "바코드를 초록색 박스 안에 비춰주세요.";

    startScanLoop();
  } catch (error) {
    console.error(error);
    statusEl.textContent = "오류 발생";
    resultEl.textContent = `${error.name}: ${error.message}`;
    startBtn.disabled = false;
  }
});

function startScanLoop() {
  if (timer) return;

  timer = setInterval(async () => {
    try {
      if (!scanImageData) return;
      if (video.readyState < 2) return;

      const vw = video.videoWidth;
      const vh = video.videoHeight;

      // 초록 박스 영역: 화면 중앙 가로 70%, 세로 30%
      const sx = Math.floor(vw * 0.15);
      const sy = Math.floor(vh * 0.35);
      const sw = Math.floor(vw * 0.70);
      const sh = Math.floor(vh * 0.30);

      canvas.width = sw;
      canvas.height = sh;

      ctx.drawImage(
        video,
        sx, sy, sw, sh,
        0, 0, sw, sh
      );

      const imageData = ctx.getImageData(0, 0, sw, sh);
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
  }, 400);
}