import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { PreferenceService } from '../preference.service';
import { EngineService } from '../engines/engine.service';
import { Engine } from '../engines/engine.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  engine: Engine;
  searchText = new Subject<string>();
  enableSuggestion = false;

  search(key: string) {
    key = key.trim();
    if (key.length > 0) {
      this.engine.search(key);
    }
  }

  constructor(
    private preferenceService: PreferenceService,
    public engineService: EngineService
  ) { }

  ngOnInit() {
    const engineId = this.preferenceService.getPreference('searchEngine');
    this.engine = this.engineService.getSearchEngine(engineId);
  }

}
