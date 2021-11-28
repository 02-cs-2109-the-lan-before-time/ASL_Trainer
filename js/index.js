


const body = document.body
const videoRef = document.querySelector('video');
let startButton = document.getElementById('train_button');
startButton.addEventListener("click", startWebCam)

var constraints = { video: { frameRate: { ideal: 10, max: 15 } } };
function startWebCam(event) {
    getMedia(videoRef)

}

async function getMedia(video) {
   let constraints = { audio: false, video: { width: 640, height: 400 } };

    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
      
      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e) {
        video.play();
      };
    })
    .catch(function(err) { console.log(err.name + ": " + err.message); }); 
  }

//mediaPipe

function onResults(results){
    console.log(results.multiHandLandmarks)
}



  const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }});
  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  hands.onResults(onResults);
  
  const camera = new Camera(videoRef, {
    onFrame: async () => {
      await hands.send({image: videoRef});
    },
    width: 1280,
    height: 720
  });
//   camera.start();