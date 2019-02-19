import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { fromEvent, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';

import { PreferenceService } from './preference.service';
import { ToastService } from './toast.service';
import { CustomEngineData } from './engines/custom-engine';

interface UserData {
  searchEngine: string;
  suggestionEngine: string;
  customEngines: CustomEngineData[];
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  private url = 'data/user/';
  private user: string;
  private token: string;

  public syncData(verbose: boolean = true) {
    this.loadAuthorization();

    if (!this.user) {
      return;
    }

    let headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    if (this.token) {
      headers = headers.append('Authorization', 'Basic ' + this.token);
    }
    if (verbose) {
      this.toastService.toast('ℹ️正在同步');
    }
    this.http.get<UserData>(this.url + this.user + '/data.json', { headers: headers }).pipe(
      tap(res => {
        const sign = Md5.hashStr(JSON.stringify(res)).toString();
        if (sign !== this.preferenceService.getPreference('sign')) {
          this.preferenceService.setPreference('sign', sign);
          this.importData(res);
          this.toastService.toast('ℹ️数据已更新');
          setTimeout(() => location.reload(), 1000);
        } else {
          if (verbose) {
            this.toastService.toast('ℹ️已是最新');
          }
        }
      }),
      catchError(err => {
        this.toastService.toast('⚠️同步失败');
        return of(err);
      })
    ).subscribe();
  }

  private importData(data: UserData) {
    this.preferenceService.setPreference('searchEngine', data.searchEngine);
    this.preferenceService.setPreference('suggestionEngine', data.suggestionEngine);
    this.preferenceService.setPreference('customEngines', JSON.stringify(data.customEngines));
  }

  public exportData(): UserData {
    return {
      searchEngine: this.preferenceService.getPreference('searchEngine'),
      suggestionEngine: this.preferenceService.getPreference('suggestionEngine'),
      customEngines: JSON.parse(this.preferenceService.getPreference('customEngines')),
    };
  }

  public exportDataString(): string {
    return JSON.stringify(this.exportData());
  }

  public setAuthorization(user?: string, password?: string) {
    this.preferenceService.setPreference('userName', user ? user : '');
    this.preferenceService.setPreference('userToken', user ? (password ? btoa(user + ':' + password) : '') : '');
    this.loadAuthorization();
  }

  private loadAuthorization() {
    this.user = this.preferenceService.getPreference('userName');
    this.user = this.user === '' ? null : this.user;
    this.token = this.preferenceService.getPreference('userToken');
    this.token = this.token === '' ? null : this.token;
  }

  constructor(
    private http: HttpClient,
    private preferenceService: PreferenceService,
    private toastService: ToastService
  ) {
    this.loadAuthorization();

    if (navigator.onLine) { this.syncData(false); }
    fromEvent(window, 'online').subscribe(() => this.syncData(false));
  }
}
