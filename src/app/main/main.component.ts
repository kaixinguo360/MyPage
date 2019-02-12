import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { PreferenceService } from '../preference.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  engine = this.preference.getPreference('searchEngine');
  searchText = new Subject<string>();

  constructor(private preference: PreferenceService) { }

  ngOnInit() {
  }

}
