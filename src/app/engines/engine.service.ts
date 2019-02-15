import { Injectable } from '@angular/core';

import { Engine, Engines } from './engines';

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  public getSearchEngines(): Engine[] {
    return this.engines.all.filter(e => e.search != null);
  }

  public getSearchEngine(id: string): Engine {
    const engine = this.getSearchEngines().find(e => e.id === id);
    return engine == null ? this.engines.defaultSearch : engine;
  }

  public getSuggestionEngines(): Engine[] {
    return this.engines.all.filter(e => e.suggestion != null);
  }

  public getSuggestionEngine(id: string): Engine {
    const engine = this.getSuggestionEngines().find(e => e.id === id);
    return engine == null ? this.engines.defaultSuggestion : engine;
  }

  constructor(
    private engines: Engines
  ) { }
}
