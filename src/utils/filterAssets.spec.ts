import { fAssets } from '@fixtures';
import { ExtendedAsset } from '@types';
import { ASSET_DROPDOWN_SIZE_THRESHOLD, DEFAULT_NETWORK } from '@config';

import { filterDropdownAssets, filterValidAssets } from './filterAssets';

describe('filterDropdownAssets', () => {
  it('maintains base assets when filtering assets', () => {
    const filtered = filterDropdownAssets([fAssets[0]]);
    expect(filtered.length).toEqual(1);
  });

  it('maintains assets when filtering assets with items less than the threshold', () => {
    const filtered = filterDropdownAssets([fAssets[1]]);
    expect(filtered.length).toEqual(1);
  });

  it('conducts asset uuid filter when list exceeds threshold', () => {
    let assets: ExtendedAsset[] = [];
    // Create a large array of assets
    for (let i = 0; i < ASSET_DROPDOWN_SIZE_THRESHOLD + 1; i++) {
      assets = [...assets, fAssets[fAssets.length - 1]];
    }
    const filtered = filterDropdownAssets(assets);
    expect(filtered.length).toEqual(0);
  });
});

describe('filterValidAssets', () => {
  it('filters assets on the same network of type erc20 and base', () => {
    const filtered = filterValidAssets(fAssets, DEFAULT_NETWORK);
    expect(filtered.length).toEqual(1);
  });
});
