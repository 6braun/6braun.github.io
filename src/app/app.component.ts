import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiService} from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  message: any;

  public constructor(private http: HttpClient, private sanitizer: DomSanitizer, private api: ApiService) {
    api.getBeluga().subscribe((baseImage: any) => {
      const blob = new Blob([baseImage]);
      const unsafeImg = URL.createObjectURL(blob);
      this.message = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
    });
  }
}
