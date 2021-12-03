//////// LOAD DATA /////////
async function load_process_data() {
	let AD_df = await dfd.read_csv(
		'https://docs.google.com/spreadsheets/d/1nBP6rdesizWW0hamkI11Dk1eB3uJz2G5wglAq6pT5To/export?format=csv&gid=0'
	);

	//shuffle data so model isn't learning things that are dependent on the order data is being fed in, and model isn't sensitive to the structure of subgroups
	return await AD_df.sample(AD_df.values.length);

}

//////// BUILD MODEL ///////
function buildModel() {
	const model = tf.sequential();

	//single input layer with 64 weights for each of the 63 input features of the data
	model.add(
		tf.layers.dense({
			inputShape: [63],
			units: 64,
			activation: 'relu',
			useBias: true,
		})
	);
	//layer
	model.add(tf.layers.dense({units: 64, activation: 'relu'}))
	//single output layer with [number of labels] of units. softmax normalizes output to give probabilities
	model.add(tf.layers.dense({units: 4, activation: 'softmax', useBias: true}));

	return model;
}


const labels = ['a', 'b','c','d'];
//////// PREPARE DATA //////////
function convertToTensor(data) {
	//tidy disposes of any intermediate tensors
	return tf.tidy(()=> {
		//////split data(type: dataframe) into training and test sets
		const num_training_rows = Math.round(data.values.length * 0.8);
		//80% of data rows is training data
		const training_data = data.iloc({rows: [`0:${num_training_rows}`]})
		//20% of data rows is test data
		const test_data = data.iloc({rows: [`${num_training_rows}:`]})

		//DEFINING INPUT DATA
		//taking only the coordinates from our data (first 63 columns) and leaving out the labels (last column)
		//inputs shape: num_of_datapoints x 63
		const training_inputs = training_data.iloc({columns: ["0:63"]});
		const test_inputs = test_data.iloc({columns: ["0:63"]});

		//(logging stuff for debugging)
		// test_data.describe().print()
		// console.log('testdata')
		// test_data[63].unique().print()
		// console.log('trainingdata')
		// training_data.print()


		//converts 'a, b, ..' to a one hot tensor [1, 0, 0, 0]
		let encode = new dfd.OneHotEncoder()
		//runs encoder on the last column (labels)

		encode.fit(labels);
    //encode.fit(data[63].values)
		console.log('Encode: ', encode.values)

		//DEFINING LABELS DATA
		//also converts letters in the last column into one hot arrays
		let training_labels = encode.transform(training_data[63].values)
		let test_labels = encode.transform(test_data[63].values)


		// //normalize data using min-max scaling to the range 0-1 (best practice)
		// const inputMax = inputTensor.max();
		// const inputMin = inputTensor.min();
		// const labelMax = labelTensor.max();
		// const labelMin = labelTensor.min();

		// const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
		// const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

		//return the data as tensors

		return {
			training_inputs: training_inputs.tensor,
			training_labels: training_labels.tensor,
			test_inputs: test_inputs.tensor,
			test_labels: test_labels.tensor
			//return min/max bounds for later use
			// inputMax,
			// inputMin,
			// labelMax,
			// labelMin
		}
	});
}

////// TRAINING THE MODEL ///////
async function trainModel(model, inputs, labels) {
	//prepare model for training
	model.compile({
		//adam optimizer is "effective in practice and requires no configuration"
		optimizer: tf.train.adam(),
		//meanSquareError compares the model's predictions with the actual values
		loss: tf.losses.meanSquaredError,
		metrics: ['mse'],
	});

	//batchSize is the size of the data subsets the model will see on each iteration of training 32 by default
	const batchSize = 32;
	//epochs is the number of times the model will look at the entire dataset
	const epochs = 50;
	//start the train loop
	return await model.fit(inputs, labels, {
		batchSize,
		epochs,
		callbacks: tfvis.show.fitCallbacks(
			{name: 'Training Performance'},
			['loss', 'mse'],
			{height: 200, callbacks: ['onEpochEnd']}
		),
	});
}

//// CONVERT ONE HOT PREDICTION TO LABELS ///
function translate_predictions(raw_predictions) {
	const translated = raw_predictions.map((pred) => {
		let letter = ''
		let pred_str = JSON.stringify(pred).slice(1,8)
		if (pred_str === '1,0,0,0') {
			letter = 'a'
		} else if (pred_str === '0,1,0,0') {
			letter = 'b'
		} else if (pred_str === '0,0,1,0') {
			letter = 'c'
		} else if (pred_str === '0,0,0,1') {
			letter = 'd'
		}
		return letter
	});

	return translated;
}

///// RUNNING EVERYTHING //////
async function run() {
	//gets shuffled data (type: dataframe)
	const data = await load_process_data();
	//get model
	const model = buildModel();
	//get prepared data
	const tensorData = convertToTensor(data);
	const {training_inputs, training_labels, test_inputs, test_labels} = tensorData;
	console.log(training_inputs.shape)
	console.log(training_labels.shape)
	console.log(test_inputs.shape)
	console.log(test_labels.shape)
	//train model on training data (type: tensors)
	await trainModel(model, training_inputs, training_labels);
	console.log('Done Training');


	///// PREDICT /////
	//run prediction on test data. predict takes in and returns a tensor.
	const results = model.predict(test_inputs)
	console.log('prediction tensors (probabilities): ')
	results.print();
	//convert results tensor to an array
	//prediction array shape: number_of_test_inputs x 4
	const prediction = await results.array();
	console.log('prediction array of probabilities: ' , prediction)


	////Map through prediction array to convert those arrays into labels
	const one_hot_prediction = prediction.map((p_array) => {
		const idx_of_highest = p_array.indexOf(Math.max(...p_array));
		const one_hot_p = [0, 0, 0, 0];
		one_hot_p[idx_of_highest] = 1;
		return one_hot_p;
	});
	console.log('prediction array as one hot arrays: ', one_hot_prediction);

	//translate prediction into labels
	const translated = translate_predictions(one_hot_prediction)
	console.log('translated predictions: ', translated)

	//compare one_hot_prediction with test_labels
	const test_actual = await test_labels.array()
	let match_count = 0;
	for (let i = 0; i < one_hot_prediction.length; i++) {
		if (JSON.stringify(one_hot_prediction[i]) === JSON.stringify(test_actual[i])) {
			match_count++;
		}
	}

	//show how well our model does
	console.log(`${match_count}/${test_actual.length} correctly predicted`)
}

run();
