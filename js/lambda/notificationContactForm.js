//Lambda code for when a new DynamoDB entry inserted.
//Sends publishes SNS message

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var SNS = new AWS.SNS();

exports.handler = function (event, context, callback) {
    // console.log('Received event:', JSON.stringify(event, null, 2));
    var numProcessed = 0;

    event.Records.forEach((record) => {

        if(record.eventName == "INSERT") {
            console.log('Processing: ' + JSON.stringify(record, null, 2));
            var time = record.dynamodb.NewImage.datetime.S;
            var email = record.dynamodb.NewImage.email.S;
            var subject = record.dynamodb.NewImage.subject.S;
            var msg = record.dynamodb.NewImage.msg.S;

            var sns_msg = 'Message sent at ' + time + '\n' +
                'From: ' + email + '\n' +
                'Subject: ' + subject + '\n' +
                'message: ' + msg;

            var params = {
                Message: sns_msg,
                Subject: 'dmtwebsite Contact form: ' + subject,
                TopicArn: 'GET YOUR OWN ARN',
            }


            SNS.publish(params, function(err, data) {
                console.log ("We are in the callback!");
                if (err) {
                    console.log('Error sending a message', err);
                    callback(err);
                } else {
                    console.log("done!");
                    console.log(data);
                }
            });
            numProcessed++;
        }
    });
    // console.log(`Successfully processed ${numProcessed} records.`);
    callback(null, `Successfully processed ${numProcessed} records.`);
};
