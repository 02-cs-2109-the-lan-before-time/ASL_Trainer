let trainingButton = document.getElementById("train_model");
trainingButton.addEventListener("click", startTraining);

async function load_process_data() {
  let AD_df = await dfd.read_csv(
    "https://docs.google.com/spreadsheets/d/1nBP6rdesizWW0hamkI11Dk1eB3uJz2G5wglAq6pT5To/export?format=csv&gid=0"
  );

  return AD_df;
}

async function startTraining() {
  let data = await load_process_data();
  let preppedData = await prepareTrainingData(data);
  const [xTrain, yTrain, xTest, yTest] = 
convertToTensors(preppedData);
 let trainedModel = await trainModel(xTrain, yTrain, xTest, yTest);
   await makePredictions(trainedModel)
}

function prepareTrainingData(data) {
  //tidy cleans up unecessary tensors after execution
  return tf.tidy(() => {
    let encode = new dfd.OneHotEncoder();
    encode.fit(data[63]);
    console.log(encode.label); // [a, b,c, d]

    let labels = encode.transform(data[63].values);
    const inputs = data.iloc({ columns: ["0:63"] });
    return { labels, inputs };
  });
}

function convertToTensors(data) {
  const testSplit = 0.2;
  const futureXs = data.inputs.values;
  const futureYs = data.labels.values;

  if (futureXs.length !== futureYs.length) {
    throw new Error("unequal lengths");
  }

  const numOfTestData = Math.round(futureXs.length * testSplit);
  const numOfTrainingData = futureXs.length - numOfTestData; //321

  const flattenedFutureYs = futureYs.flat();
  let numOfClasses = 4;
  const xs = tf.tensor2d(futureXs, [futureXs.length, 63]);
  const ys = tf.oneHot(tf.tensor1d(flattenedFutureYs).toInt(), numOfClasses);

  const x_Train = xs.slice([0, 0], [numOfTrainingData, 63]);
  const x_Test = xs.slice([numOfTrainingData, 0], numOfTestData, 63);

  const y_Train = ys.slice([0, 0], numOfTrainingData, numOfClasses);
  const y_Test = ys.slice([0, 0], numOfTestData, numOfClasses);

  return [
        x_Train, y_Train, x_Test, y_Test
    ];
}

async function trainModel(xTrain, yTrain, xTest, yTest) {
        const xTrains = []
    // const yTrains = []
    // const XTests = []
    // const yTests = []
    // const [x_Train, y_Train, XTest, YTest] = convertToTensors()
    
   let x_TrainArray = xTrain.dataSync()
   let y_TrainArray = yTrain.dataSync()
   let x_TestArray = xTest.dataSync()
   let y_TestArray = yTest.dataSync()
   
//  console.log(x_TrainArray)
//  console.log(y_TrainArray)
//  let YT = tf.tensor(y_TrainArray, [4,1284])
//  YT.print()
   
    for(let i = 0; i < 4; i++){
       xTrains.push( tf.tensor(x_TrainArray[i]))
       
    }

   
    let yT = tf.reshape(yTrain , [1284])
    let xT = tf.reshape(xTrain, [20223])
    let testY = tf.reshape(yTest, [320])
    let testX = tf.reshape(xTest, [5040])
//     const axis = 0
//    let x = tf.tensor([[1,2,3,4,5,6]])
//    tf.reshape( xTrain, (1))
    // let xT = tf.reshape(xTrain, [-1])
    // let yT = tf.reshape(yTrain, [-1])
    // let testX = tf.reshape(xTest, [-1])
    // // let testy = tf.reshape(yTest, [-1])
    // yT.print()



  const model = tf.sequential();
  const learningRate = 0.01;
  const numberOfEpochs = 40;
  const optimizer = tf.train.adam(learningRate);

  model.add(
    tf.layers.dense({ units: 10, activation: "sigmoid", inputShape: [63] })
  );

  model.add(tf.layers.dense({ units: 4, activation: "softmax" }));
  model.compile({
      optimizer:optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
  })
 model.summary()
  const history = await model.fit(xTrain, yTrain,
    {epochs: numberOfEpochs, validtaionData: [testX, testY], 
        callbacks: {
            onEpochEnd:async (epoch, logs) => {
                console.log("Epoch: ", epoch + "Logs:" + logs.loss);
                await tf.nextFrame();
            },
        }
    
    })
    return model
}


