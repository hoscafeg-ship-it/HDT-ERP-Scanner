console.log("V4-ZBAR-DEBUG-001 로드됨");

const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

statusEl.textContent = "JS 로드 성공: V4-ZBAR-DEBUG-001";
resultEl.textContent = "카메라 시작 버튼을 눌러주세요.";

let scanImageData = null;

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
    resultEl.textContent = "zbar import 테스트 중...";

    await testZbarImport();
  } catch (error) {
    statusEl.textContent = "전체 오류";
    resultEl.textContent = `${error.name}: ${error.message}`;
    console.error(error);
  }
});

async function testZbarImport() {
  try {
    const zbar = await import("@undecaf/zbar-wasm");

    resultEl.textContent =
      "zbar import 성공 / keys: " + Object.keys(zbar).join(", ");

    if (zbar.setModuleArgs) {
      zbar.setModuleArgs({
        locateFile: (filename, directory) => {
          console.log("locateFile:", filename, directory);
          return "/HDT-ERP-Scanner/zbar.wasm";
        },
      });
    }

    scanImageData = zbar.scanImageData;

    if (!scanImageData) {
      statusEl.textContent = "zbar import는 됐지만 scanImageData 없음";
      return;
    }

    statusEl.textContent = "zbar import 성공";
    resultEl.textContent = "scanImageData 준비 완료";
  } catch (error) {
    statusEl.textContent = "zbar import 실패";
    resultEl.textContent = `${error.name}: ${error.message}`;
    console.error("zbar import 실패:", error);
  }
}