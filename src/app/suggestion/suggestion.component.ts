import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PreferenceService } from '../preference.service';
import { EngineService } from '../engines/engine.service';
import { Engine } from '../engines/engines';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnInit {

  @Input() input: Observable<string>;
  @Output() output: EventEmitter<string> = new EventEmitter<string>();
  suggestions: string[] = [];
  engine: Engine;

  private inputChange(input: string) {
    window.stop();
    this.engine.suggestion(input)
      .subscribe(suggestions => {
        this.suggestions.length = 0;
        this.suggestions.push.apply(this.suggestions, suggestions);
      });
  }

  constructor(
    private http: HttpClient,
    private preferenceService: PreferenceService,
    private engineService: EngineService
  ) { }

  ngOnInit() {
    this.input.subscribe(input => this.inputChange(input));

    const engineId = this.preferenceService.getPreference('suggestionEngine');
    this.engine = this.engineService.getSuggestionEngine(engineId);
  }

}
