import { startBtn, setStatus, setResult } from "./ui.js";
import { startCamera } from "./camera.js";
import { startScanner } from "./scanner.js";

console.log("SCAN-GO V4 QUICK MAIN 로드됨");

setStatus("JS 로드 성공: SCAN-GO-V4-QUICK-001");
setResult("카메라 시작 버튼을 눌러주세요.");

startBtn.addEventListener("click", async () => {
  try {
    startBtn.disabled = true;

    await startCamera();
    startScanner();
  } catch (error) {
    console.error(error);
    setStatus("오류 발생");
    setResult(`${error.name}: ${error.message}`);
    startBtn.disabled = false;
  }
});