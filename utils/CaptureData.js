class CaptureData {
  dataSet;
  labels;
  constructor(dataSet, labels) {
    this.dataSet = dataSet;
    this.labels = labels;
  }
  get labels() {
    return this.labels;
  }
  get dataSet() {
    return this.dataSet;
  }
  makeLabels(labelStr) {
    labelStr = labelStr.split(",");
    for (let i = 0; i < labelStr.length; i++) {
      this.labels[labelStr[i]] = i;
    }
  }
  addFramesToData(frame, classification) {
    let res = frame.reduce(function (previousValue, currentValue) {
      previousValue.push(currentValue.x, currentValue.y, currentValue.z);
      return previousValue;
    }, []);

    this.dataSet.push([...res, classification]);
  }
}

// let test = new CaptureData([],{})
// test.makeLabels('a,b,c')
// const landmarks = [
//   {x: "0.2", y: "0.3", z:"0.4"},
//   {x: "0.2", y: "0.3", z:"0.4"},
//   {x: "0.8", y: "0.6", z:"0.2"},
//   {x: "0.3", y: "0.5", z:"0.1"}
//   ]
// test.addFramesToData(landmarks, 'a')
// test.addFramesToData(landmarks, 'b')
// console.log(test.dataSet)
