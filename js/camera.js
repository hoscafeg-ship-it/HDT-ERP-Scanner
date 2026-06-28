let stream = null;

export async function startCamera(videoElement) {

    try {

        stream = await navigator.mediaDevices.getUserMedia({

            video: {

                facingMode: "environment",

                width: { ideal: 1920 },

                height: { ideal: 1080 }

            }

        });

        videoElement.srcObject = stream;

        await videoElement.play();

        console.log("📷 Camera Started");

    } catch (err) {

        console.error(err);

    }

}

export function stopCamera() {

    if (!stream) return;

    stream.getTracks().forEach(track => track.stop());

    stream = null;

    console.log("📷 Camera Stopped");

}