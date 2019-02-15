import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { PreferenceService } from '../preference.service';
import { EngineService } from '../engines/engine.service';
import { Engine } from '../engines/engines';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  engine: Engine;
  searchText = new Subject<string>();

  constructor(
    private preferenceService: PreferenceService,
    private engineService: EngineService
  ) { }

  ngOnInit() {
    const engineId = this.preferenceService.getPreference('searchEngine');
    this.engine = this.engineService.getSuggestionEngine(engineId);
  }

}
