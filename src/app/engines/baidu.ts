import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Engine } from './engine.service';

@Injectable({
  providedIn: 'root'
})
export class Baidu implements Engine {

  public id = 'baidu';
  public name = '百度';
  public logo = 'assets/images/logo_baidu.png';

  public search(key: string) {
    window.location.href = 'https://www.baidu.com/s?wd=' + key;
  }

  public suggestion(key: string): Observable<string[]> {
    const subject = new Subject<string[]>();
    this.http.jsonp<{s: object[]}>('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=' + key, 'cb')
      .pipe(
        tap(res => {
          const su: object[] = res.s;
          if (su.length > 5) {
            su.length = 5;
          }
          const suggestions: string[] = [];
          suggestions.push.apply(suggestions, su);
          subject.next(suggestions);
        }),
        catchError(err => of(err))
      ).subscribe();
    return subject;
  }

  constructor(private http: HttpClient) { }
}
