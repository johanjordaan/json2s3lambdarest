const utils = require('./utils');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();


exports.handler =  async function(event, context) {
    
  if(event.httpMethod !== "POST") {
    return utils.fail(404,{message: `${event.httpMethod} not supported`});
  }
  
  if(event.queryStringParameters === null || event.queryStringParameters.appName === null) {
    return utils.fail(404,{message: `appName queryStringParameters not provided`});
  }

  const appName = event.queryStringParameters.appName;

  var sectionName = "";
  if(event.queryStringParameters.sectionName !== null) {
    sectionName = event.queryStringParameters.sectionName;
  }

  const body = event.body.toString('ascii');
  if(!utils.isJson(body)) {
    return utils.fail(400,{message: `only valid json is accepted`});
  }

  var appLookup = {};
  try {
    const data = await S3.getObject({
      Bucket: "1337coders",
      Key:"config/json2s3/config.json"
    }).promise();
    const config = JSON.parse(data.Body.toString('ascii'));
    appLookup = config.applications.reduceRight((a,i)=>{
      a[i.name] = i;
      return a;
    },{});
  } catch(err) {
    console.log(err)
    return utils.fail(500,{message: `error loading config [${JSON.stringify(err)}]`});
  } 

  const app = appLookup[appName];
  if(app === null || app === undefined) {
    return utils.fail(404,{messsage: `app [${appName}] not found`});
  }

  if(app.sections === null || app.sections === undefined || !app.sections.includes(sectionName)) {
    return utils.fail(404,{messsage: `section [${sectionName}] not found`});
  }

  const id = context.awsRequestId;
  const fileName = `${id}.json`;
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();
  const key = `${app.folder}/${sectionName}/${year}/${month}/${day}/${fileName}`;

  try {
    await S3.putObject({
      Bucket: app.bucket,
      Key: key,
      Body: body
    }).promise();

    return utils.succeed({message: `created [${app.bucket}/${key}]`});
  } catch(err) {
    return utils.fail(500,{message: `error saving file [${JSON.stringify(err)}]`});
  } 
};