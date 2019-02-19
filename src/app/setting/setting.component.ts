import { Component, OnInit } from '@angular/core';

import { PreferenceService } from '../preference.service';
import { Engine, EngineService } from '../engines/engine.service';
import { CustomEngineData } from '../engines/custom-engine';
import { SyncService } from '../sync.service';

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
  userName: string;
  userPassword: string;

  getRandomId(): string {
    return 'custom-' + Math.ceil(Math.random() * 10000);
  }

  saveEngines() {
    this.preferenceService.setPreference('searchEngine', this.searchEngine);
    this.preferenceService.setPreference('suggestionEngine', this.suggestionEngine);
    this.engineService.saveCustomEngineData(this.customEngines);
  }

  saveAuthorization() {
    this.syncService.setAuthorization(this.userName, this.userPassword);
    this.userPassword = '';
  }

  update() {
    this.searchEngines = this.engineService.getSearchEngines();
    this.searchEngine = this.preferenceService.getPreference('searchEngine');
    this.suggestionEngines = this.engineService.getSuggestionEngines();
    this.suggestionEngine = this.preferenceService.getPreference('suggestionEngine');
    this.customEngines = this.engineService.getCustomEngineData();
    this.userName = this.preferenceService.getPreference('userName');
    this.userPassword = '';
  }

  constructor(
    private preferenceService: PreferenceService,
    private engineService: EngineService,
    public syncService: SyncService
  ) { }

  ngOnInit() {
    this.update();
  }

}
