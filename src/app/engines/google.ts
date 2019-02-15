import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Engine } from './engine.service';

@Injectable({
  providedIn: 'root'
})
export class Google implements Engine {

  public id = 'google';
  public name = 'Google';
  public logo = '../../assets/images/logo_google.png';

  public search(key: string) {
    window.location.href = 'https://www.google.com/search?q=' + key;
  }

  public suggestion(key: string): Observable<string[]> {
    const subject = new Subject<string[]>();
    this.http.jsonp('http://suggestqueries.google.com/complete/search?client=youtube&q=' + key, 'jsonp')
      .pipe(
        tap(res => {
          const su: object[] = res[1];
          if (su.length > 5) {
            su.length = 5;
          }
          const suggestions: string[] = [];
          su.forEach(item => suggestions.push(item[0]));
          subject.next(suggestions);
        }),
        catchError(err => of(err))
      ).subscribe();
    return subject;
  }

  constructor(private http: HttpClient) { }
}
