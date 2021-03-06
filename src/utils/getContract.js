import Web3 from 'web3';
import EthKidsRegistryABI from '../assets/abi/EthKidsRegistry';
import DonationCommunityABI from '../assets/abi/DonationCommunity';
import CommunityTokenABI from '../assets/abi/CommunityToken';
import CharityVaultABI from '../assets/abi/CharityVault';
import BondingVaultABI from '../assets/abi/BondingVault';
import IERC20ABI from '../assets/abi/IERC20';
import KybrConverterABI from '../assets/abi/KyberConverter'

const getContract = (abi, address) =>
  new Promise((resolve, reject) => {
    const web3 = new Web3(window.web3.currentProvider);
    const contractInstance = new web3.eth.Contract(abi, address);
    if (contractInstance) {
      resolve(contractInstance);
    } else {
      reject('Can\'t get contact');
    }
  });

export const getEthKidsRegistryContract = address => getContract(EthKidsRegistryABI, address);
export const getDonationCommunityContract = address => getContract(DonationCommunityABI, address);
export const getCommunityTokenContract = address => getContract(CommunityTokenABI, address);
export const getCharityVaultContract = address => getContract(CharityVaultABI, address);
export const getBondingVaultContract = address => getContract(BondingVaultABI, address);
export const getIERC20Contract = address => getContract(IERC20ABI, address);
export const getKyberConverterContract = address => getContract(KybrConverterABI, address);