let testData = [0.25576308369636536, 0.8778154253959656, -2.3068379562118935e-7, 0.2902066111564636, 0.8212407231330872, -0.0184430330991745, 0.3009176552295685, 0.7329487204551697, -0.02239140123128891, 0.2955332398414612, 0.6612422466278076, -0.026378732174634933, 0.28721773624420166, 0.6054319143295288, -0.027015147730708122, 0.2722373604774475, 0.6703200340270996, 0.004224363714456558, 0.26405176520347595, 0.6409764885902405, -0.022430365905165672, 0.2667911946773529, 0.7033108472824097, -0.03618471324443817, 0.26881298422813416, 0.7428262233734131, -0.038912203162908554, 0.24065427482128143, 0.6780329942703247, 0.0068706790916621685, 0.2320650964975357, 0.658726692199707, -0.01928725652396679, 0.24142205715179443, 0.7286035418510437, -0.02382008731365204, 0.24876011908054352, 0.7602354288101196, -0.018144307658076286, 0.21134470403194427, 0.6982598304748535, 0.003808746114373207, 0.2020648866891861, 0.6909139156341553, -0.023949967697262764, 0.21955636143684387, 0.7562288045883179, -0.018040405586361885, 0.23252740502357483, 0.7834003567695618, -0.00472765089944005, 0.18432866036891937, 0.7263815402984619, -0.0007265191525220871, 0.17822913825511932, 0.7227623462677002, -0.01765076257288456, 0.19690002501010895, 0.7710147500038147, -0.011929525062441826, 0.21064981818199158, 0.7924315929412842, -0.0008994226227514446]

let test2 =  [0.46406087279319800	,0.8141422271728520,	1.93386270552764E-07	,0.5077118873596190	,0.7677007913589480	-0.015704015269875500	,0.5367959141731260	,0.6735906600952150	-0.01907973736524580	,0.5272511839866640,	0.5960525870323180	-0.02236662432551380,	0.48889246582984900	,0.5733056664466860	-0.025979239493608500	,0.5331968069076540,	0.5751134753227230	-0.0026107553858310000	,0.5412641763687130,	0.4795197546482090	-0.014075377956032800	,0.5425779223442080,	0.41893017292022700	-0.026235872879624400	,0.5417758822441100	,0.36915987730026200	-0.03584976866841320	,0.5074641108512880	,0.5623173713684080	-0.0067563788034021900	,0.5132301449775700	,0.45743969082832300	-0.016602234914898900	,0.5162407755851750,	0.38784173130989100,	-0.028525834903121000	,0.516354501247406,	0.3315085768699650	-0.03719216212630270	,0.4810885787010190,	0.5699123740196230	-0.014035895466804500	,0.4859253168106080,	0.46841055154800400	-0.025367265567183500	,0.48919960856437700,	0.40288400650024400	-0.036363035440444900	,0.4891781508922580,	0.3482167720794680	-0.043904125690460200	,0.452035129070282	,0.5918523669242860	-0.02329445444047450	,0.45324233174324000	,0.5155727863311770	-0.034546859562397,	0.45421913266181900	,0.46527671813964800,	-0.04003487527370450	,0.453725129365921	,0.42011746764183000,	-0.04370671138167380,
    0.4626551568508150,	0.7766567468643190,	3.51634412254498E-07,	0.4940188229084020,	0.742782473564148,	-0.016822366043925300,	0.5198850631713870,	0.6705208420753480	-0.02217743918299680	,0.530349612236023,	0.608527421951294,	-0.026513811200857200,	0.5343440175056460,	0.5547474026679990,	-0.03108420968055730,	0.5087167620658880,	0.601951539516449	-0.014771194197237500	,0.5232663750648500,	0.5197005271911620,	-0.03248836472630500,	0.5308586359024050,	0.45266932249069200,	-0.04713566228747370,	0.5347563624382020,	0.3984505534172060,	-0.056496717035770400,	0.4887421727180480,	0.5885293483734130,	-0.01687742955982690,	0.50187748670578,	0.4981420934200290,	-0.03295642137527470,	0.5090399384498600,	0.42451977729797400,	-0.04768631234765050,	0.5137390494346620,	0.36357244849205000,	-0.056937240064144100,	0.4664924442768100,	0.585930585861206,	-0.02115873619914060,	0.47641968727111800,	0.4995158314704900,	-0.035709671676158900,	0.4825053811073300,	0.43215131759643600	,-0.04658501595258710,	0.4862360656261440,	0.37738341093063400	,-0.052807364612817800,	0.4402174651622770,	0.5950292348861690,	-0.027078228071332000,	0.4418375790119170,	0.5263962149620060,	-0.04030760005116460,	0.44370850920677200,	0.47625988721847500	-0.046006832271814300,	0.4457819163799290,	0.4365966320037840,	-0.04826449602842330]
// let trainedModel = trainModel()

async function makePredictions(model){
    let test = tf.tensor2d(testData, [1,63])
    test.print()
    console.log(test.shape)
    let prediction = await model.predict(test)
    console.log(await prediction)
    prediction.print()
}