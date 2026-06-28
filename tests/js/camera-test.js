console.log("camera-test.js 로드됨");

const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

let copyTimer = null;
let count = 0;

if (!startBtn) {
  console.error("startBtn을 찾지 못함. HTML id 확인 필요");
} else {
  startBtn.addEventListener("click", async () => {
    try {
      statusEl.textContent = "카메라 권한 요청 중...";

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      video.srcObject = stream;
      await video.play();

      statusEl.textContent = "카메라 실행 성공";
      resultEl.textContent = "ImageData 테스트 시작됨";

      startImageDataTest();
    } catch (error) {
      console.error("카메라 실행 실패:", error);
      statusEl.textContent = "카메라 실행 실패: " + error.message;
    }
  });
}

function startImageDataTest() {
  if (copyTimer) return;

  copyTimer = setInterval(() => {
    try {
      count++;

      if (video.readyState < 2) {
        resultEl.textContent = `대기 중... video.readyState: ${video.readyState}`;
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      statusEl.textContent = "ImageData 확인 성공";
      resultEl.textContent =
        `ImageData 성공 ${count}회: ${imageData.width} x ${imageData.height} / data: ${imageData.data.length}`;
    } catch (error) {
      console.error("ImageData 오류:", error);
      statusEl.textContent = "ImageData 오류 발생";
      resultEl.textContent = error.message;
    }
  }, 1000);
}