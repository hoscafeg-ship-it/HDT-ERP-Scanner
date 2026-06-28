let stream = null;

export async function startCamera(video) {

    if (stream) return stream;

    const constraints = {
        video: {
            facingMode: {
                ideal: "environment"
            },
            width: {
                ideal: 1920
            },
            height: {
                ideal: 1080
            }
        },
        audio: false
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints);

    video.srcObject = stream;

    await video.play();

    return stream;
}

export function stopCamera() {

    if (!stream) return;

    stream.getTracks().forEach(track => track.stop());

    stream = null;
}