
//load and format data
// async function load_process_data() {
// 	let AD_df = await dfd.read_csv(
// 		'https://docs.google.com/spreadsheets/d/1nBP6rdesizWW0hamkI11Dk1eB3uJz2G5wglAq6pT5To/export?format=csv&gid=0'
// 	);

// 	//array of letters a-z
// 	const letters = 'abcd'.split('');

// 	//converts label to a one hot tensor
// 	function convertCat(label) {
// 		const zeroes = new Array(letters.length).fill(0);
// 		const indexNum = letters.indexOf(label);
// 		const outputArr = [...zeroes];

// 		outputArr[indexNum] = 1;

// 		return outputArr;
// 	}

// 	// for (let i = 0; i < letters.length; i++) {
// 	// 	AD_df = await AD_df.replace(letters[i], convertCat(letters[i]), {
// 	// 		columns: ['63'],
// 	// 	});
// 	// }
// 	console.log(AD_df)
// 	return AD_df;
// }



// // /*
// // 	//tensors
// // 	let aTensor = df_rep_a.tensor;
// // 	let bTensor = df_rep_b.tensor;
// // 	console.log(aTensor.shape);
// // 	console.log(bTensor.shape);

// // 	let TrainingData = aTensor.concat(bTensor);
// // 	TrainingData.print();
// // 	console.log(TrainingData.shape);
// // }
// // /*
// // Data:
// // 1. split into data and test

// // x_train: 63 points (not categories)
// // Array.len(63)
// // Labels: a,b,c
// // y_train [[100],[]]

// // the model will return one of our three cat arrays
// // */


// //Define model architechture
// function buildModel() {
// 	const model = tf.sequential();

// 	//single input layer with 64 weights for each of the 63 input features of the data
// 	model.add(tf.layers.dense({inputShape: [63], units: 64, activation: 'relu', useBias: true}));
// 	//layer
// 	model.add(tf.layers.dense({units: 64, activation: 'relu'}))
// 	//single output layer with [number of labels] of units
// 	//softmax normalizes output to give probabilities
// 	model.add(tf.layers.dense({units: 4, activation: 'softmax', useBias: true}));

// 	return model;
// }


// //convert input data to tensors
// function convertToTensor(data) {
// 	//tidy disposes of any intermediate tensors
// 	return tf.tidy(()=> {
// 		//shuffle data so model isn't learning things that are dependent on the order data is being fed in, and model isn't sensitive to the structure of subgroups
// 		tf.util.shuffle(data);

// 		//convert data to tensor: input tensor for coordinates, labels tensor for labels (a,b,...z...1,2,..10)

// 		//split data so the 63 coordinates are in an inputs array and the 64th column (labels) are in the labels array
// 		//inputs shape: num_of_datapoints x 63
// 		// const inputs = data.map(d => d.slice(0,63));

// 		const inputs = data.iloc({columns: ["0:63"]});
// 		//labels shape: num_of_datapoints x lenth_of_one_hot
// 		//const labels = data.map(d => d[63]);
// 		const oldlabels = data.iloc({columns: [63]});
// 		//const labels = new oldlabels.OneHotEncoder();
// 		let encode = new dfd.OneHotEncoder()
//     encode.fit(data[63])
//     console.log(encode);
// 		console.log(inputs.shape, 'HGFHGFHGFGHFHFH')
// 		let labels = encode.transform(data[63].values)
// 		labels.print()

// 		//inputs.length is the number of examples, 63 is the number of features per examples
// 		const inputTensor = inputs.tensor;
// 		const labelTensor = labels.tensor;

// 		//normalize data using min-max scaling to the range 0-1 (best practice)
// 		const inputMax = inputTensor.max();
// 		const inputMin = inputTensor.min();
// 		const labelMax = labelTensor.max();
// 		const labelMin = labelTensor.min();

// 		const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
// 		const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

