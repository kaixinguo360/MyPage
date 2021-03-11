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
  logo: string;
  searchText = new Subject<string>();
  enableSuggestion = false;
  openShortcut = false;

  search(key: string) {
    key = key.trim();
    this.engine.search(key);
  }

  changeEngine(engine: string | Engine): boolean {
    if (typeof(engine) === 'string') {
      engine = this.engineService.findEngine(engine);
    }
    if (engine) {
      this.engine = engine;
      this.logo = engine.logo
        ? this.getAbsoluteLogoUrl(engine.logo)
        : this.getAbsoluteLogoUrl(this.engineService.defaultSearch.logo);
      this.searchText.next('');
      this.toastService.toast(`ℹ️切换搜索引擎: ${engine.name}`);
      return true;
    } else {
      return false;
    }
  }

  prevEngine() {
    const engine = this.engineService.getPrevSearchEngine(this.engine.id);
    this.changeEngine(engine);
  }

  nextEngine() {
    const engine = this.engineService.getNextSearchEngine(this.engine.id);
    this.changeEngine(engine);
  }

  getAbsoluteLogoUrl(logoUrl: string): string {
    return /^https?:\/\//.test(logoUrl) ? logoUrl : ('data/assets/images/' + logoUrl);
  }

  constructor(
    private preferenceService: PreferenceService,
    private toastService: ToastService,
    public engineService: EngineService
  ) { }

  ngOnInit() {
    const engineId = this.preferenceService.getPreference('searchEngine');
    this.engine = this.engineService.getSearchEngine(engineId);
    const customLogoUrl = this.preferenceService.getPreference('customLogoUrl');
    this.logo = customLogoUrl ? this.getAbsoluteLogoUrl(customLogoUrl) : this.getAbsoluteLogoUrl(this.engine.logo);
  }

}
