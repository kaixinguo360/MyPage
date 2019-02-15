import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Google } from './google';
import { Baidu } from './baidu';

export interface Engine {
  name: string;
  id: string;
  search?: (key: string) => void;
  suggestion?: (key: string) => Observable<string[]>;
}

@Injectable({
  providedIn: 'root'
})
export class Engines {

  public defaultSearch = this.google;

  public defaultSuggestion = this.google;

  public all: Engine[] = [
    this.google,
    this.baidu
  ];

  constructor(
    private google: Google,
    private baidu: Baidu
  ) { }
}
