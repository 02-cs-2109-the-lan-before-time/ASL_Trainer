


async function load_process_data() {
    let df2 = await dfd.read_csv("https://docs.google.com/spreadsheets/d/1DD7bs2mwGo0LVkT0WYbUiPb81rYx80VaHfWk2VgqK7I/export?format=csv&gid=915166490")
    df2.print()
    // let names = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,34,35,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,,cat]
    let group_df = df2.groupby(["cat"])

    let a_df = group_df.data_tensors.a
    let b_df = group_df.data_tensors.b
    
    // labeling and encoding
    // let encode = new dfd.LabelEncoder()
    // encode.fit(df2["cat"])
    // console.log(encode);
    // let sf_enc = encode.transform(df2['cat'].values)
    // sf_enc.print()
    // let new_sf = encode.transform(["a","b"])
    // new_sf.print()

    let df_rep_a = a_df.replace('a', '0', { columns: ["cat"] })
    let df_rep_b = b_df.replace('b', '1', { columns: ["cat"] })

    //tensors
    let aTensor =df_rep_a.tensor
    let bTensor = df_rep_b.tensor
    console.log(aTensor.shape)
    console.log( bTensor.shape)

   let TrainingData = aTensor.concat(bTensor)
   TrainingData.print()
   console.log(TrainingData.shape)

}

load_process_data()

async function buildModel() {
    const model = tf.sequential();
    model.add(tf.layers.lstm({units:64, returnSequences:true, activation:'relu', inputShape:[60,64]}))
  
    model.summary()
    model.compile({loss: 'categoricalCrossentropy', optimizer: 'Adam', metrics:['categoricalAccuracy']});
    
    // await model.fit(xs, ys, {epochs: 1000});

}

buildModel()
 