import Web3 from 'web3';

const getWeb3 = function (fallbackProvider) {
  return new Promise((resolve, reject) => {
    if (window.ethereum) {
      const ethereumjs = window.ethereum;
      window.web3 = new Web3(ethereumjs);
      try {
        ethereumjs.enable().then(() => {
          resolve({
            injectedWeb3: ethereumjs.isConnected(),
            web3() {
              return window.web3;
            },
          });
        });
      } catch (error) {
        reject(new Error('Unable to connect to Metamask'));
      }
    } else if (window.web3) {
      const web3js = window.web3;
      const web3 = new Web3(web3js.currentProvider);
      resolve({
        injectedWeb3: web3.isConnected(),
        web3() {
          return web3;
        },
      });
    } else {
      const web3 = new Web3(new Web3.providers.HttpProvider(fallbackProvider));
      window.web3 = web3;
      resolve({
        injectedWeb3: true,
        readOnly: true,
        web3() {
          return web3;
        },
      });
    }
  })
    .then(result =>
      new Promise((resolve, reject) => {
        result.web3().eth.net.getId().then((networkId) => {
          const res = Object.assign({}, result, {networkId});
          resolve(res);
        }).catch(() => {
          reject(new Error('Unable to retrieve network ID'));
        });
      }),
    )
    .then(result =>
      new Promise((resolve, reject) => {
        if (result.readOnly) {
          resolve(result);
        }
        result.web3().eth.getCoinbase((err, coinbase) => {
          if (err) {
            reject(new Error('Unable to retrieve coinbase'));
          } else {
            const res = Object.assign({}, result, {coinbase});
            resolve(res);
          }
        });
      }),
    )
    .then(result =>
      new Promise((resolve, reject) => {
        if (result.coinbase) {
          result.web3().eth.getBalance(result.coinbase, (err, balance) => {
            if (err) {
              reject(new Error(`Unable to retrieve balance for address: ${result.coinbase}`));
            } else {
              const res = Object.assign({}, result, {balance});
              resolve(res);
            }
          });
        } else {
          resolve(result);
        }
      }),
    )
};


export default getWeb3;
