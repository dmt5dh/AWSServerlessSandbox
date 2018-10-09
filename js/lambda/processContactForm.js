//Processes form requests from static website and saves entry to DynamoDB

// Load the SDK for JavaScript
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

var uuid = require('uuid');

var mapQueryString = require('querystring');

exports.handler = (event, context, callback) => {
    const requestBody = event.body;
    const queryParams = mapQueryString.parse(event.body);

    const email = queryParams.email;
    const subject = queryParams.subject;
    const msg = queryParams.msg;

    var responseBody = {
      status: "",
    };

    var response = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: "",
    };

    var params = {
      TableName: 'dmt-website-contact',
      Item: {
        'id' : {S: uuid.v1()},
        'email' : {S: email},
        'subject' : {S: subject},
        'msg' : {S: msg},
        'datetime' : {S: new Date().toISOString()},
      }
    };

    console.log(params);

    // Call DynamoDB to add the item to the table
    ddb.putItem(params, function(err, data) {
      if (err) {
        responseBody.status = "Error processing request";
        console.log("Error", err);
      } else {
        responseBody.status = "Success sent message!";
        response.statusCode = 200;
        console.log("Success", data);
      }

      response.body = JSON.stringify(responseBody);
      console.log("response: " + JSON.stringify(response));
      callback(null, response);
    });
};
