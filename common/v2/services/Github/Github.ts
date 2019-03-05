import { AxiosInstance } from 'axios';

import { GITHUB_RELEASES_URL } from './constants';
import { APIService } from '../API';
import { ReleaseURLs } from './types';

let instantiated: boolean = false;
export default class GithubService {
  public static instance = new GithubService();

  private service: AxiosInstance = APIService.generateInstance({
    baseURL: GITHUB_RELEASES_URL
  });

  constructor() {
    if (instantiated) {
      throw new Error(`GithubService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public getReleasesURLs = async () => {
    const ASSET_REG_EXPS = {
      mac: /^mac.*\.dmg$/,
      windows: /^windows.*\.exe$/,
      linux32: /^linux-i386.*\.AppImage$/,
      linux64: /^linux-x86-64.*\.AppImage$/,
      standalone: /^standalone.*\.zip$/
    };

    try {
      const response = await this.service.get('');
      const assets = response.data.assets;

      const releasesURLs: ReleaseURLs = {};

      Object.entries(ASSET_REG_EXPS).forEach(([key, regex]) => {
        const asset = assets.find((a: any) => regex.test(a.name));
        if (asset) {
          releasesURLs[key] = asset.browser_download_url;
        }
      });

      return releasesURLs;
    } catch (e) {
      throw e;
    }
  };
}
