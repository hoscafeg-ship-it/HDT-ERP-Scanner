export const startBtn = document.getElementById("startBtn");
export const statusEl = document.getElementById("status");
export const resultEl = document.getElementById("result");
export const video = document.getElementById("video");
export const canvas = document.getElementById("canvas");

export function setStatus(message) {
  statusEl.textContent = message;
}

export function setResult(message) {
  resultEl.textContent = message;
}