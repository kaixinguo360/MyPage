import { Component, OnInit } from '@angular/core';

import { PreferenceService } from '../preference.service';
import { EngineService } from '../engines/engine.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  searchEngines = this.engineService.getSearchEngines();
  searchEngine = this.preferenceService.getPreference('searchEngine');
  suggestionEngines = this.engineService.getSuggestionEngines();
  suggestionEngine = this.preferenceService.getPreference('suggestionEngine');

  save() {
    this.preferenceService.setPreference('searchEngine', this.searchEngine);
    this.preferenceService.setPreference('suggestionEngine', this.suggestionEngine);
  }

  constructor(
    private preferenceService: PreferenceService,
    private engineService: EngineService
  ) { }

  ngOnInit() {
  }

}
