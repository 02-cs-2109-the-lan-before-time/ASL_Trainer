// async function getModel() {

//   const model = await tf.loadLayersModel('localstorage://my-model-1');
//   await signModel.predict(tf.ones([8, 10]), {batchSize: 4}).print();

//   return model
// }
// let singleDataPoint = [0.25576308369636536, 0.8778154253959656, -2.3068379562118935e-7, 0.2902066111564636, 0.8212407231330872, -0.0184430330991745, 0.3009176552295685, 0.7329487204551697, -0.02239140123128891, 0.2955332398414612, 0.6612422466278076, -0.026378732174634933, 0.28721773624420166, 0.6054319143295288, -0.027015147730708122, 0.2722373604774475, 0.6703200340270996, 0.004224363714456558, 0.26405176520347595, 0.6409764885902405, -0.022430365905165672, 0.2667911946773529, 0.7033108472824097, -0.03618471324443817, 0.26881298422813416, 0.7428262233734131, -0.038912203162908554, 0.24065427482128143, 0.6780329942703247, 0.0068706790916621685, 0.2320650964975357, 0.658726692199707, -0.01928725652396679, 0.24142205715179443, 0.7286035418510437, -0.02382008731365204, 0.24876011908054352, 0.7602354288101196, -0.018144307658076286, 0.21134470403194427, 0.6982598304748535, 0.003808746114373207, 0.2020648866891861, 0.6909139156341553, -0.023949967697262764, 0.21955636143684387, 0.7562288045883179, -0.018040405586361885, 0.23252740502357483, 0.7834003567695618, -0.00472765089944005, 0.18432866036891937, 0.7263815402984619, -0.0007265191525220871, 0.17822913825511932, 0.7227623462677002, -0.01765076257288456, 0.19690002501010895, 0.7710147500038147, -0.011929525062441826, 0.21064981818199158, 0.7924315929412842, -0.0008994226227514446, 'a']
// let sdp =singleDataPoint.tensor
// let signModel = getModel();
// await signModel.predict(tf.ones([8, 10]), {batchSize: 4}).print();
