const video = document.getElementById("cameraVideo");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const statusText = document.getElementById("statusText");
const resolutionText = document.getElementById("resolutionText");
const cameraText = document.getElementById("cameraText");

let cameraStream = null;

startBtn.addEventListener("click", startCamera);
stopBtn.addEventListener("click", stopCamera);

async function startCamera() {
  try {
    statusText.textContent = "카메라 준비중...";

    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    });

    video.srcObject = cameraStream;
    await video.play();

    const videoTrack = cameraStream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();

    statusText.textContent = "카메라 실행중";
    resolutionText.textContent = `${settings.width || "-"} x ${settings.height || "-"}`;
    cameraText.textContent = settings.facingMode || videoTrack.label || "카메라";

  } catch (error) {
    console.error(error);
    statusText.textContent = "카메라 오류";
    resolutionText.textContent = "-";
    cameraText.textContent = error.message;
  }
}

function stopCamera() {
  if (!cameraStream) return;

  cameraStream.getTracks().forEach((track) => track.stop());
  cameraStream = null;
  video.srcObject = null;

  statusText.textContent = "카메라 종료";
}