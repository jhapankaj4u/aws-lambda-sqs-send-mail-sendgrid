const AWS = require('aws-sdk');
exports.main = async function (obj, receiptHandle) {
    
    var body = JSON.parse(obj);

   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.sendGridApiKey);
    let find_val = (body.to).search(','),
        final_email;
    if (find_val > -1) {
        final_email = (body.to).split(',')
    } else {
        final_email = body.to
    }
    let sendMailObject = {
        to: final_email,
        from: body.from,
        subject: body.subject,
        // text: 'and easy to do anywhere, even with Node.js',
        html: body.html,
    };
    if(body.attachments){
        sendMailObject.attachments= body.attachments
    }
    try {
        mailResult = await sgMail.send(sendMailObject);
    } catch (err) {
        try {
            AWS.config.update({
                accessKeyId: process.env.accessKeyId,
                secretAccessKey: process.env.secretAccessKey,
                region: process.env.region,
                //signatureVersion: 'v4'
            });
            let sqs = new AWS.SQS({
                apiVersion: '2012-11-05'
            });
            var deleteParams = {
                QueueUrl: process.env.globalmailQueueUrl,
                ReceiptHandle: receiptHandle
            }
            await sqs.deleteMessage(deleteParams);

        } catch (e) {
            console.log(e)
        }
    }

    return true;

}


