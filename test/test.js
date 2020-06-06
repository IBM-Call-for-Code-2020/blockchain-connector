const path = require('path')
const Hashids = require('hashids/cjs');
const APP_ROOT_DIR = path.join(__dirname, '..');
const MAX_PPM = 1000000;
const BATCH_SIZE = 20;
const CO2BoardPPM = artifacts.require('CO2BoardPPM.sol');

let co2BoardPPM = null;
const hashids = new Hashids('', 10);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Dummy Data
let vehicles = [];
for (let i = 0; i < BATCH_SIZE; i++) {
  v = {
    id: hashids.encode(getRandomInt(MAX_PPM)),
    usage: undefined
  };
  vehicles.push(v);
}

contract('CO2BoardPPM', async accounts => {
  it('Batch TEST: should add usage of CO2(unit: PPM)', async () => {
    co2BoardPPM = await CO2BoardPPM.deployed();

    for (let i = 0; i < vehicles.length; i++) {
      let v = vehicles[i];
      const id = v.id;
      const usage = getRandomInt(MAX_PPM);
      v.usage = usage;

      console.log(`Call addMeasured(${id}, ${usage})`);
      const result = await co2BoardPPM.addUsage(id, usage, {from: accounts[0]});

      const r = result.receipt;
      console.log(`txHash: ${r.transactionHash} / blkNum: ${r.blockNumber}`);

      const usageAmount = await co2BoardPPM.getUsage.call(id);
      const ppm = usageAmount.toNumber();
      assert.equal(usage, ppm);
    }

  });

  it('BATCH TEST: should get usage of Specific Vehicle', async () => {
    co2BoardPPM = await CO2BoardPPM.deployed();

    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      const id = v.id;
      const usage = v.usage;

      const usageAmount = await co2BoardPPM.getUsage.call(id);
      const ppm = usageAmount.toNumber();
      console.log(`Vehicle ${id} Uses ${usage}. Must be same with return value of Smart Contract: ${ppm} ppm`);
      assert.equal(usage, ppm);
    }
  })
});