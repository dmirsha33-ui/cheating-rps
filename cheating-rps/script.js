// ======================================================
// CHEATING ROCK PAPER SCISSORS
// CAMERA + HAND DETECTION + AUDIO
// ======================================================


// ======================================================
// AUDIO
// ======================================================

const winSound =
    new Audio("sound/win.mp3");

const lossSound =
    new Audio("sound/loss.mp3");

const drawSound =
    new Audio("sound/draw.mp3");

const cheatSound =
    new Audio("sound/cheat.mp3");


// ======================================================
// GAME VARIABLES
// ======================================================

let playerScore = 0;

let computerScore = 0;

let cameraRunning = false;

let gameLocked = false;

let lastDetectedGesture = null;

let stableGestureCount = 0;

let detectionInProgress = false;


// ======================================================
// EMOJIS
// ======================================================

const emojis = {

    rock: "🪨",

    paper: "📄",

    scissors: "✂️"

};


// ======================================================
// PLAY AUDIO
// ======================================================

function playSound(sound) {

    sound.currentTime = 0;

    sound.play().catch(error => {

        console.log(
            "Audio playback blocked:",
            error
        );

    });

}


// ======================================================
// COMPUTER CHOICE
// ======================================================

function getComputerChoice() {

    const choices = [
        "rock",
        "paper",
        "scissors"
    ];

    const randomIndex =
        Math.floor(
            Math.random() * choices.length
        );

    return choices[randomIndex];
}


// ======================================================
// DOES PLAYER WIN?
// ======================================================

function playerWins(
    player,
    computer
) {

    return (

        (
            player === "rock" &&
            computer === "scissors"
        )

        ||

        (
            player === "paper" &&
            computer === "rock"
        )

        ||

        (
            player === "scissors" &&
            computer === "paper"
        )

    );
}


// ======================================================
// MAIN GAME
// ======================================================

function playGame(playerChoice) {

    // Prevent another game while countdown is running

    if (gameLocked) {

        return;

    }


    gameLocked = true;


    // ------------------------------------------
    // COMPUTER CHOICE
    // ------------------------------------------

    let computerChoice =
        getComputerChoice();


    // ------------------------------------------
    // CHEATING
    // ------------------------------------------

    let computerCheats =
        Math.random() < 0.30;


    if (computerCheats) {

        if (playerChoice === "rock") {

            computerChoice = "paper";

        }

        else if (
            playerChoice === "paper"
        ) {

            computerChoice = "scissors";

        }

        else if (
            playerChoice === "scissors"
        ) {

            computerChoice = "rock";

        }

    }


    // ------------------------------------------
    // SHOW CHOICES
    // ------------------------------------------

    document.getElementById(
        "playerEmoji"
    ).textContent =
        emojis[playerChoice];


    document.getElementById(
        "computerEmoji"
    ).textContent =
        emojis[computerChoice];


    // ------------------------------------------
    // ANIMATION
    // ------------------------------------------

    document.getElementById(
        "playerEmoji"
    ).classList.add("shake");


    document.getElementById(
        "computerEmoji"
    ).classList.add("shake");


    setTimeout(() => {

        document.getElementById(
            "playerEmoji"
        ).classList.remove("shake");


        document.getElementById(
            "computerEmoji"
        ).classList.remove("shake");

    }, 500);


    // ------------------------------------------
    // ELEMENTS
    // ------------------------------------------

    const result =
        document.getElementById("result");


    const cheatMessage =
        document.getElementById(
            "cheatMessage"
        );


    cheatMessage.textContent = "";


    // ------------------------------------------
    // DRAW
    // ------------------------------------------

    if (
        playerChoice ===
        computerChoice
    ) {

        result.textContent =
            "🤝 IT'S A DRAW!";

        result.style.color =
            "#f39c12";

        playSound(drawSound);

        setTimeout(() => {

            gameLocked = false;

        }, 1800);

        return;
    }


    // ------------------------------------------
    // PLAYER WIN
    // ------------------------------------------

    if (
        playerWins(
            playerChoice,
            computerChoice
        )
    ) {

        playerScore++;


        document.getElementById(
            "playerScore"
        ).textContent =
            playerScore;


        result.textContent =
            "🏆 YOU WIN!";


        result.style.color =
            "#27ae60";


        cheatMessage.textContent =
            "🎉 The computer got beaten!";


        playSound(winSound);


        document.getElementById(
            "playerEmoji"
        ).classList.add(
            "winner-animation"
        );


        setTimeout(() => {

            document.getElementById(
                "playerEmoji"
            ).classList.remove(
                "winner-animation"
            );

        }, 700);


        setTimeout(() => {

            gameLocked = false;

        }, 1800);


        return;
    }


    // ------------------------------------------
    // COMPUTER WIN
    // ------------------------------------------

    computerScore++;


    document.getElementById(
        "computerScore"
    ).textContent =
        computerScore;


    result.textContent =
        "😈 COMPUTER WINS!";


    result.style.color =
        "#e74c3c";


    // ------------------------------------------
    // CHEAT MESSAGE
    // ------------------------------------------

    if (computerCheats) {

        cheatMessage.textContent =
            "🚨 CHEATING DETECTED! 😈";


        playSound(cheatSound);

    }

    else {

        cheatMessage.textContent =
            "🤖 The computer got lucky!";


        playSound(lossSound);

    }


    document.getElementById(
        "computerEmoji"
    ).classList.add(
        "winner-animation"
    );


    setTimeout(() => {

        document.getElementById(
            "computerEmoji"
        ).classList.remove(
            "winner-animation"
        );

    }, 700);


    setTimeout(() => {

        gameLocked = false;

    }, 1800);

}


