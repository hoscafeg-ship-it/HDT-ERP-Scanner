import { video, canvas, setStatus, setResult } from "./ui.js";
import { scanImageData } from "@undecaf/zbar-wasm";

const ctx = canvas.getContext("2d", { willReadFrequently: true });

let timer = null;
let lastValue = "";

export function startScanner() {
  if (timer) return;

  setStatus("스캔 준비 완료");
  setResult("바코드를 초록색 박스 안에 비춰주세요.");

  timer = setInterval(async () => {
    try {
      if (video.readyState < 2) return;

      const vw = video.videoWidth;
      const vh = video.videoHeight;

      const sx = Math.floor(vw * 0.15);
      const sy = Math.floor(vh * 0.35);
      const sw = Math.floor(vw * 0.7);
      const sh = Math.floor(vh * 0.3);

      canvas.width = sw;
      canvas.height = sh;

      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

      const imageData = ctx.getImageData(0, 0, sw, sh);
      const symbols = await scanImageData(imageData);

      if (symbols && symbols.length > 0) {
        const value = symbols[0].decode();

        if (value && value !== lastValue) {
          lastValue = value;
          setStatus("스캔 성공");
          setResult(`스캔 성공: ${value}`);
          console.log("스캔 성공:", value);
        }
      } else {
        setStatus("스캔 중...");
      }
    } catch (error) {
      console.error("스캔 오류:", error);
      setStatus("스캔 오류");
      setResult(error.message);
    }
  }, 400);
}