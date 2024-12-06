import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioAsset,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { AssetBuilder } from './AssetBuilder';
import { ElementParams } from './ElementParams';
import { PortfolioAssetParams } from './PortfolioAssetParams';
import { TokenPriceMap } from '../../TokenPriceMap';

export class ElementMultipleBuilder extends ElementBuilder {
  assets: AssetBuilder[];

  constructor(params: ElementParams) {
    super(params);
    this.assets = [];
  }

  addAsset(params: PortfolioAssetParams) {
    this.assets.push(new AssetBuilder(params));
  }

  mints(): string[] {
    return this.assets.map((a) => a.address);
  }

  get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElement | null {
    const assets = this.assets
      .map((a) => a.get(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAsset[];

    if (assets.length === 0) return null;

    const element = {
      type: this.type,
      label: this.label,
      networkId,
      platformId: this.platformId || platformId,
      data: {
        assets,
      },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
      name: this.name,
      tags: this.tags,
    };

    return element as PortfolioElement;
  }
}
