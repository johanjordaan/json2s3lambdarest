const utils = require('./utils');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler =  async function(event, context) {
    
  if(event.httpMethod !== "POST") {
    return {
      isBase64Encoded:false,
      statusCode: 404,
      headers:{},
      body:JSON.stringify(`${event.httpMethod} not supported`,null,2),
    };
  }
  
  const appName = event.queryStringParameters.appName;
  const postedData = JSON.stringify(event.body);
  
  try {
    const data = await S3.getObject({
      Bucket: "1337coders",
      Key:"config/json2s3/config.json"
    }).promise();
    const config = JSON.parse(data.Body.toString('ascii'));
    const appLookup = config.applications.reduceRight((a,i)=>{
      a[i.name] = i;
      return a;
    },{});
    
    const app = appLookup[appName];
    const id = context.awsRequestId;
    const fileName = `${new Date().toISOString()}_${id}.json`;
    const key = `${app.folder}/${fileName}`;
    
    const response = await S3.putObject({
      Bucket: app.bucket,
      Key: key,
      Body: postedData
    }).promise();
    
    
    console.log(response);
    
    const body = `Posted ${postedData} to ${app.bucket}/${key}`;
    
    return {
      isBase64Encoded:false,
      statusCode: 200,
      headers:{},
      body:JSON.stringify(body,null,2),
    };
    
  } catch(err) {
    return {
      isBase64Encoded:false,
      statusCode: 500,
      headers:{},
      body:JSON.stringify(err,null,2),
    };
  } 
};