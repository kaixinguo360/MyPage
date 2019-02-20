import { Component, Input, OnInit } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

import { fromEvent } from 'rxjs';

import { ToastService } from '../toast.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('fadeIn', [
      state('in', style({ display: 'none' })),
      transition('void => *', [
        animate(100, keyframes([
          style({ opacity: 0, offset: 0 }),
          style({ opacity: 1, offset: 1 })
        ]))
      ]),
      transition('* => void', [
        animate(100, keyframes([
          style({ opacity: 1, offset: 0 }),
          style({ opacity: 0, offset: 1 })
        ]))
      ]),
    ])]
})
export class HeaderComponent implements OnInit {

  @Input() mode: string;
  toasts: string[] = [];
  showNotificationBox = false;
  location = location;

  constructor(
    private toastService: ToastService,
    public messageService: MessageService
  ) { }

  ngOnInit() {
    // 显示Toast
    this.toastService.getToast()
      .subscribe(toast => {
        this.toasts.push(toast.text);
        setTimeout(() => this.toasts.shift(), toast.time);
      });

    // 显示网络状况
    if (!navigator.onLine) { this.toastService.toast('⚠️未连接到网络'); }
    fromEvent(window, 'online').subscribe(() => this.toastService.toast('ℹ️已连接到网络'));
    fromEvent(window, 'offline').subscribe(() => this.toastService.toast('⚠️未连接到网络'));

  }

}
