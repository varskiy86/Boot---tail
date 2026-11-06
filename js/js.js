const playCircleSvg = document.getElementById("play_circle");
const pauseCircleSvg = document.getElementById("pause_circle");

function showPauseButton() {
    playCircleSvg.classList.add("hidden");
    pauseCircleSvg.classList.remove("hidden");
}

function showPlayButton() {
    playCircleSvg.classList.remove("hidden");
    pauseCircleSvg.classList.add("hidden");
}

playCircleSvg.addEventListener("click", showPauseButton);
pauseCircleSvg.addEventListener("click", showPlayButton);
