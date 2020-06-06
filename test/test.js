const path = require('path')
const APP_ROOT_DIR = path.join(__dirname, '..')

const MAX_PPM = 1000000;
const CO2BoardPPM = artifacts.require('CO2BoardPPM.sol');
let co2BoardPPM = null;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

contract('CO2BoardPPM', async accounts => {
  it('should add measured amount of CO2(unit: PPM)', async () => {
    co2BoardPPM = await CO2BoardPPM.deployed();
    const measured = getRandomInt(MAX_PPM);
    console.log(`Call addMeasured(${measured})`);

    const result = await co2BoardPPM.addMeasured(measured, {from: accounts[0]});
    const r = result.receipt;
    console.log(`txHash: ${r.transactionHash} / blkNum: ${r.blockNumber}`);

    const ppm = await co2BoardPPM.getMeasured.call();
    const n = ppm.toNumber();

    assert.equal(measured, n);
  });
});