// ======================================================
// CAMERA
// ======================================================

let videoElement =
    document.getElementById("camera");

let canvasElement =
    document.getElementById(
        "outputCanvas"
    );

let canvasCtx =
    canvasElement.getContext("2d");


// ======================================================
// MEDIAPIPE HANDS
// ======================================================

const hands =
    new Hands({

        locateFile: (file) => {

            return (
                "https://cdn.jsdelivr.net/npm/@mediapipe/hands/"
                + file
            );

        }

    });


hands.setOptions({

    maxNumHands: 1,

    modelComplexity: 1,

    minDetectionConfidence: 0.7,

    minTrackingConfidence: 0.7

});


// ======================================================
// HAND DETECTION RESULTS
// ======================================================

hands.onResults(
    onHandResults
);


// ======================================================
// START CAMERA
// ======================================================

async function startCamera() {

    if (cameraRunning) {

        return;

    }


    const status =
        document.getElementById(
            "cameraStatus"
        );


    const button =
        document.getElementById(
            "cameraButton"
        );


    try {

        // Ask browser for camera permission

        const stream =
            await navigator.mediaDevices
                .getUserMedia({

                    video: true,

                    audio: false

                });


        videoElement.srcObject =
            stream;


        await videoElement.play();


        cameraRunning = true;


        button.textContent =
            "📷 Camera Running";


        button.disabled = true;


        status.textContent =
            "Show Rock, Paper or Scissors";


        status.style.background =
            "rgba(39, 174, 96, 0.85)";


        // Start processing frames

        processCamera();


    }

    catch (error) {

        console.error(error);


        status.textContent =
            "❌ Camera permission denied";


        alert(
            "Please allow camera access in your browser and try again."
        );

    }

}


// ======================================================
// PROCESS CAMERA
// ======================================================

async function processCamera() {

    if (!cameraRunning) {

        return;

    }


    if (
        videoElement.readyState >= 2
    ) {

        await hands.send({

            image: videoElement

        });

    }


    requestAnimationFrame(
        processCamera
    );

}


// ======================================================
// HAND RESULTS
// ======================================================

function onHandResults(results) {

    // Resize canvas

    canvasElement.width =
        videoElement.videoWidth;

    canvasElement.height =
        videoElement.videoHeight;


    // Clear previous drawing

    canvasCtx.clearRect(
        0,
        0,
        canvasElement.width,
        canvasElement.height
    );


    // No hand detected

    if (
        !results.multiHandLandmarks ||
        results.multiHandLandmarks.length === 0
    ) {

        document.getElementById(
            "cameraStatus"
        ).textContent =
            "👋 Show your hand";


        document.getElementById(
            "detectedGesture"
        ).textContent =
            "Waiting...";


        lastDetectedGesture =
            null;

        stableGestureCount =
            0;

        return;

    }


    // Get first hand

    const landmarks =
        results.multiHandLandmarks[0];


    // Draw hand landmarks

    drawConnectors(
        canvasCtx,
        landmarks,
        HAND_CONNECTIONS,
        {
            color: "#ffffff",
            lineWidth: 3
        }
    );


    drawLandmarks(
        canvasCtx,
        landmarks,
        {
            color: "#ff0000",
            lineWidth: 2
        }
    );


    // Detect gesture

    const gesture =
        detectGesture(
            landmarks
        );


    // Show gesture

    document.getElementById(
        "detectedGesture"
    ).textContent =
        gesture
            ? gesture.toUpperCase()
            : "UNKNOWN";


    // If gesture is valid

    if (gesture) {

        handleStableGesture(
            gesture
        );

    }

}


