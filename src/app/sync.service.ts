import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { fromEvent, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';
import { parse } from 'toml';

import { PreferenceService } from './preference.service';
import { ToastService } from './toast.service';
import { MessageService, UserMessage } from './message.service';
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

  /* ---------- Authorization ----------*/

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

  /* ---------- Data ----------*/

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

  /* ---------- Subscription ----------*/

  public syncSubscriptions(verbose: boolean = true) {
    this.loadAuthorization();

    if (!this.user) {
      return;
    }

    this.messageService.clear();
    let headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    if (this.token) {
      headers = headers.append('Authorization', 'Basic ' + this.token);
    }
    if (verbose) {
      this.toastService.toast('ℹ️正在获取订阅');
    }
    this.http.get<string[]>(this.url + this.user + '/subs.json', { headers: headers }).pipe(
      tap(subs => subs.forEach(sub => this.checkSubscription(sub))),
      catchError(err => {
        this.toastService.toast('⚠️订阅列表获取失败');
        return of(err);
      })
    ).subscribe();
  }

  private checkSubscription(sub: string) {
    let headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    if (this.token) {
      headers = headers.append('Authorization', 'Basic ' + this.token);
    }
    this.http.get(this.url + this.user + '/subs/' + sub, { headers: headers, responseType: 'text' }).pipe(
      tap(res => this.handleSubscription(sub, res)),
      catchError(err => {
        this.toastService.toast('⚠️订阅' + sub + '获取失败');
        return of(err);
      })
    ).subscribe();
  }

  private handleSubscription(sub: string, res: string) {
    const message = parse(res);
    if (message.notify) {
      const n: UserMessage = message.notify;
      n.title = n.title ? n.title : '来自' + sub + '的新消息';
      this.messageService.notify(n);
    }
    if (message.info) {
      const i: UserMessage = message.info;
      i.title = i.title ? i.title : '来自' + sub + '的消息';
      this.messageService.info(i);
    }
  }

  /* ---------- All ----------*/

  public syncAll(verbose: boolean = true) {
    this.syncData(verbose);
    this.syncSubscriptions(verbose);
  }

  constructor(
    private http: HttpClient,
    private preferenceService: PreferenceService,
    private toastService: ToastService,
    private messageService: MessageService
  ) {
    this.loadAuthorization();

    if (navigator.onLine) { this.syncAll(false); }
    fromEvent(window, 'online').subscribe(() => this.syncAll(false));
  }
}
