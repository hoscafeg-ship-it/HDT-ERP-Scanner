console.log("V4-IMAGEDATA-TEST-001 로드됨");

const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

statusEl.textContent = "JS 로드 성공: V4-IMAGEDATA-TEST-001";
resultEl.textContent = "버튼을 눌러 ImageData 테스트를 시작하세요.";

let timer = null;

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
    resultEl.textContent = "1초마다 ImageData 확인 중...";

    if (timer) return;

    timer = setInterval(() => {
      if (video.readyState < 2) {
        resultEl.textContent = "비디오 준비 대기 중...";
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      resultEl.textContent =
        `ImageData 성공: ${imageData.width} x ${imageData.height} / ${imageData.data.length}`;
    }, 1000);
  } catch (error) {
    console.error(error);
    statusEl.textContent = "오류 발생";
    resultEl.textContent = error.message;
  }
});