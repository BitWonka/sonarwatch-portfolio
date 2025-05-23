import { BeetStruct } from '@metaplex-foundation/beet';
import {
  CLOBOrderStruct,
  openOrdersV2Struct,
  serumMarketV1Struct,
  serumMarketV2Struct,
  serumMarketV3Struct,
} from './structs';
import { CLOBVersion } from './types';
import { openOrdersV1Struct } from '../../raydium/structs/openOrders';

export const serumId = 'serum';
export const openbookId = 'openbook';

export const clobVersions = {
  serumV1: {
    name: 'Serum V1',
    programId: '4ckmDgGdxQoPDLUkDT3vHgSAkzA3QRdNq5ywwY4sUSJn',
    struct: serumMarketV1Struct,
    orderStruct: openOrdersV1Struct,
    prefix: `${serumId}-marketsV1`,
  } as CLOBVersion,
  serumV2: {
    name: 'Serum V2',
    programId: 'EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o',
    struct: serumMarketV2Struct,
    orderStruct: openOrdersV2Struct,
    prefix: `${serumId}-marketsV2`,
  } as CLOBVersion,
  serumV3: {
    name: 'Serum V3',
    programId: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    struct: serumMarketV3Struct,
    orderStruct: openOrdersV2Struct,
    prefix: `${serumId}-marketsV3`,
  } as CLOBVersion,
  openbookV1: {
    name: 'OpenBook V1',
    programId: 'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX',
    struct: serumMarketV2Struct,
    orderStruct: openOrdersV2Struct,
    prefix: `${openbookId}-markets`,
  } as CLOBVersion,
  // openbookV2: {
  //   programId: 'opnbkNkqux64GppQhwbyEVc3axhssFhVYuwar8rDHCu',
  //   struct: openbookMarketV1Struct,
  //   orderStruct: openOrdersV3Struct,
  //   prefix: openbookMarketsPrefix,
  // } as CLOBProgramInfo,
};

export const orderStructByProgramId: Map<
  string,
  BeetStruct<CLOBOrderStruct, Partial<CLOBOrderStruct>>
> = new Map([
  ['4ckmDgGdxQoPDLUkDT3vHgSAkzA3QRdNq5ywwY4sUSJn', openOrdersV1Struct],
  ['EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o', openOrdersV2Struct],
  ['9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin', openOrdersV2Struct],
  ['srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX', openOrdersV2Struct],
]);
