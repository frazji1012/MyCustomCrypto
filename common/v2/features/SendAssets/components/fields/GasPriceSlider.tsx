import React, { ChangeEvent } from 'react';
import Slider, { createSliderWithTooltip, Marks } from 'rc-slider';

import { gasPriceDefaults } from 'config';
import translate, { translateRaw } from 'translations';
import './styles/GasPriceSlider.scss';
import { Field, FieldProps } from 'formik';
import { Transaction } from 'v2/services/Transaction';
import { fetchGasPriceEstimates } from 'v2/features/Gas/gasPriceFunctions';
import { GasEstimates } from 'v2/api/gas';
import { TransactionFields } from '../../SendAssets';

const SliderWithTooltip = createSliderWithTooltip(Slider);

interface OwnProps {
  gasPrice: string;
}

interface StateProps {
  gasEstimates: {
    safeLow: number;
    standard: number;
    fast: number;
    fastest: number;
    isDefault: boolean;
  };
  transactionFieldValues: TransactionFields;
  handleChange: {
    (e: ChangeEvent<any>): void;
    <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any>
      ? void
      : (e: string | ChangeEvent<any>) => void;
  };
}

type Props = OwnProps & StateProps; // & ActionProps;

interface State {
  hasSetRecommendedGasPrice: boolean;
  realGasPrice: number;
}

interface GasTooltips {
  [estimationLevel: string]: string;
}

export default class SimpleGas extends React.Component<Props> {
  public state: State = {
    hasSetRecommendedGasPrice: false,
    realGasPrice: 0
  };

  public async componentDidMount() {
    const gasPriceValues: GasEstimates = await fetchGasPriceEstimates(
      this.props.transactionFieldValues.asset
    );
    this.setState({ ...this.state, gasEstimates: gasPriceValues });
  }

  public render() {
    const { gasPrice } = this.props;
    const gasEstimates = this.props.gasEstimates || {
      fastest: 20,
      fast: 18,
      standard: 12,
      isDefault: false,
      safeLow: 4
    };

    const bounds = {
      max: gasEstimates ? gasEstimates.fastest : gasPriceDefaults.max,
      min: gasEstimates ? gasEstimates.safeLow : gasPriceDefaults.min
    };
    const gasNotches = this.makeGasNotches();

    /**
     * @desc On retrieval of gas estimates,
     *  the current gas price may be lower than the lowest recommended price.
     *  `rc-slider` will force the onChange if the value is too low, so we
     *  ensure it at least passes the lower boundary.
     *  When this occurs, the logic in `UNSAFE_componentWillReceiveProps` fires,
     *  and it cannot happen again from that point forward.
     */
    const actualGasPrice = Math.max(parseFloat(gasPrice), bounds.min);
    return (
      <Field
        name="transactionFee"
        render={({ field, form }: FieldProps<Transaction>) => {
          return (
            <div className="SimpleGas row form-group">
              <div className="SimpleGas-input-group">
                <div className="SimpleGas-slider">
                  <SliderWithTooltip
                    {...field}
                    onChange={e => {
                      form.setFieldValue(field.name, e);
                    }}
                    min={bounds.min}
                    max={bounds.max}
                    marks={gasNotches}
                    included={false}
                    value={actualGasPrice}
                    tipFormatter={this.formatTooltip}
                    step={bounds.min < 1 ? 0.1 : 1}
                  />
                  <div className="SimpleGas-slider-labels">
                    <span>{translate('TX_FEE_SCALE_LEFT')}</span>
                    <span>{translate('TX_FEE_SCALE_RIGHT')}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />
    );
  }

  private makeGasNotches = (): Marks => {
    const { gasEstimates } = this.props;

    return gasEstimates
      ? {
          [gasEstimates.safeLow]: '',
          [gasEstimates.standard]: '',
          [gasEstimates.fast]: '',
          [gasEstimates.fastest]: ''
        }
      : {};
  };

  private formatTooltip = (gas: number) => {
    const { gasEstimates } = this.props;
    if (!(gasEstimates && !gasEstimates.isDefault)) {
      return '';
    }

    const gasTooltips: GasTooltips = {
      [gasEstimates.fast]: translateRaw('TX_FEE_RECOMMENDED_FAST'),
      [gasEstimates.fastest]: translateRaw('TX_FEE_RECOMMENDED_FASTEST'),
      [gasEstimates.safeLow]: translateRaw('TX_FEE_RECOMMENDED_SAFELOW'),
      [gasEstimates.standard]: translateRaw('TX_FEE_RECOMMENDED_STANDARD')
    };

    const recommended = gasTooltips[gas] || '';
    const x = translateRaw('GAS_GWEI_COST', {
      $gas: gas.toString(),
      $recommended: recommended
    });
    return x;
  };
}
