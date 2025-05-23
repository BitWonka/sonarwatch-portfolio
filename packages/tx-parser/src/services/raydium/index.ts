import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'raydium';

const raydiumAmmV3Contract: Contract = {
  name: 'Raydium AMM v3',
  address: 'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q',
  platformId,
};
const raydiumAmmV4Contract: Contract = {
  name: 'Raydium AMM v4',
  address: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
  platformId,
};
const raydiumAmmV5Contract: Contract = {
  name: 'Raydium AMM v5',
  address: '5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h',
  platformId,
};
const ammRootingContract: Contract = {
  name: 'Raydium AMM Rooting',
  address: 'routeUGWgWzqBWFcrCfv8tritsqukccJPu3q5GPP3xS',
  platformId,
};
const raydiumClmmContract: Contract = {
  name: 'Raydium CLMM',
  address: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
  platformId,
};
const raydiumCpmmContract: Contract = {
  name: 'Raydium CPMM',
  address: 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C',
  platformId,
};
const farmV3Contract: Contract = {
  name: 'Raydium Farm V3',
  address: 'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q',
  platformId,
};
const farmV4Contract: Contract = {
  name: 'Raydium Farm V4',
  address: 'CBuCnLe26faBpcBP2fktp4rp8abpcAnTWft6ZrP5Q4T',
  platformId,
};
const farmV5Contract: Contract = {
  name: 'Raydium Farm V5',
  address: '9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z',
  platformId,
};
const farmV6Contract: Contract = {
  name: 'Raydium Farm V6',
  address: 'FarmqiPv5eAj3j1GMdMCMUGXqPUvmquZtMy86QH6rzhG',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-amm-v3`,
    name: 'Stake',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumAmmV3Contract],
  },
  {
    id: `${platformId}-amm-v4`,
    name: 'AMM v4',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumAmmV4Contract],
  },
  {
    id: `${platformId}-amm-v5`,
    name: 'AMM v5',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumAmmV5Contract],
  },
  {
    id: `${platformId}-amm-rooting`,
    name: 'Swap',
    platformId,
    networkId: NetworkId.solana,
    contracts: [ammRootingContract],
  },
  {
    id: `${platformId}-clmm`,
    name: 'CLMM',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumClmmContract],
  },
  {
    id: `${platformId}-cpmm`,
    name: 'CPMM',
    platformId,
    networkId: NetworkId.solana,
    contracts: [raydiumCpmmContract],
  },
  {
    id: `${platformId}-farm-v3`,
    name: 'Stake',
    platformId,
    networkId: NetworkId.solana,
    contracts: [farmV3Contract],
  },
  {
    id: `${platformId}-farm-v4`,
    name: 'Farm V4',
    platformId,
    networkId: NetworkId.solana,
    contracts: [farmV4Contract],
  },
  {
    id: `${platformId}-farm-v5`,
    name: 'Farm V5',
    platformId,
    networkId: NetworkId.solana,
    contracts: [farmV5Contract],
  },
  {
    id: `${platformId}-farm-v6`,
    name: 'Farm V6',
    platformId,
    networkId: NetworkId.solana,
    contracts: [farmV6Contract],
  },
];

export default services;
