const AWS = require('aws-sdk');

class SQSMailHelper {
     static AWS = AWS;

    constructor(){

    }

    static async sendMessage(object,queue,delay=0) {
        try{
            SQSMailHelper.AWS.config.update({
                accessKeyId: process.env.accessKeyId,
                secretAccessKey: process.env.secretAccessKey,
                region: process.env.region
            });
    
            var params = {
                DelaySeconds: delay,
                MessageBody: JSON.stringify(object),
                QueueUrl: queue
            };
    
            let sqs = new SQSMailHelper.AWS.SQS({apiVersion: '2012-11-05'});
    
            var data=await sqs.sendMessage(params).promise()
            return{
                status:true,
                err:data.MessageId
            }
        }catch(err){          
            return{
                status:false,
                err:err.stack
            }
        }
    }
}

module.exports = SQSMailHelper;
