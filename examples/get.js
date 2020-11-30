const { SolidNodeClient } = require('../src/');
const fs = require('fs');

async function run(url) {
  const client = new SolidNodeClient();
  console.log('Logging in');
  await client.login();
  console.log('Logged in');
  const result = await client.fetch(url);
  console.log(url, result.status, result.headers);
  console.log(await result.text());
}

// ...
run(process.argv[2]);