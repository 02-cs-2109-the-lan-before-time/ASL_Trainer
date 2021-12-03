
// load and format data
async function load_process_data() {
	let AD_df = await dfd.read_csv(
		'https://docs.google.com/spreadsheets/d/1nBP6rdesizWW0hamkI11Dk1eB3uJz2G5wglAq6pT5To/export?format=csv&gid=0'
	);

	//array of letters a-z
	const letters = 'abcd'.split('');

	// //converts label to a one hot tensor
	// function convertCat(label) {
	// 	const zeroes = new Array(letters.length).fill(0);
	// 	const indexNum = letters.indexOf(label);
	// 	const outputArr = [...zeroes];

	// 	outputArr[indexNum] = 1;

	// 	return outputArr;
	// }

	// for (let i = 0; i < letters.length; i++) {
	// 	AD_df = await AD_df.replace(letters[i], convertCat(letters[i]), {
	// 		columns: ['63'],
	// 	});
	// }
	console.log(AD_df)
	return AD_df;
}

/*
	//tensors
	let aTensor = df_rep_a.tensor;
	let bTensor = df_rep_b.tensor;
	console.log(aTensor.shape);
	console.log(bTensor.shape);

	let TrainingData = aTensor.concat(bTensor);
	TrainingData.print();
	console.log(TrainingData.shape);
}
/*
Data:
1. split into data and test

x_train: 63 points (not categories)
Array.len(63)
Labels: a,b,c
y_train [[100],[]]

the model will return one of our three cat arrays
*/

//Define model architechture
function buildModel() {
	const model = tf.sequential();

	//single input layer with 64 weights for each of the 63 input features of the data
	model.add(tf.layers.dense({inputShape: [63], units: 64, activation: 'relu', useBias: true}));
	//layer
	model.add(tf.layers.dense({units: 64, activation: 'relu'}))
	//single output layer with [number of labels] of units
	//softmax normalizes output to give probabilities
	model.add(tf.layers.dense({units: 4, activation: 'softmax', useBias: true}));

	return model;
}


//convert input data to tensors
function convertToTensor(data) {
	//tidy disposes of any intermediate tensors
	return tf.tidy(()=> {
		//shuffle data so model isn't learning things that are dependent on the order data is being fed in, and model isn't sensitive to the structure of subgroups
		tf.util.shuffle(data);

		//split data into training and test sets
		const num_training_rows = Math.round(data.values.length * 0.8);
		console.log('ASDFSDFSD', num_training_rows)
		//80% of data rows is training data
		const training_data = data.iloc({rows: [`0:${num_training_rows}`]})
		//20% of data rows is test data
		const test_data = data.iloc({rows: [`${num_training_rows}:`]})

		//convert data to tensor: input tensor for coordinates, labels tensor for labels (a,b,...z...1,2,..10)
		//split data so the 63 coordinates are in an inputs array and the 64th column (labels) are in the labels array
		//inputs shape: num_of_datapoints x 63
		const training_inputs = training_data.iloc({columns: ["0:63"]});
		const test_inputs = test_data.iloc({columns: ["0:63"]});

		//converts 'a, b, ..' to a one hot tensor [1, 0, 0, 0]
		let encode = new dfd.OneHotEncoder()
		//runs encoder on the last column (labels)
    encode.fit(data[63].values)

		//converts letters in the last column into one hot arrays
		let training_labels = encode.transform(training_data[63].values)
		let test_labels = encode.transform(test_data[63].values)


		//inputs.length is the number of examples, 63 is the number of features per examples
		// const inputTensor = training_inputs.tensor;
		// const labelTensor = training_labels.tensor;

		// //normalize data using min-max scaling to the range 0-1 (best practice)
		// const inputMax = inputTensor.max();
		// const inputMin = inputTensor.min();
		// const labelMax = labelTensor.max();
		// const labelMin = labelTensor.min();

		// const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
		// const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

		//return the data and normalization bounds
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

//train model
async function trainModel(model, inputs, labels) {
	//prepare model for training
	model.compile({
		//adam optimizer is "effective in practice and requires no configuration"
		optimizer: tf.train.adam(),
		//meanSquareError compares the model's predictions with the actual values
		loss: tf.losses.meanSquaredError,
		metrics: ['mse'],
	});

	//batchSize is the size of the data subsets the model will see on each iteration of training
	const batchSize = 32;
	//epochs is the number of times the model will look at the entire dataset
	const epochs = 1;

	//start the train loop
	return await model.fit(inputs, labels, {
		batchSize,
		epochs,
		callbacks: tfvis.show.fitCallbacks(
			{name: 'Training Performance' },
			['loss', 'mse'],
			{height: 200, callbacks: ['onEpochEnd']}
		)
	});
}

async function run() {
	//gets data
	const data = await load_process_data();
	//get model
	const model = buildModel();
	//converts data to tensors for training
	const tensorData = convertToTensor(data);
	const {training_inputs, training_labels, test_inputs, test_labels} = tensorData;
	console.log(training_inputs.shape)
	console.log(training_labels.shape)
	console.log(test_inputs.shape)
	console.log(test_labels.shape)
	//train model
	await trainModel(model, training_inputs, training_labels);
	console.log('Done Training');

	//prediction
	//run prediction on test data. predict returns a tensor.
	const results = model.predict(test_inputs)
	results.print();
	//convert results tensor to an array
	//prediction array shape: number_of_test_inputs x 4
	const prediction = await results.array();
	console.log(prediction)

	//TO DO
	////Map through prediction array to convert those arrays into labels
	////Compare that (predictions) with test_labels and see how good/bad our model is

}

run();

