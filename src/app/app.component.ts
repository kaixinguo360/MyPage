import { Component, OnInit } from '@angular/core';

import { SyncService } from './sync.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'MyPage';

  constructor(
    private syncService: SyncService
  ) { }

  ngOnInit(): void {
  }
}
