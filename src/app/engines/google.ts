import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import {Engine, Suggestion} from './engine.service';

@Injectable({
  providedIn: 'root'
})
export class Google implements Engine {

  public id = 'google';
  public name = 'Google';
  public shortName = 'google';
  public logo = 'logo_google.png';

  public search(key: string) {
    window.location.href = 'https://www.google.com/search?q=' + key;
  }

  public suggestion(key: string): Observable<Suggestion[]> {
    const subject = new Subject<Suggestion[]>();
    this.http.jsonp('https://suggestqueries.google.com/complete/search?client=youtube&q=' + key, 'jsonp')
      .pipe(
        tap(res => {
          const su: object[] = res[1];
          if (su.length > 5) {
            su.length = 5;
          }
          const suggestions: Suggestion[] = [];
          su.forEach(item => suggestions.push({
            title: item[0],
            mainAction: (event) => event.mainComponent.search(item[0]),
            subAction: (event) => {
              event.suggestionComponent.output.emit(item[0]);
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
