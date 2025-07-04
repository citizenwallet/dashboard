'use server';

import { Contract, formatUnits, JsonRpcProvider, toBigInt } from 'ethers';
import CTZN_WPOL_PAIR_ABI from './_abi/ctzn.json';
import WPOL_USDC_PAIR_ABI from './_abi/wpol.json';

// Addresses
const CTZN_WPOL_PAIR_ADDRESS = '0x746CF1bAaa81E6f2dEe39Bd4E3cB5E9f0Edf98a8';
const WPOL_USDC_PAIR_ADDRESS = '0x6D9e8dbB2779853db00418D4DcF96F3987CFC9D2';

// Decimals
const USDC_DECIMALS = 6;
const WPOL_DECIMALS = 18;

export const wpolUsdcPriceAction = async (): Promise<number> => {
  try {
    const provider = new JsonRpcProvider(
      process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      {
        name: 'polygon',
        chainId: 137
      }
    );

    const pair = new Contract(
      WPOL_USDC_PAIR_ADDRESS,
      WPOL_USDC_PAIR_ABI,
      provider
    );

    const [reserve0, reserve1] = await pair.getReserves();

    const tick1 = Number(formatUnits(reserve0, WPOL_DECIMALS));
    const tick2 = Number(formatUnits(reserve1, USDC_DECIMALS));
    const price = tick1 / tick2;

    const priceInWpol = 1 / price;

    return priceInWpol;
  } catch (error) {
    console.error('Failed to get wpol/usdc price:', error);
    throw new Error('Failed to get token price: ' + (error as Error).message);
  }
};

const ctznWpolPriceAction = async (): Promise<number> => {
  try {
    const provider = new JsonRpcProvider(
      process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      {
        name: 'polygon',
        chainId: 137
      }
    );

    const pair = new Contract(
      CTZN_WPOL_PAIR_ADDRESS,
      CTZN_WPOL_PAIR_ABI,
      provider
    );

    const tickCumulatives = await pair.getTimepoints([3600, 0]);

    const tick1 = Number(toBigInt(tickCumulatives.tickCumulatives[0]));
    const tick2 = Number(toBigInt(tickCumulatives.tickCumulatives[1]));

    const delta = tick1 - tick2;
    const avgTick = delta / 3600;

    const price = Math.pow(1.0001, avgTick);
    return price;
  } catch (error) {
    console.error('Failed to get ctzn/wpol price:', error);
    throw new Error('Failed to get token price: ' + (error as Error).message);
  }
};

export const getTokenPriceAction = async (price: number) => {
  console.log(`Getting price ${price} to USDT....`);
  const wpolUsdc_Price = Number((await wpolUsdcPriceAction()).toFixed(3));
  console.log('WPOL/USDC price: ', wpolUsdc_Price);
  const ctznWpol_Price = Number((await ctznWpolPriceAction()).toFixed(3));
  console.log('CTZN/WPOL price: ', ctznWpol_Price);
  const usdPrice = price * wpolUsdc_Price * ctznWpol_Price;
  return usdPrice;
};
