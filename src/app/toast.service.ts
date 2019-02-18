import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private subject = new Subject<{ time: number; text: string }>();

  public getSubscription(): Observable<{ time: number; text: string }> {
    return this.subject;
  }

  public toast(text: string, time: number = 3000) {
    this.subject.next({ text: text, time: time});
  }

  constructor() { }
}
