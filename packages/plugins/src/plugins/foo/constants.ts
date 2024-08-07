import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'foo';
export const platform: Platform = {
  id: platformId,
  name: 'Foo Finance',
  image: 'https://sonar.watch/img/platforms/foo.webp',
  website: 'https://foo.com/',
  twitter: 'https://x.com/foo_finance',
  defiLlamaId: 'foo-finance', // from https://defillama.com/docs/api
};
export const marketsCachePrefix = `${platformId}-markets`;
