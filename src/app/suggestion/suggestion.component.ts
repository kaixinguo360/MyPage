import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PreferenceService } from '../preference.service';
import { EngineService } from '../engines/engine.service';
import { Engine } from '../engines/engine.service';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnInit {

  @Input() enable: boolean;
  @Input() input: Observable<string>;
  inputText: string;

  @Output() output: EventEmitter<string> = new EventEmitter<string>();

  suggestionEngine: Engine;
  searchEngine: Engine;
  suggestions: string[] = [];
  selected = -1;

  keydown(event: KeyboardEvent) {
    const length = this.suggestions.length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (this.selected >= -1 && this.selected < length - 1) {
          this.selected++;
        }
        this.outputChange(this.selected === -1 ? this.inputText : this.suggestions[this.selected]);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.selected > -1 && this.selected < length) {
          this.selected--;
        }
        this.outputChange(this.selected === -1 ? this.inputText : this.suggestions[this.selected]);
        break;
    }
  }

  outputChange(output: string) {
    this.output.emit(output);
  }

  inputChange(input: string) {
    this.inputText = input;
    window.stop();
    this.suggestionEngine.suggestion(input)
      .subscribe(suggestions => {
        this.selected = -1;
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

    const suggestionEngineId = this.preferenceService.getPreference('suggestionEngine');
    this.suggestionEngine = this.engineService.getSuggestionEngine(suggestionEngineId);

    const searchEngineId = this.preferenceService.getPreference('searchEngine');
    this.searchEngine = this.engineService.getSearchEngine(searchEngineId);
  }

}
