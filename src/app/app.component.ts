import { Component, OnInit } from '@angular/core';

import { SyncService } from './sync.service';
import {PreferenceService} from './preference.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'MyPage';

  constructor(
    private syncService: SyncService,
    private preferenceService: PreferenceService,
  ) { }

  ngOnInit(): void {
    const backgroundImageUrl = this.preferenceService.getPreference('backgroundImageUrl');
    if (backgroundImageUrl) {
      document.body.style.backgroundImage = `url(\'${backgroundImageUrl}\')`;
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundSize = 'cover';
    }
  }
}
