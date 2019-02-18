import { Component, Input, OnInit } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

import { ToastService } from '../toast.service';

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

  constructor(
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.toastService.getSubscription()
      .subscribe(toast => {
        this.toasts.push(toast.text);
        setTimeout(() => this.toasts.shift(), toast.time);
      });
  }

}
