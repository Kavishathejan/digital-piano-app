function playSound(note) {
    var audio = new Audio("sounds/" + note + ".mp3");
    audio.play();
    if (mediaRecorder.state === "recording") {
        recordedNotes.push({ note, time: Date.now() - startTime });
    }
}

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let destination = audioContext.createMediaStreamDestination();
let mediaRecorder = new MediaRecorder(destination.stream);
let recordedChunks = [];
let recordedNotes = [];
let startTime;

document.getElementById("startRecord").addEventListener("click", () => {
    recordedChunks = [];
    recordedNotes = [];
    startTime = Date.now();
    mediaRecorder.start();
    document.getElementById("startRecord").disabled = true;
    document.getElementById("stopRecord").disabled = false;
});

document.getElementById("stopRecord").addEventListener("click", () => {
    mediaRecorder.stop();
    document.getElementById("startRecord").disabled = false;
    document.getElementById("stopRecord").disabled = true;
    document.getElementById("playRecord").disabled = false;
});

mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
};

mediaRecorder.onstop = () => {
    let recordedBlob = new Blob(recordedChunks, { type: "audio/webm" });
    let audioURL = URL.createObjectURL(recordedBlob);
    document.getElementById("audioPlayer").src = audioURL;
};

document.getElementById("playRecord").addEventListener("click", () => {
    if (recordedNotes.length === 0) return;
    let startPlaybackTime = Date.now();
    recordedNotes.forEach(({ note, time }) => {
        setTimeout(() => playSound(note), time);
    });
});
