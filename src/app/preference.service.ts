import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  public setPreference(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getPreference(key: string): string {
    return localStorage.getItem(key);
  }

  constructor() { }
}
