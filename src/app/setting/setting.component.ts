import { Component, OnInit } from '@angular/core';

import { PreferenceService } from '../preference.service';
import { Engine, EngineService } from '../engines/engine.service';
import { CustomEngineData } from '../engines/custom-engine';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  searchEngines: Engine[];
  searchEngine: string;
  suggestionEngines: Engine[];
  suggestionEngine: string;
  customEngines: CustomEngineData[];

  getRandomId(): string {
    return 'custom-' + Math.ceil(Math.random() * 10000);
  }

  save() {
    this.preferenceService.setPreference('searchEngine', this.searchEngine);
    this.preferenceService.setPreference('suggestionEngine', this.suggestionEngine);
    this.engineService.saveCustomEngineData(this.customEngines);
  }

  update() {
    this.searchEngines = this.engineService.getSearchEngines();
    this.searchEngine = this.preferenceService.getPreference('searchEngine');
    this.suggestionEngines = this.engineService.getSuggestionEngines();
    this.suggestionEngine = this.preferenceService.getPreference('suggestionEngine');
    this.customEngines = this.engineService.getCustomEngineData();
  }

  constructor(
    private preferenceService: PreferenceService,
    private engineService: EngineService
  ) { }

  ngOnInit() {
    this.update();
  }

}
