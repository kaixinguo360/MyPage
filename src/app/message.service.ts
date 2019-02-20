import { Injectable } from '@angular/core';

import { ToastService } from './toast.service';

export interface UserMessage {
  title: string;
  notify: boolean;
  url?: string;
  content?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public _notify: UserMessage[] = [];
  public _info: UserMessage[] = [];

  public notify(msg: UserMessage) {
    this.toastService.toast('🔔' + msg.title);
    this._notify.push(msg);
  }

  public info(msg: UserMessage) {
    this._info.push(msg);
  }

  public clear() {
    this._notify.length = 0;
    this._info.length = 0;
  }

  constructor(
    private toastService: ToastService,
  ) { }
}
