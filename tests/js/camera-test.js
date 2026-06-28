console.log("camera-test.js 로드됨");

const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const video = document.getElementById("video");

console.log("startBtn:", startBtn);
console.log("statusEl:", statusEl);
console.log("video:", video);

if (!startBtn) {
  console.error("startBtn을 찾지 못함. HTML id 확인 필요");
} else {
  startBtn.addEventListener("click", async () => {
    console.log("카메라 시작 버튼 클릭됨");

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
      resultEl.textContent = "이제 버튼 연결은 정상입니다.";
    } catch (error) {
      console.error("카메라 실행 실패:", error);
      statusEl.textContent = "카메라 실행 실패: " + error.message;
    }
  });
}