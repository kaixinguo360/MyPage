import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import {Engine, Suggestion} from './engine.service';

@Injectable({
  providedIn: 'root'
})
export class Baidu implements Engine {

  public id = 'baidu';
  public name = '百度';
  public shortName = 'baidu';
  public logo = 'logo_baidu.png';

  public search(key: string) {
    window.location.href = 'https://www.baidu.com/s?wd=' + key;
  }

  public suggestion(key: string): Observable<Suggestion[]> {
    const subject = new Subject<Suggestion[]>();
    this.http.jsonp<{s: object[]}>('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=' + key, 'cb')
      .pipe(
        tap(res => {
          const su: object[] = res.s;
          if (su.length > 5) {
            su.length = 5;
          }
          const suggestions: Suggestion[] = [];
          (su as unknown[]).forEach((item: string) => suggestions.push({
            title: item,
            mainAction: (event) => event.mainComponent.search(item),
            subAction: (event) => {
              event.suggestionComponent.output.emit(item);
              event.suggestionComponent.clearSuggestions();
            },
          }));
          subject.next(suggestions);
        }),
        catchError(err => of(err))
      ).subscribe();
    return subject;
  }

  constructor(private http: HttpClient) { }
}
