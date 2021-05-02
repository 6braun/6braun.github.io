import {Injectable} from '@angular/core';
import {ethers} from 'ethers';
import * as abi from '../../../abis/HelloWorld.json';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  account: any;
  provider: any;
  signer: any;
  contract: any;

  constructor() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('Meta installed');
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
    }
  }

  public async enableMetamask(): Promise<any> {
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    this.account = accounts[0];
    console.log(this.account);

    const balance = await window.ethereum.request({method: 'eth_getBalance', params: [this.account, 'latest']});
    // tslint:disable-next-line:radix
    console.log(parseInt(balance) / 10 ** 18);
  }

  callHello(): void {
    this.provider.getBlockNumber().then(res => {
      // console.log(res);
    });
    this.setContract();
    this.contract.SayHello().then(res => console.log(res));
  }

  private setContract(): void {
    this.contract = new ethers.Contract(abi.networks['3'].address, abi.abi, this.provider);
  }

  public setHello(gruss: string): void {
    this.contract = this.contract.connect(this.signer);
    this.contract.SetHello('Wenn das klappt kack ich ab').then(res => console.log('EUREKA'));
  }
}
