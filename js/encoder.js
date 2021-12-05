
const labels = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,1,2,3,4,5,6,7,8,9,10'
const labels_arr = labels.split(','); //['a', 'b', 'c',...'10']
const labels_dict = {}
const zeroes_arr = new Array(labels_arr.length).fill(0); //[0, 0, 0, 0, 0, ...0]

//// SWAP KEY AND VALUES OF DICTIONARY ////
function swap(dict){
  let swapped_dict = {};
  for(let key in dict){
    swapped_dict[dict[key]] = key;
  }
  return swapped_dict;
}

class SignEncoder {

  //// ENCODE LABELS INTO ONE HOT ARRAYS ////
  encode_to_one_hot(letter) {
    for (let i = 0; i < labels_arr.length; i++) {
      const current_label = labels_arr[i]; //ex. 'a'
      const one_hot =  [...zeroes_arr]
      one_hot[i] = 1 // ex. [1, 0, 0, 0, ...0]
      labels_dict[current_label] = [...one_hot] //ex. { 'a': [1, 0, 0, ...0], ...}
    }

    return labels_dict[letter]; //ex. [1, 0, 0, ...0]
  }

  //// TRANSLATE PREDICTION RESULTS TO ONE HOT ARRAYS ////
  prediction_to_one_hot(prediction) {
    ////Map through prediction array to convert those arrays into labels
    const one_hot_prediction = prediction.map((p_array) => {
      const idx_of_highest = p_array.indexOf(Math.max(...p_array));
      const one_hot_p = [...zeroes_arr];
      one_hot_p[idx_of_highest] = 1;
      return one_hot_p;
    });

    return one_hot_prediction;
  }

  //// TRANSLATAE ONE HOT RESULTS INTO LABELS ////
  decode_one_hot(raw_predictions) {
    let one_hot_dict = swap(labels_dict);
    const translated = raw_predictions.map((pred) => {
      return one_hot_dict[pred]
    });

    return translated;
  }

}


export default SignEncoder
