import { Component, OnInit } from '@angular/core';

import { PreferenceService } from '../preference.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  searchEngines: { title: string; id: string }[] = [
    { title: 'Google', id: 'google' },
    { title: '百度', id: 'baidu' }
  ];
  searchEngine = this.preference.getPreference('searchEngine');
  suggestionEngines: { title: string; id: string }[] = [
    { title: 'Google', id: 'google' },
    { title: '百度', id: 'baidu' }
  ];
  suggestionEngine = this.preference.getPreference('suggestionEngine');

  save() {
    this.preference.setPreference('searchEngine', this.searchEngine);
    this.preference.setPreference('suggestionEngine', this.suggestionEngine);
  }

  constructor(private preference: PreferenceService) { }

  ngOnInit() {
  }

}
