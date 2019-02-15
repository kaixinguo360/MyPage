import { Injectable } from '@angular/core';

import { Engine } from './engine.service';
import { Google } from './google';
import { Baidu } from './baidu';

@Injectable({
  providedIn: 'root'
})
export class PresetEngines {

  public defaultSearch = this.google;

  public defaultSuggestion = this.google;

  public engines: Engine[] = [
    this.google,
    this.baidu
  ];

  constructor(
    private google: Google,
    private baidu: Baidu
  ) { }
}