// ======================================================
// DETECT ROCK / PAPER / SCISSORS
// ======================================================

function detectGesture(
    landmarks
) {

    /*
        Finger landmarks:

        INDEX
        tip = 8
        pip = 6

        MIDDLE
        tip = 12
        pip = 10

        RING
        tip = 16
        pip = 14

        PINKY
        tip = 20
        pip = 18
    */


    const indexExtended =
        landmarks[8].y <
        landmarks[6].y;


    const middleExtended =
        landmarks[12].y <
        landmarks[10].y;


    const ringExtended =
        landmarks[16].y <
        landmarks[14].y;


    const pinkyExtended =
        landmarks[20].y <
        landmarks[18].y;


    const extendedCount = [

        indexExtended,

        middleExtended,

        ringExtended,

        pinkyExtended

    ].filter(Boolean).length;


    // ------------------------------------------
    // ROCK
    // ------------------------------------------

    if (
        extendedCount === 0
    ) {

        return "rock";

    }


    // ------------------------------------------
    // PAPER
    // ------------------------------------------

    if (
        extendedCount >= 3
    ) {

        return "paper";

    }


    // ------------------------------------------
    // SCISSORS
    // ------------------------------------------

    if (
        indexExtended &&
        middleExtended &&
        !ringExtended &&
        !pinkyExtended
    ) {

        return "scissors";

    }


    return null;

}


// ======================================================
// STABLE GESTURE
// ======================================================

function handleStableGesture(
    gesture
) {

    // Same gesture as previous frame

    if (
        gesture ===
        lastDetectedGesture
    ) {

        stableGestureCount++;

    }

    else {

        lastDetectedGesture =
            gesture;

        stableGestureCount =
            1;

    }


    /*
        Require several frames
        before playing the game.

        This prevents accidental
        camera movements from
        starting the game.
    */

    if (
        stableGestureCount >= 15 &&
        !detectionInProgress &&
        !gameLocked
    ) {

        detectionInProgress =
            true;


        startCountdown(
            gesture
        );

    }

}


// ======================================================
// COUNTDOWN
// ======================================================

function startCountdown(
    gesture
) {

    const countdown =
        document.getElementById(
            "countdown"
        );


    let number = 3;


    countdown.textContent =
        number;


    const timer =
        setInterval(() => {

            number--;


            if (number > 0) {

                countdown.textContent =
                    number;

            }


            else {

                clearInterval(timer);


                countdown.textContent =
                    "GO!";


                playGame(
                    gesture
                );


                setTimeout(() => {

                    countdown.textContent =
                        "";


                    detectionInProgress =
                        false;


                    stableGestureCount =
                        0;


                    lastDetectedGesture =
                        null;

                }, 1800);

            }

        }, 700);

}


// ======================================================
// RESET GAME
// ======================================================

function resetGame() {

    playerScore = 0;

    computerScore = 0;


    document.getElementById(
        "playerScore"
    ).textContent =
        "0";


    document.getElementById(
        "computerScore"
    ).textContent =
        "0";


    document.getElementById(
        "playerEmoji"
    ).textContent =
        "❔";


    document.getElementById(
        "computerEmoji"
    ).textContent =
        "❔";


    document.getElementById(
        "detectedGesture"
    ).textContent =
        "Waiting...";


    document.getElementById(
        "result"
    ).textContent =
        "Show your hand to start!";


    document.getElementById(
        "result"
    ).style.color =
        "#333";


    document.getElementById(
        "cheatMessage"
    ).textContent =
        "";


    document.getElementById(
        "countdown"
    ).textContent =
        "";


    gameLocked =
        false;


    detectionInProgress =
        false;


    stableGestureCount =
        0;


    lastDetectedGesture =
        null;

}