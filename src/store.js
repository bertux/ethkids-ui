import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash';
import getWeb3 from './utils/getWeb3';
import pollWeb3 from './utils/pollWeb3';
import {
  getEthKidsRegistryContract,
  getDonationCommunityContract,
  getCommunityTokenContract,
  getCharityVaultContract,
  getBondingVaultContract, getKyberConverterContract,
} from './utils/getContract';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //Main
    registryAddress: '0x220A7844d3eAa78E60AA238fEA1BF8a01A567126',
    communityCreationBlock: 8810339,
    requiredNetwork: 1,
    kyberAPI: 'https://api.kyber.network',
    httpProvider: 'https://mainnet.infura.io/v3/98d7e501879243c5877bac07a57cde7e',

    //Rinkeby
    /*registryAddress: '0xD9E35bAd6965f9b80fFF06CbFDb1bEc56c363bB3',
    communityCreationBlock: 5325351,
    requiredNetwork: 4,
    kyberAPI: 'https://rinkeby-api.kyber.network',
    httpProvider: 'https://rinkeby.infura.io/v3/98d7e501879243c5877bac07a57cde7e',*/

    //Ropsten
    // registryAddress: '0xE944141cB3eF0dbFc5209e6A34Ec0BB06D49698f',
    // communityCreationBlock: 6643086,
    // requiredNetwork: 3,
    // kyberAPI: 'https://ropsten-api.kyber.network',
    // httpProvider: 'https://ropsten.infura.io/v3/98d7e501879243c5877bac07a57cde7e',

    readOnly: false,
    web3: {
      isInjected: false,
      web3Instance: null,
      networkId: null,
      coinbase: null,
      balance: null,
      error: null,
    },
    ethBalance: 0,
    ethKidsRegistryInstance: null,
    kyberConverterAddress: null,
    stableTokenAddress: null,
    //TODO These states are per community
    communityAddress: null,
    communityInstance: null,
    //bonding vault stats
    bondingVaultAddress: null,
    bondingVaultInstance: null,
    bondingVaultBalance: null,
    //charity vault stats
    charityVaultAddress: null,
    charityVaultInstance: null,
    charityVaultBalance: null,
    totalDonationsRaised: 0,
    //token stats
    tokenAddress: null,
    tokenInstance: null,
    tokenSym: null,
    tokenTotalSupply: 0,
    tokenMyBalance: 0,
    tokenMyETHValue: 0,
    communityDonations: [],
    communityTransfers: [],

  },
  mutations: {
    registerWeb3Instance(state, payload) {
      const result = payload;
      const web3Copy = state.web3;
      web3Copy.isInjected = result.injectedWeb3;
      web3Copy.web3Instance = result.web3;
      if (result.readOnly) {
        state.readOnly = true;
        web3Copy.coinbase = '0x0000000000000000000000000000000000000000';
        web3Copy.networkId = result.networkId;
        web3Copy.balance = '0';
      } else {
        web3Copy.coinbase = result.coinbase;
        web3Copy.networkId = result.networkId;
        web3Copy.balance = Number(result.balance);
      }
      state.web3 = web3Copy;
      if (!result.readOnly) {
        pollWeb3();
      }
    },
    registerNetworkId(state, payload) {
      state.web3.networkId = payload;
    },
    pollWeb3Instance(state, payload) {
      state.web3.coinbase = payload.coinbase;
      state.web3.balance = parseInt(payload.balance, 10);
    },
    registerEthBalance(state, payload) {
      state.ethBalance = payload;
    },
    registerEthKidsRegistry(state, payload) {
      state.ethKidsRegistryInstance = () => payload;
    },
    registerConverterAddress(state, payload) {
      state.kyberConverterAddress = payload;
    },
    registerStableTokenAddress(state, payload) {
      state.stableTokenAddress = payload;
    },
    registerCommunityAddress(state, payload) {
      state.communityAddress = payload;
    },
    registerCommunity(state, payload) {
      state.communityInstance = () => payload;
    },
    registerBondingVaultAddress(state, payload) {
      state.bondingVaultAddress = payload;
    },
    registerBondingVault(state, payload) {
      state.bondingVaultInstance = () => payload;
    },
    registerBondingVaultBalance(state, payload) {
      state.bondingVaultBalance = payload;
    },
    registerCharityVaultAddress(state, payload) {
      state.charityVaultAddress = payload;
    },
    registerCharityVault(state, payload) {
      state.charityVaultInstance = () => payload;
    },
    registerCharityVaultBalance(state, payload) {
      state.charityVaultBalance = payload;
    },
    registerTokenAddress(state, payload) {
      state.tokenAddress = payload;
    },
    registerToken(state, payload) {
      state.tokenInstance = () => payload;
    },
    registerTokenSym(state, payload) {
      state.tokenSym = payload;
    },
    registerTokenTotalSupply(state, payload) {
      state.tokenTotalSupply = payload;
    },
    registerTokenMyBalance(state, payload) {
      state.tokenMyBalance = payload;
    },
    registerTokenMyETHValue(state, payload) {
      state.tokenMyETHValue = payload;
    },
    registerTotalDonationsRaised(state, payload) {
      state.totalDonationsRaised = payload;
    },
    registerCommunityDonation(state, payload) {
      state.communityDonations.push(payload);
      state.communityDonations = _.orderBy(state.communityDonations, 'blockNo', 'desc');
    },
    registerCommunityTransfer(state, payload) {
      state.communityTransfers.push(payload);
      state.communityTransfers = _.orderBy(state.communityTransfers, 'blockNo', 'desc');
    },
  },
  actions: {
    registerWeb3({commit}) {
      return new Promise((resolve, reject) => {
        getWeb3(this.state.httpProvider).then((result) => {
          commit('registerWeb3Instance', result);
          resolve(result);
        }).catch((e) => {
          console.log('error in action registerWeb3', e);
          reject(e);
        });
      });
    },
    pollWeb3({commit}, payload) {
      commit('pollWeb3Instance', payload);
    },
    initBondingVaultContract({commit}, bondingVaultAddress) {
      commit('registerBondingVaultAddress', bondingVaultAddress);
      getBondingVaultContract(bondingVaultAddress).then((bondingVaultContract) => {
        commit('registerBondingVault', bondingVaultContract);
      }).catch((err) => {
        console.log(err);
      });
    },

    initCharityVaultContract({commit, dispatch}, charityVaultAddress) {
      commit('registerCharityVaultAddress', charityVaultAddress);
      getCharityVaultContract(charityVaultAddress).then((charityVaultContract) => {
        commit('registerCharityVault', charityVaultContract);
      }).catch((err) => {
        console.log(err);
      });
    },
    initCommunityTokenContract({commit}, tokenAddress) {
      commit('registerTokenAddress', tokenAddress);
      getCommunityTokenContract(tokenAddress).then((tokenContract) => {
        commit('registerToken', tokenContract);

        tokenContract.methods.symbol().call().then((sym) => {
          commit('registerTokenSym', sym);
        });

      }).catch((err) => {
        console.log(err);
      });
    },
    initEthKidsCommunityContract({commit, dispatch}, communityAddress) {
      commit('registerCommunityAddress', communityAddress);
      getDonationCommunityContract(communityAddress).then((communityContract) => {
        commit('registerCommunity', communityContract);
        //bonding vault
        communityContract.methods.bondingVault().call().then((bondingVaultAddress) => {
          dispatch('initBondingVaultContract', bondingVaultAddress);
        });
        //charity vault
        communityContract.methods.charityVault().call().then((charityVaultAddress) => {
          dispatch('initCharityVaultContract', charityVaultAddress);
        });
        //community token
        communityContract.methods.getCommunityToken().call().then((tokenAddress) => {
          dispatch('initCommunityTokenContract', tokenAddress);
        });
      }).catch((err) => {
        console.log(err);
      });
    },

    registerContracts({commit, state, dispatch}) {
      return new Promise((resolve, reject) => {
        getEthKidsRegistryContract(state.registryAddress).then((registryContract) => {
          registryContract.methods.communityIndex().call().then((index) => {
            console.log("Total communities: " + index);
          }).catch((e) => {
            throw e;
          });
          registryContract.methods.getCommunityAt(0).call().then((communityAddress) => {

            registryContract.methods.currencyConverter().call().then((converter) => {
              commit('registerConverterAddress', converter);
              getKyberConverterContract(converter).then(kyberConverter => {
                kyberConverter.methods.getStableToken().call().then((stableToken) => {
                  commit('registerStableTokenAddress', stableToken);

                  dispatch('initEthKidsCommunityContract', communityAddress);
                });
              });
            }).catch((e) => {
              throw e;
            });
          }).catch((e) => {
            throw e;
          });
          commit('registerEthKidsRegistry', registryContract);
          resolve(registryContract);
        }).catch((e) => {
          reject(e);
        });
      });
    },
  }
})
