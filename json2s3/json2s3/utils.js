const isJson = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch(err) {
    console.log(err)
    return false;
  }
};

const fail = (code,message) => {
  return {
    isBase64Encoded:false,
    statusCode: code,
    headers:{},
    body:JSON.stringify(message,null,2),
  };
};

const succeed = (message) => {
  return {
    isBase64Encoded:false,
    statusCode: 200,
    headers:{},
    body:JSON.stringify(message,null,2),
  };
};


module.exports = {
  isJson,
    fail,
    succeed
};