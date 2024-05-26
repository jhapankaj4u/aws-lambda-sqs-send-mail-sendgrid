'use strict';
const sqs = require('./sqs');

exports.sendEmail = async (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;
  const body = JSON.parse(event.body);
  var retTYpe={}
  try{
   var data= await sqs.sendMessage(body,process.env.globalmailQueueUrl,0,null)

   if(!data.status){
    retTYpe = {statusCode:500,message:data.err}
   }else{
    retTYpe = {statusCode:200,message:data.err}
   }

  }catch(err){
    retTYpe = {statusCode:500,message:err.message}
  }
  return {
    statusCode: retTYpe.statusCode,
    body: JSON.stringify(retTYpe),
    headers: {
        'Access-Control-Allow-Origin': '*', // <-- Add your specific origin here
        'Access-Control-Allow-Credentials': true,
    },
}
   
};


module.exports.sendGlobalMail = async event => {
  try {

    if (event.Records && event.Records.length > 0) {
      var promises = []
      event.Records.forEach(elm => {
        promises.push(serviceCommunication.main(elm.body, elm.receiptHandle))
      })
      await Promise.all(promises)
      return {
        message: 'Done!',
        event
      };

    } else {
      return {
        message: 'No data found!',
        event
      };
    }

  } catch (err) {
    return {
      message: err.stack,
      event
    };
  }
};  
