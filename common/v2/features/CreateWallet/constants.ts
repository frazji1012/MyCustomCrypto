import {
  DownloadAppPanel,
  SelectNetworkPanel,
  SelectMethodPanel,
  GeneratePhrasePanel,
  ConfirmPhrasePanel,
  GeneratePasswordPanel,
  DownloadKeystorePanel,
  SavePrivateKeyPanel
} from './components';

export enum CreateWalletStages {
  DownloadApp,
  SelectNetwork,
  SelectMethod,
  GeneratePhrase,
  ConfirmPhrase,
  GeneratePassword,
  DownloadKeystore,
  SavePrivateKey
}

export const createWalletStageToComponentHash = {
  [CreateWalletStages.DownloadApp]: DownloadAppPanel,
  [CreateWalletStages.SelectNetwork]: SelectNetworkPanel,
  [CreateWalletStages.SelectMethod]: SelectMethodPanel,
  [CreateWalletStages.GeneratePhrase]: GeneratePhrasePanel,
  [CreateWalletStages.ConfirmPhrase]: ConfirmPhrasePanel,
  [CreateWalletStages.GeneratePassword]: GeneratePasswordPanel,
  [CreateWalletStages.DownloadKeystore]: DownloadKeystorePanel,
  [CreateWalletStages.SavePrivateKey]: SavePrivateKeyPanel
};

export const createWalletMnemonicFlow = [
  CreateWalletStages.SelectNetwork,
  CreateWalletStages.SelectMethod,
  CreateWalletStages.GeneratePhrase,
  CreateWalletStages.ConfirmPhrase
];
