const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParsre = require('body-parser');
const Caver = require('caver-js');

const port = 3000;
const app = express();

const APP_ROOT_DIR = path.join(__dirname);
const secret = fs.readFileSync(path.join(APP_ROOT_DIR, '.secret.json'));
const parsedSecret = JSON.parse(secret);
const caver = new Caver(parsedSecret.baobab.url);
const contract = require(path.join(APP_ROOT_DIR, 'config/contract'));
const GAS_LIMIT = 300000;

const co2BoardPPM = contract.co2BoardPPM;

const d = parsedSecret.baobab.accounts.deployer;
const deployer = caver.klay.accounts.wallet.add(d.privateKey);

app.use(bodyParsre.urlencoded({ extended: false }));
app.use(bodyParsre.json());

app.get('/co2/:vehicleId', (req, res) => {
  vid = req.params.vehicleId;
  
  co2BoardPPM.methods.getUsage(
    caver.klay.abi.encodeParameter('string', vid),
  ).call()
  .then((u) => {
    res.json({
      vehicleId: vid,
      totalUsage: u
    });
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

app.post('/co2', (req, res) => {
  vid = req.body.vehicleId;
  u = req.body.usage;

  const abiAddUsage = co2BoardPPM.methods.addUsage(
    caver.klay.abi.encodeParameter('string', vid),
    caver.klay.abi.encodeParameter('uint', u)
  ).encodeABI();

  caver.klay.sendTransaction({
    type: 'SMART_CONTRACT_EXECUTION',
    from: deployer.address,
    to: co2BoardPPM._address,
    data: abiAddUsage,
    gas: GAS_LIMIT
  })
  .on('receipt', (receipt) => {
    bh = receipt.blockHash;
    th = receipt.transactionHash;
    caver.klay.getBlock(receipt.blockHash)
    .then((info) => {
      res.json({
        blkHash: bh,
        txHahs: th,
        timestamp: info.timestamp
      });
    });
  })
  .on('error', (err) => {
    res.status(500).send(err);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});