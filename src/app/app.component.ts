import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiService} from './api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BlockchainService} from './services/blockchain.service';
import {ethers} from 'ethers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  upperLeft: any;
  upperRight: any;
  @ViewChild('UploadFileInput', {static: false}) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;

  idForFunds: string;
  fundsToAdd: string;

  public constructor(private sanitizer: DomSanitizer,
                     private api: ApiService,
                     private http: HttpClient,
                     private formBuilder: FormBuilder,
                     public blockService: BlockchainService) {

    // Bilder werden einzeln und zufällig geladen, da es als .zip nicht klappen möchte :)
    this.getImageFromApi();
    this.getImageFromApi();
  }

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      uploadedImage: [''],
      etherSend: 0
    });
  }

  public getImageFromApi(): void {
    this.api.getImage().subscribe((baseImage: any) => {
      const blob = new Blob([baseImage]);
      const unsafeImg = URL.createObjectURL(blob);

      this.upperRight === undefined ?
        this.upperRight = this.sanitizer.bypassSecurityTrustUrl(unsafeImg) :
        this.upperLeft = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
    });
  }

  public getFunds(): void {
    this.blockService.getFunds(parseInt(this.idForFunds, 10))
      .then(res => console.log(console.log(parseInt(res._hex, 16))
      ));
  }

  public augmentAds(): void {
    const id = parseInt(this.idForFunds, 10);
    const funds = parseInt(this.fundsToAdd, 10);

    const payment = ethers.utils.parseEther(this.fundsToAdd);
    const overrides = {
      value: payment
    };
    this.blockService.augmentAds(id, funds, overrides).then(res => {
      console.log('Funds Added!');
    });
  }

  public onFileSelect(event): void {
    const file = event.target.files[0];
    this.fileInputLabel = file.name;
    this.fileUploadForm.get('uploadedImage').setValue(file);
    console.log(this.fileUploadForm);
  }


  public async onFormSubmit(): Promise<void> {
    if (!this.fileUploadForm.get('uploadedImage').value || !this.fileUploadForm.get('etherSend')) {
      console.log('Keine Datei vorhanden');
      return;
    }

    const formData = new FormData();
    formData.append('uploadedImage', this.fileUploadForm.get('uploadedImage').value);
    formData.append('etherSend', this.fileUploadForm.get('etherSend').value);


    // Diese Lösung hört auf lediglich auf die Bestätigung von Metamask, dass die Transaktion gesendet wurde.
    // In Zukunft zusätzlich auf bestätigte Blöcke hören!!
    this.blockService.sendMoney(this.fileUploadForm.get('etherSend').value).then((res) => {
      this.http.post<any>('http://localhost:3000/upload', formData).subscribe(response => {
        console.log(response);
        // An dieser Stelle kann die Response verarbeitet werden;
      }, error => {
        console.log(error);
      });
    });
  }

  public withdrawEther(): void {
    this.blockService.withdrawEther();
  }
}
