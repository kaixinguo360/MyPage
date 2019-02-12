import { Component, OnInit } from '@angular/core';
import {PreferenceService} from '../preference.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  engines = [ 'google', 'baidu' ];
  engine = this.preference.getPreference('searchEngine');

  save() {
    this.preference.setPreference('searchEngine', this.engine);
  }

  constructor(private preference: PreferenceService) { }

  ngOnInit() {
  }

}
