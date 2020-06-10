const utils = require('./utils');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();


exports.handler =  async function(event, context) {
    
  if(event.httpMethod !== "POST") {
    return utils.fail(404,`${event.httpMethod} not supported`);
  }
  
  if(event.queryStringParameters === null || event.queryStringParameters.appName === null) {
    return utils.fail(404,`appName queryStringParameters not provided`);
  }
  
  const appName = event.queryStringParameters.appName;
  
  const body = event.body.toString('ascii');
  if(!utils.isJson(body)) {
    return utils.fail(400,`only valid json is accepted`);
  }
  
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

    await S3.putObject({
      Bucket: app.bucket,
      Key: key,
      Body: body
    }).promise();

    const retVal = `Posted ${body} to ${app.bucket}/${key}`;
    return utils.succeed(retVal);
  } catch(err) {
    return utils.fail(500,err);
  } 
};