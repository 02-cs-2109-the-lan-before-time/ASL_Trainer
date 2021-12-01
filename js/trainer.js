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
	} //[1,00000] [01000]

	// for (let i = 0; i < letters.length; i++) {
	// 	AD_df = await AD_df.replace(letters[i], convertCat(letters[i]), {
	// 		columns: ['63'],
	// 	});
	// }

	function replace(letters) {
		//find the letter and replace with converCat output
		return AD_df.replace(letters, convertCat(letters));
	}
	let df_new = AD_df.apply(replace, {axis: 1});
	df_new.print();
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
async function buildModel() {
	const model = tf.sequential();
	// model.add(
	// 	// tf.layers.lstm({
	// 	// 	units: 64,
	// 	// 	returnSequences: true,
	// 	// 	activation: 'relu',
	// 	// 	inputShape: [60, 64],
	// 	// })
	// );
	//single input layer
	model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
	//single output layer
	model.add(tf.layers.dense({units: 1, useBias: true}));

	//dense layer
	//    model.add(tf.layers.dense({units:64, })
	model.summary();
	model.compile({
		loss: 'categoricalCrossentropy',
		optimizer: 'Adam',
		metrics: ['categoricalAccuracy'],
	});

	// await model.fit(xs, ys, {epochs: 1000});
}

buildModel();
