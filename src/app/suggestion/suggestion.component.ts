import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { PreferenceService } from '../preference.service';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnInit {

  @Input() input: Observable<string>;
  @Output() output: EventEmitter<string> = new EventEmitter<string>();
  suggestions: string[] = [];
  engine = this.preference.getPreference('suggestionEngine');

  private inputChange(input: string) {
    window.stop();
    switch (this.engine) {
      case 'google': {
        this.http.jsonp('http://suggestqueries.google.com/complete/search?client=youtube&q=' + input, 'jsonp')
          .pipe(
            tap(res => {
              const su: object[] = res[1];
              if (su.length > 5) {
                su.length = 5;
              }
              this.suggestions.length = 0;
              su.forEach(item => this.suggestions.push(item[0]));
            }),
            catchError(err => of(err))
          ).subscribe();
        break;
      }
      case 'baidu': {
        this.http.jsonp<{s: object[]}>('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=' + input, 'cb')
          .pipe(
            tap(res => {
              const su: object[] = res.s;
              if (su.length > 5) {
                su.length = 5;
              }
              this.suggestions.length = 0;
              this.suggestions.push.apply(this.suggestions, su);
            }),
            catchError(err => of(err))
          ).subscribe();
        break;
      }
    }
  }

  constructor(
    private http: HttpClient,
    private preference: PreferenceService
  ) { }

  ngOnInit() {
    this.input.subscribe(input => this.inputChange(input));
  }

}
