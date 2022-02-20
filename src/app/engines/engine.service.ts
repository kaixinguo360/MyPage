import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PreferenceService } from '../preference.service';
import { PresetEngines } from './preset-engines';
import { CustomEngine, CustomEngineData } from './custom-engine';
import {MainComponent} from '../main/main.component';
import {ToastService} from '../toast.service';

export interface Engine {
  name: string;
  shortName?: string;
  id: string;
  logo?: string;
  search?: (key: string) => void;
  suggestion?: (key: string) => Observable<Suggestion[]>;
}

export interface Suggestion {
  title: string;
  icon?: string;
  order?: number;
  mainAction?: (event: any) => void;
  subAction?: (event: any) => void;
}

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  public mainComponent: MainComponent;

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
  public getPrevSearchEngine(id: string): Engine {
    const engines = this.getSearchEngines();
    let engineIndex = engines.findIndex(e => e.id === id);
    engineIndex = engineIndex === -1 ? 0 : engineIndex;
    return engines[(engineIndex - 1 + engines.length) % engines.length];
  }
  public getNextSearchEngine(id: string): Engine {
    const engines = this.getSearchEngines();
    let engineIndex = engines.findIndex(e => e.id === id);
    engineIndex = engineIndex === -1 ? 0 : engineIndex;
    return engines[(engineIndex + 1 + engines.length) % engines.length];
  }

  public getSuggestionEngines(): Engine[] {
    return this.engines.filter(e => e.suggestion != null);
  }
  public getSuggestionEngine(id: string): Engine {
    const engine = this.getSuggestionEngines().find(e => e.id === id);
    return engine == null ? this.defaultSuggestion : engine;
  }

  public getLogoEngines(): Engine[] {
    return this.engines.filter(e => e.logo);
  }

  public findEngine(text: string): Engine {
    if (!text) { return null; }

    let engine;
    text = text.toLowerCase();

    engine = engine ? engine : this.engines.find(e => e.shortName ? (e.shortName.toLowerCase() === text) : false);
    engine = engine ? engine : this.engines.find(e => e.name.toLowerCase() === text);
    engine = engine ? engine : this.engines.find(e => e.id.toLowerCase() === text);

    engine = engine ? engine : this.engines.find(e => e.shortName ? (e.shortName.toLowerCase().startsWith(text)) : false);
    engine = engine ? engine : this.engines.find(e => e.name.toLowerCase().startsWith(text));
    engine = engine ? engine : this.engines.find(e => e.id.toLowerCase().startsWith(text));

    engine = engine ? engine : this.engines.find(e => e.shortName ? (e.shortName.toLowerCase().indexOf(text) !== -1) : false);
    engine = engine ? engine : this.engines.find(e => e.name.toLowerCase().indexOf(text) !== -1);
    engine = engine ? engine : this.engines.find(e => e.id.toLowerCase().indexOf(text) !== -1);

    return engine;
  }
  public changeEngine(engine: string | Engine): boolean {
    return this.mainComponent.changeEngine(engine);
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
      private preferenceService: PreferenceService,
      private toastService: ToastService,
  ) {
    this.updateEngines();
  }

}
