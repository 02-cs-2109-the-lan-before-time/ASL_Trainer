
const body = document.body
const videoRef = document.querySelector('video');
let startButton = document.getElementById('train_button');
startButton.addEventListener("click", startWebCam)
let labels = []

var constraints = { video: { frameRate: { ideal: 10, max: 15 } } };
function startWebCam(event) {
    startButton.remove()
    getMedia(videoRef)
    let labels = prompt("Enter Labels:",)
    //call makeLabel class method
    createLabelButtons()
    
    runCamera()
}

function createLabelButtons(labels){
    let captureButton = document.createElement('button')
    captureButton.innerHTML="Train Label A"
    body.append(captureButton)
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
   let transformedData = []
    let landMarks =  results.multiHandLandmarks
 
    if(landMarks.length > 0){
        let handOne = landMarks[0]
         console.log(handOne)
    }
    //   console.log(transformedData)
        
    }
    
   

function transformData(arr){
   
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
  
  
  const camera = new Camera(videoRef, {
    onFrame: async () => {
      await hands.send({image: videoRef});
    },
    width: 640,
    height: 400
  });

function runCamera(){
    camera.start()
    setInterval(function(){ 
        console.log("GO!")
        hands.onResults(onResults);
     }, 3000);
    
}
 