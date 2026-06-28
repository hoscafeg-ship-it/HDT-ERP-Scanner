console.log("V4-BARCODE-SCAN-001 로드됨");

const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

statusEl.textContent = "JS 로드 성공: V4-BARCODE-SCAN-001";
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

    if (!scanImageData) {
      statusEl.textContent = "scanImageData 없음";
      resultEl.textContent = "zbar 로딩은 됐지만 scanImageData를 찾지 못했습니다.";
      return;
    }

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

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const symbols = await scanImageData(imageData);

      if (symbols && symbols.length > 0) {
        const symbol = symbols[0];
        const value = symbol.decode();

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