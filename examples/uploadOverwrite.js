const { SolidNodeClient } = require('../src/');
const fs = require('fs');

async function run(localPath, podPath) {
  const client = new SolidNodeClient();
  console.log('Logging in');
  await client.login();
  console.log('Logged in');
  if (localPath.substr(-1) !== '/') {
    console.log('Appending slash to local path');
    localPath += '/';
  }
  if (podPath.substr(-1) !== '/') {
    console.log('Appending slash to pod path');
    podPath += '/';
  }
  const promises = fs.readdirSync(localPath).map(async (fileName) => {
    // console.log('File to upload/overwrite (assuming contents are text/turtle');
    // console.log(fileName);
    const result = await client.fetch(podPath + fileName, {
      'Content-Type': 'text/turtle',
      method: 'PUT',
      body: fs.readFileSync(localPath + fileName)
    });
    console.log(localPath + fileName, '->', podPath + fileName, result.status);
  });
  await Promise.all(promises);
}

// ...
run(process.argv[2], process.argv[3]);