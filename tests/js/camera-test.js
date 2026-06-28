console.log("V4-ZBAR-TIMEOUT-001 로드됨");

const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

statusEl.textContent = "JS 로드 성공: V4-ZBAR-TIMEOUT-001";
resultEl.textContent = "카메라 시작 버튼을 눌러주세요.";

startBtn.addEventListener("click", async () => {
  try {
    statusEl.textContent = "카메라 권한 요청 중...";

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });

    video.srcObject = stream;
    await video.play();

    statusEl.textContent = "카메라 실행 성공";
    resultEl.textContent = "zbar import 시작됨...";

    await testZbarImportWithTimeout();
  } catch (error) {
    statusEl.textContent = "전체 오류";
    resultEl.textContent = `${error.name}: ${error.message}`;
    console.error(error);
  }
});

async function testZbarImportWithTimeout() {
  let timeoutId = null;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("zbar import 5초 타임아웃"));
    }, 5000);
  });

  try {
    const importPromise = import("@undecaf/zbar-wasm");

    const zbar = await Promise.race([
      importPromise,
      timeoutPromise
    ]);

    clearTimeout(timeoutId);

    statusEl.textContent = "zbar import 성공";
    resultEl.textContent = "exports: " + Object.keys(zbar).join(", ");

    if (!zbar.scanImageData) {
      statusEl.textContent = "scanImageData 없음";
      resultEl.textContent = "zbar 안에 scanImageData가 없습니다.";
      return;
    }

    resultEl.textContent = "scanImageData 준비 완료";
  } catch (error) {
    statusEl.textContent = "zbar 로딩 실패 또는 멈춤";
    resultEl.textContent = error.message;
    console.error(error);
  }
}