import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { PreferenceService } from '../preference.service';
import { EngineService } from '../engines/engine.service';
import { Engine } from '../engines/engine.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public engine: Engine;
  customLogoUrl: string;
  searchText = new Subject<string>();
  enableSuggestion = false;
  openShortcut = false;

  search(key: string) {
    key = key.trim();
    this.engine.search(key);
  }

  changeEngine(text): boolean {
    const engine = this.engineService.findEngine(text);
    if (engine) {
      this.engine = engine;
      this.customLogoUrl = null;
      this.searchText.next('');
      this.toastService.toast(`ℹ️切换搜索引擎: ${engine.name}`);
      return true;
    } else {
      return false;
    }
  }

  constructor(
    private preferenceService: PreferenceService,
    private toastService: ToastService,
    public engineService: EngineService
  ) { }

  ngOnInit() {
    const engineId = this.preferenceService.getPreference('searchEngine');
    this.engine = this.engineService.getSearchEngine(engineId);
    this.customLogoUrl = this.preferenceService.getPreference('customLogoUrl');
  }

}
