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
  const putPromises = fs.readdirSync(localPath).map(async (fileName) => {
      const putResult = await client.fetch(podPath + fileName, {
      'Content-Type': 'text/turtle',
      method: 'PUT',
      body: fs.readFileSync(localPath + fileName)
    });
    console.log(localPath + fileName, '->', podPath + fileName, putResult.status);
  });
  await Promise.all(putPromises);
}

// ...
run(process.argv[2], process.argv[3]);