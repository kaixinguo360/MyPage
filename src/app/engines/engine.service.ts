import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PreferenceService } from '../preference.service';
import { PresetEngines } from './preset-engines';
import { CustomEngine, CustomEngineData } from './custom-engine';

export interface Engine {
  name: string;
  id: string;
  logo?: string;
  search?: (key: string) => void;
  suggestion?: (key: string) => Observable<string[]>;
}

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  public defaultSearch: Engine;
  public defaultSuggestion: Engine;
  public engines: Engine[] = [];

  public addCustomEngineData(id: string, name: string, url: string) {
    const newEngine: CustomEngineData = {
      id: id,
      name: name,
      url: url
    };
    const engines: CustomEngineData[] = this.getCustomEngineData();
    engines.push(newEngine);
    this.saveCustomEngineData(engines);
  }

  public removeCustomEngineData(id: string) {
    let engines: CustomEngineData[] = this.getCustomEngineData();
    engines = engines.filter(e => e.id !== id);
    this.saveCustomEngineData(engines);
  }

  public getCustomEngineData(): CustomEngineData[] {
    const customs = this.preferenceService.getPreference('customEngines');
    const engines = JSON.parse(customs);
    return (engines instanceof Array) ? engines : [];
  }

  public saveCustomEngineData(engines: CustomEngineData[]) {
    this.preferenceService.setPreference('customEngines', JSON.stringify(engines));
    this.updateEngines();
  }

  private getCustomEngines(): CustomEngine[] {
    const data: CustomEngineData[] = this.getCustomEngineData();
    const engines: CustomEngine[] = [];
    data.forEach(d => engines.push(new CustomEngine(d)));
    return engines;
  }

  public getSearchEngines(): Engine[] {
    return this.engines.filter(e => e.search != null);
  }

  public getSearchEngine(id: string): Engine {
    const engine = this.getSearchEngines().find(e => e.id === id);
    return engine == null ? this.defaultSearch : engine;
  }

  public getSuggestionEngines(): Engine[] {
    return this.engines.filter(e => e.suggestion != null);
  }

  public getSuggestionEngine(id: string): Engine {
    const engine = this.getSuggestionEngines().find(e => e.id === id);
    return engine == null ? this.defaultSuggestion : engine;
  }

  public getLogoEngines(): Engine[] {
    return this.engines.filter(e => e.logo != null);
  }

  private updateEngines() {
    this.defaultSearch = this.presetEngines.defaultSearch;
    this.defaultSuggestion = this.presetEngines.defaultSuggestion;
    this.engines.length = 0;
    this.engines.push.apply(this.engines, this.presetEngines.engines);
    this.engines.push.apply(this.engines, this.getCustomEngines());
  }

  constructor(
    private presetEngines: PresetEngines,
    private preferenceService: PreferenceService
  ) {
    this.updateEngines();
  }

}
