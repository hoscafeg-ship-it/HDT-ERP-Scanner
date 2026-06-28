import { video, setStatus } from "./ui.js";

export async function startCamera() {
  setStatus("카메라 권한 요청 중...");

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

  setStatus("카메라 실행 성공");

  return stream;
}