import { Component, Input } from '@angular/core';

import { EngineService } from '../engines/engine.service';

@Component({
  selector: 'app-shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.css']
})
export class ShortcutComponent {

  @Input() enable: boolean;
  @Input() input: string;

  searchEngines = this.engineService.getSearchEngines();

  constructor(
    private engineService: EngineService
  ) { }

}
