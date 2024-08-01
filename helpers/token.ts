import { Token } from '@raydium-io/raydium-sdk';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import axios, { AxiosError } from 'axios';
import { DEXSCREENER_TOKEN_API } from './constants';

interface PairsResponse {
  schemaVersion: string;
  /** @deprecated use pairs field instead */
  pair: Pair | null;
  pairs: Pair[] | null;
}

interface Pair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    symbol: string;
  };
  priceNative: string;
  priceUsd?: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity?: {
    usd?: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  pairCreatedAt?: number;
}

export async function fetchFiveMinVolume(): Promise<number> {
  try {
    const tokenDataResponse = await axios.get(DEXSCREENER_TOKEN_API)
    const tokenData: PairsResponse = tokenDataResponse.data
    return tokenData.pairs?.map(pair => pair.volume.m5).reduce((sum, current) => sum + current, 0) || 0
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
    }
    return 0
  }
}

export function getToken(token: string) {
  return new Token(
    TOKEN_PROGRAM_ID,
    new PublicKey(token),
    9,
    "GEM",
    "GEM"
  )
  switch (token) {
    case 'WSOL': {
      return Token.WSOL;
    }
    case 'USDC': {
      return new Token(
        TOKEN_PROGRAM_ID,
        new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
        6,
        'USDC',
        'USDC',
      );
    }
    default: {
      throw new Error(`Unsupported quote mint "${token}". Supported values are USDC and WSOL`);
    }
  }
}
