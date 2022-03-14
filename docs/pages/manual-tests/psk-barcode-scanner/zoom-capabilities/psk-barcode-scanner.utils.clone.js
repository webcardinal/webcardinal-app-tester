export function setVideoStream(video, stream) {
    return new Promise((resolve) => {
        video.addEventListener("loadedmetadata", () => resolve(), false);
        video.srcObject = stream;
    });
}
