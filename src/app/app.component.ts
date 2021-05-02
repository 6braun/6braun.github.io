import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiService} from './api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BlockchainService} from './services/blockchain.service';

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

  public constructor(private sanitizer: DomSanitizer,
                     private api: ApiService,
                     private http: HttpClient,
                     private formBuilder: FormBuilder,
                     public blockService: BlockchainService) {
    api.getBeluga().subscribe((baseImage: any) => {
      const blob = new Blob([baseImage]);
      const unsafeImg = URL.createObjectURL(blob);
      this.upperLeft = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
    });
    api.getFoxes().subscribe((baseImage: any) => {
      const blob = new Blob([baseImage]);
      const unsafeImg = URL.createObjectURL(blob);
      this.upperRight = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
    });
  }

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      uploadedImage: ['']
    });
  }

  // public switchImage(): void {
  //   this.api.getFoxes().subscribe((baseImage: any) => {
  //     const blob = new Blob([baseImage]);
  //     const unsafeImg = URL.createObjectURL(blob);
  //     this.upperLeft = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
  //   });
  // }

  public onFileSelect(event): void {
    const file = event.target.files[0];
    this.fileInputLabel = file.name;
    this.fileUploadForm.get('uploadedImage').setValue(file);
  }


  public onFormSubmit(): void {
    if (!this.fileUploadForm.get('uploadedImage').value) {
      console.log('Keine Datei vorhanden');
      return;
    }

    const formData = new FormData();
    formData.append('uploadedImage', this.fileUploadForm.get('uploadedImage').value);


    this.http.post<any>('http://localhost:3000/upload', formData).subscribe(response => {
      console.log(response.uploadedFile);
      // An dieser Stelle kann die Response verarbeiten;
    }, error => {
      console.log(error);
    });
  }

  public withdrawEther(): void{
    this.blockService.withdrawEther();
  }
}
