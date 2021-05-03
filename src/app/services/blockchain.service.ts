import {Injectable} from '@angular/core';
import {ethers} from 'ethers';
import * as abi from '../../../abis/AdvertContract.json';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  account: any;
  provider: any;
  signer: any;
  contract: any;
  signedContract: any;
  CONTRACT_ADDRESS: string = abi.networks['3'].address;

  ABI: any[] = ['function receiveEther() payable public',
    'function getBalance() public view returns (uint)',
    'function withdrawEtherTo(address payable _to) public'];

  constructor() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('Meta installed');
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.setContract();
    }
  }

  private setContract(): void {
    this.contract = new ethers.Contract(this.CONTRACT_ADDRESS, this.ABI, this.provider);
  }

  public async enableMetamask(): Promise<any> {
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    this.account = accounts[0];
    console.log(this.account);

    const balance = await window.ethereum.request({method: 'eth_getBalance', params: [this.account, 'latest']});
    // tslint:disable-next-line:radix
    console.log(parseInt(balance) / (10 ** 18));
    this.signedContract = this.contract.connect(this.signer);
  }

  public sendMoney(): void {

    // Fix von ricmoo @ Github
    const dai = ethers.utils.parseEther('0.1');
    const overrides = {
      value: dai
    };
    this.signedContract.receiveEther(overrides).then(res => console.log(res));
  }

  public getBalance(): void {

    console.log(this.contract);

    this.contract.getBalance().then(res => console.log(parseInt(res, 16)));
  }

  public withdrawEther(): void {
    const myAddress = '0x8ffE4de27e4A3E0f2D6A16C6Ee17dEB69aa8627c';
    this.signedContract.withdrawEtherTo(myAddress).then();
  }

  // callHello(): void {
  //   this.contract.SayHello().then(res => console.log(res));
  // }
  //
  // public setHello(gruss: string): void {
  //   this.contract.SetHello('MOOIN').then(res => console.log('EUREKA'));
  // }

}


