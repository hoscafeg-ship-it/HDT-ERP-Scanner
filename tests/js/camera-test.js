const video = document.querySelector("#camera");
const resultBox = document.querySelector("#result");
const startBtn = document.querySelector("#startBtn");

function log(msg) {
  console.log(msg);
  resultBox.textContent = msg;
}

startBtn.addEventListener("click", async () => {
  log("버튼 클릭됨! 카메라 권한 요청 중...");

  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      log("카메라 API 없음. HTTPS 주소에서 접속해야 합니다.");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment"
      },
      audio: false
    });

    video.srcObject = stream;
    await video.play();

    log("카메라 실행 성공!");

  } catch (err) {
    console.error(err);
    log("카메라 실행 실패: " + err.message);
  }
});