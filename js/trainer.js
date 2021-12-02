async function load_process_data() {
	let AD_df = await dfd.read_csv(
		'https://docs.google.com/spreadsheets/d/1nBP6rdesizWW0hamkI11Dk1eB3uJz2G5wglAq6pT5To/export?format=csv&gid=0'
	);

	const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

	function convertCat(label) {
		const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
		const zeroes = new Array(letters.length).fill(0);
		const indexNum = letters.indexOf(label);
		const outputArr = [...zeroes];

		outputArr[indexNum] = 1;

		return outputArr;
	} //[1,00000...] [01000...]

	for (let i = 0; i < letters.length; i++) {
		AD_df = await AD_df.replace(letters[i], convertCat(letters[i]), {
			columns: ['63'],
		});
	}

	//AD_df.print();

	//convert to tensor
	let tf_tensor = AD_df.tensor;
	console.log(tf_tensor.dtype);
	console.log('tf tensor', tf_tensor);
	tf_tensor.print();

	function shuffle(tf_tensor) {
		// Wrapping these calculations in a tidy will dispose any
		// intermediate tensors.

		return tf.tidy(() => {
			// Step 1. Shuffle the data
			const data = tf.util.shuffle(tf_tensor);

			// Step 2. Convert data to Tensor
			const inputTensor = data[0];
			const labelTensor = data[1];
			console.log('inputTensor', inputTensor);

			//Step 3. Normalize the data to the range 0 - 1 using min-max scaling
			const inputMax = inputTensor.max();
			const inputMin = inputTensor.min();
			const labelMax = labelTensor.max();
			const labelMin = labelTensor.min();

			const normalizedInputs = inputTensor
				.sub(inputMin)
				.div(inputMax.sub(inputMin));
			const normalizedLabels = labelTensor
				.sub(labelMin)
				.div(labelMax.sub(labelMin));

			return {
				inputs: normalizedInputs,
				labels: normalizedLabels,
				// Return the min/max bounds so we can use them later.
				inputMax,
				inputMin,
				labelMax,
				labelMin,
			};
		});
	}

	shuffle();
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

load_process_data();
//Define model architechture
// async function buildModel() {
// 	const model = tf.sequential();
// 	// model.add(
// 	// 	// tf.layers.lstm({
// 	// 	// 	units: 64,
// 	// 	// 	returnSequences: true,
// 	// 	// 	activation: 'relu',
// 	// 	// 	inputShape: [60, 64],
// 	// 	// })
// 	// );
// 	//single input layer
// 	model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
// 	//single output layer
// 	model.add(tf.layers.dense({units: 1, useBias: true}));

// 	//dense layer
// 	//    model.add(tf.layers.dense({units:64, })
// 	model.summary();
// 	model.compile({
// 		loss: 'categoricalCrossentropy',
// 		optimizer: 'Adam',
// 		metrics: ['categoricalAccuracy'],
// 	});

// 	// await model.fit(xs, ys, {epochs: 1000});
// }

// buildModel();
