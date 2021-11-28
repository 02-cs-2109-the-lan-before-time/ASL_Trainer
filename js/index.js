


const body = document.body

let startButton = document.getElementById('train_button');
startButton.addEventListener("click", startWebCam)

var constraints = { video: { frameRate: { ideal: 10, max: 15 } } };
function startWebCam(event) {
    tf.tensor([1, 2, 3, 4]).print();
    // startWebStream()
    getMedia()
 


}


async function startWebStream() {
    const videoElement = document.getElementById("web_cam")
    videoElement.width = 640;
    videoElement.height = 400;
    
   
}

async function getMedia() {
   let constraints = { audio: false, video: { width: 640, height: 400 } };

    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
      let video = document.querySelector('video');
      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e) {
        video.play();
      };
    })
    .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
  }


