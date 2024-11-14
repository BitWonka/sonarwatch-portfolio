import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetCollectible,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import {
  platformId as orcaPlatformId,
  whirlpoolPrefix,
  whirlpoolProgram,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  ParsedAccount,
  getParsedMultipleAccountsInfo,
} from '../../utils/solana';
import { Cache } from '../../Cache';
import { Whirlpool, positionStruct } from './structs/whirlpool';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { NftFetcher } from '../tokens/types';
import {
  calcFeesAndRewards,
  getTickArraysAsMap,
  isRewardInitialized,
} from './helpers_fees';

export const getWhirlpoolPositions = getOrcaNftFetcher(
  orcaPlatformId,
  whirlpoolProgram
);

export function getOrcaNftFetcher(
  platformId: string,
  programId: PublicKey
): NftFetcher {
  return async (
    cache: Cache,
    nfts: PortfolioAssetCollectible[]
  ): Promise<PortfolioElement[]> => {
    const client = getClientSolana();
    const positionsProgramAddress: PublicKey[] = [];

    nfts.forEach((nft) => {
      const address = new PublicKey(nft.data.address);

      const positionSeed = [Buffer.from('position'), address.toBuffer()];

      const [programAddress] = PublicKey.findProgramAddressSync(
        positionSeed,
        programId
      );
      positionsProgramAddress.push(programAddress);
    });
    if (positionsProgramAddress.length === 0) return [];

    const positionsInfo = await getParsedMultipleAccountsInfo(
      client,
      positionStruct,
      positionsProgramAddress
    );
    if (!positionsInfo || positionsInfo.length === 0) return [];

    const whirlpoolAddresses: Set<string> = new Set();
    positionsInfo.forEach((pos) => {
      if (pos) whirlpoolAddresses.add(pos.whirlpool.toString());
    });

    const allWhirlpoolsInfo = await cache.getItems<ParsedAccount<Whirlpool>>(
      Array.from(whirlpoolAddresses),
      {
        prefix: whirlpoolPrefix,
        networkId: NetworkId.solana,
      }
    );

    const tokensMints: Set<string> = new Set();
    const whirlpoolMap: Map<string, Whirlpool> = new Map();
    allWhirlpoolsInfo.forEach((wInfo) => {
      if (!wInfo) return;
      if (whirlpoolAddresses.has(wInfo.pubkey.toString())) {
        whirlpoolMap.set(wInfo.pubkey.toString(), wInfo);
        tokensMints.add(wInfo.tokenMintA.toString());
        tokensMints.add(wInfo.tokenMintB.toString());
        if (!isRewardInitialized(wInfo.rewardInfos[0])) {
          tokensMints.add(wInfo.rewardInfos[0]?.mint.toString());
        }
        if (!isRewardInitialized(wInfo.rewardInfos[1])) {
          tokensMints.add(wInfo.rewardInfos[1]?.mint.toString());
        }
        if (!isRewardInitialized(wInfo.rewardInfos[2])) {
          tokensMints.add(wInfo.rewardInfos[2]?.mint.toString());
        }
      }
    });

    if (whirlpoolMap.size === 0) return [];

    const [tokenPrices, tickArrays] = await Promise.all([
      cache.getTokenPricesAsMap([...tokensMints], NetworkId.solana),
      getTickArraysAsMap(positionsInfo, whirlpoolMap),
    ]);

    const elements: PortfolioElement[] = [];
    for (let index = 0; index < positionsInfo.length; index++) {
      const positionInfo = positionsInfo[index];
      if (!positionInfo) continue;

      const whirlpoolInfo = whirlpoolMap.get(positionInfo.whirlpool.toString());
      if (!whirlpoolInfo) continue;

      if (
        !whirlpoolInfo.tokenMintA ||
        !whirlpoolInfo.tokenMintB ||
        !whirlpoolInfo.tickCurrentIndex
      )
        continue;

      const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
        positionInfo.liquidity,
        whirlpoolInfo.tickCurrentIndex,
        positionInfo.tickLowerIndex,
        positionInfo.tickUpperIndex,
        false
      );
      const rewardAssets: PortfolioAsset[] = [];

      const tokenPriceA = tokenPrices.get(whirlpoolInfo.tokenMintA.toString());
      if (!tokenPriceA) continue;
      const tokenPriceB = tokenPrices.get(whirlpoolInfo.tokenMintB.toString());
      if (!tokenPriceB) continue;

      const assetTokenA = tokenPriceToAssetToken(
        whirlpoolInfo.tokenMintA.toString(),
        tokenAmountA.dividedBy(10 ** tokenPriceA.decimals).toNumber(),
        NetworkId.solana,
        tokenPriceA
      );

      const assetTokenB = tokenPriceToAssetToken(
        whirlpoolInfo.tokenMintB.toString(),
        tokenAmountB.dividedBy(10 ** tokenPriceB.decimals).toNumber(),
        NetworkId.solana,
        tokenPriceB
      );

      const tags = [];
      if (tokenAmountA.isZero() || tokenAmountB.isZero())
        tags.push('Out Of Range');

      const feesAndRewards = calcFeesAndRewards(
        whirlpoolInfo,
        positionInfo,
        tickArrays
      );

      if (feesAndRewards) {
        if (feesAndRewards.feeOwedA.isGreaterThan(0)) {
          rewardAssets.push(
            tokenPriceToAssetToken(
              tokenPriceA.address,
              feesAndRewards.feeOwedA
                .dividedBy(10 ** tokenPriceA.decimals)
                .toNumber(),
              NetworkId.solana,
              tokenPriceA
            )
          );
        }

        if (feesAndRewards.feeOwedB.isGreaterThan(0)) {
          rewardAssets.push(
            tokenPriceToAssetToken(
              tokenPriceB.address,
              feesAndRewards.feeOwedB
                .dividedBy(10 ** tokenPriceB.decimals)
                .toNumber(),
              NetworkId.solana,
              tokenPriceB
            )
          );
        }

        if (feesAndRewards.rewardOwedA.isGreaterThan(0)) {
          const tokenPriceRewardA = tokenPrices.get(
            whirlpoolInfo.rewardInfos[0].mint.toString()
          );
          if (tokenPriceRewardA) {
            rewardAssets.push(
              tokenPriceToAssetToken(
                tokenPriceRewardA.address,
                feesAndRewards.rewardOwedA
                  .dividedBy(10 ** tokenPriceRewardA.decimals)
                  .toNumber(),
                NetworkId.solana,
                tokenPriceRewardA
              )
            );
          }
        }

        if (feesAndRewards.rewardOwedB.isGreaterThan(0)) {
          const tokenPriceRewardB = tokenPrices.get(
            whirlpoolInfo.rewardInfos[1].mint.toString()
          );
          if (tokenPriceRewardB) {
            rewardAssets.push(
              tokenPriceToAssetToken(
                tokenPriceRewardB.address,
                feesAndRewards.rewardOwedB
                  .dividedBy(10 ** tokenPriceRewardB.decimals)
                  .toNumber(),
                NetworkId.solana,
                tokenPriceRewardB
              )
            );
          }
        }

        if (feesAndRewards.rewardOwedC.isGreaterThan(0)) {
          const tokenPriceRewardC = tokenPrices.get(
            whirlpoolInfo.rewardInfos[2].mint.toString()
          );
          if (tokenPriceRewardC) {
            rewardAssets.push(
              tokenPriceToAssetToken(
                tokenPriceRewardC.address,
                feesAndRewards.rewardOwedC
                  .dividedBy(10 ** tokenPriceRewardC.decimals)
                  .toNumber(),
                NetworkId.solana,
                tokenPriceRewardC
              )
            );
          }
        }
      }

      if (!assetTokenA || !assetTokenB) continue;

      const assets = [assetTokenA, assetTokenB];

      const assetsValue = getUsdValueSum([
        assetTokenA.value,
        assetTokenB.value,
      ]);
      const rewardAssetsValue = getUsdValueSum(
        rewardAssets.map((a) => a.value)
      );
      const totalValue = getUsdValueSum([assetsValue, rewardAssetsValue]);

      if (totalValue === 0 || totalValue === null) continue;

      elements.push({
        type: PortfolioElementType.liquidity,
        networkId: NetworkId.solana,
        platformId,
        label: 'LiquidityPool',
        name: 'Concentrated',
        value: totalValue,
        data: {
          liquidities: [
            {
              assets,
              assetsValue,
              rewardAssets,
              rewardAssetsValue,
              value: totalValue,
              yields: [],
            },
          ],
        },
        tags,
      });
    }

    return elements;
  };
}
