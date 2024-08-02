import fs from 'fs';
import path from 'path';
import { getWallet, logger } from '../helpers';
import { Keypair, PublicKey } from '@solana/web3.js';

export class BurnWalletListCache {
  private burnWalletList: string[] = [];
  private currentWalletIndex: number = 0;
  private fileLocation = path.join(__dirname, '../burn-wallet-list.txt');

  constructor() {
    // setInterval(() => this.loadSnipeList(), SNIPE_LIST_REFRESH_INTERVAL);
  }

  public init() {
    this.loadBurnWalletList();
  }

  public currentBurnWallet(): Keypair | null {
    if (this.currentWalletIndex == this.burnWalletList.length) return null
    return getWallet(this.burnWalletList[this.currentWalletIndex]);
  }

  public goNextWallet(): Keypair | null {
    this.currentWalletIndex = this.currentWalletIndex + 1;
    return this.currentBurnWallet();
  }

  private loadBurnWalletList() {
    logger.trace(`Refreshing burn wallet list...`);

    const count = this.burnWalletList.length;
    const data = fs.readFileSync(this.fileLocation, 'utf-8');
    this.burnWalletList = data
      .split('\n')
      .map((a) => a.trim())
      .filter((a) => a);

    if (this.burnWalletList.length != count) {
      logger.info(`Loaded burn wallet list: ${this.burnWalletList.length}`);
    }
  }
}