// 		//return the data and normalization bounds
// 		return {
// 			inputs: normalizedInputs,
// 			labels: normalizedLabels,
// 			//return min/max bounds for later use
// 			inputMax,
// 			inputMin,
// 			labelMax,
// 			labelMin
// 		}
// 	});
// }

// //train model
// async function trainModel(model, inputs, labels) {
// 	//prepare model for training
// 	model.compile({
// 		//adam optimizer is "effective in practice and requires no configuration"
// 		optimizer: tf.train.adam(),
// 		//meanSquareError compares the model's predictions with the actual values
// 		loss: tf.losses.meanSquaredError,
// 		metrics: ['mse'],
// 	});

// 	//batchSize is the size of the data subsets the model will see on each iteration of training
// 	const batchSize = 32;
// 	//epochs is the number of times the model will look at the entire dataset
// 	const epochs = 50;

// 	//start the train loop
// 	return await model.fit(inputs, labels, {
// 		batchSize,
// 		epochs,
// 		callbacks: tfvis.show.fitCallbacks(
// 			{name: 'Training Performance' },
// 			['loss', 'mse'],
// 			{height: 200, callbacks: ['onEpochEnd']}
// 		)
// 	});
  
// }

// async function run() {
// 	//gets data
// 	const data = await load_process_data();
// 	//get model
// 	const model = buildModel();
// 	//converts data for tensors for training
// 	const tensorData = convertToTensor(data);
// 	const {inputs, labels} = tensorData;
// 	//train model
// 	await trainModel(model, inputs, labels);
//     // const saveResult = await model.save('localstorage://my-model-1');
// 	console.log('Done Training');
// //shape [401, 63]
// console.log(inputs)
// //shape [401, 4]
// console.log(labels)


//     // testModel(model, inputs, tensorData)
// }

// run();

// function testModel(model, inputData, normalizationData) {
//     const {inputMax, inputMin, labelMin, labelMax} = normalizationData;
//    // [401, 63] inputData Shape
//     console.log(inputData)
//     inputData.print()

//     // Generate predictions for a uniform range of numbers between 0 and 1;
//     // We un-normalize the data by doing the inverse of the min-max scaling
//     // that we did earlier.
//     // const [xs, preds] = tf.tidy(() => {
        
//     //   const xs = tf.linspace(0, 1, 100);
//         let testData = [0.25576308369636536, 0.8778154253959656, -2.3068379562118935e-7, 0.2902066111564636, 0.8212407231330872, -0.0184430330991745, 0.3009176552295685, 0.7329487204551697, -0.02239140123128891, 0.2955332398414612, 0.6612422466278076, -0.026378732174634933, 0.28721773624420166, 0.6054319143295288, -0.027015147730708122, 0.2722373604774475, 0.6703200340270996, 0.004224363714456558, 0.26405176520347595, 0.6409764885902405, -0.022430365905165672, 0.2667911946773529, 0.7033108472824097, -0.03618471324443817, 0.26881298422813416, 0.7428262233734131, -0.038912203162908554, 0.24065427482128143, 0.6780329942703247, 0.0068706790916621685, 0.2320650964975357, 0.658726692199707, -0.01928725652396679, 0.24142205715179443, 0.7286035418510437, -0.02382008731365204, 0.24876011908054352, 0.7602354288101196, -0.018144307658076286, 0.21134470403194427, 0.6982598304748535, 0.003808746114373207, 0.2020648866891861, 0.6909139156341553, -0.023949967697262764, 0.21955636143684387, 0.7562288045883179, -0.018040405586361885, 0.23252740502357483, 0.7834003567695618, -0.00472765089944005, 0.18432866036891937, 0.7263815402984619, -0.0007265191525220871, 0.17822913825511932, 0.7227623462677002, -0.01765076257288456, 0.19690002501010895, 0.7710147500038147, -0.011929525062441826, 0.21064981818199158, 0.7924315929412842, -0.0008994226227514446, '1000']
//         let tD = testData.tensor
//         console.log(tD)
     
  
//   }

// //   testModel()