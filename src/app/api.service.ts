import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  public getBeluga(): Observable<any> {
    return this.http.get('http://localhost:3000/beluga', {
      headers: new HttpHeaders().append('Content-Type', 'image/jpg'),
      responseType: 'blob'
    });
  }

  public getFoxes(): Observable<any> {
    return this.http.get('http://localhost:3000/foxes', {
      headers: new HttpHeaders().append('Content-Type', 'image/jpg'),
      responseType: 'blob'
    });
  }


  // public postImage(image): Observable<any> {
  // console.log(image);

  // }
}
