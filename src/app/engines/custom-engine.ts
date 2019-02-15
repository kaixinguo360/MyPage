import { Engine } from './engine.service';

export interface CustomEngineData {
  id: string;
  name: string;
  url: string;
}

export class CustomEngine implements Engine {

  public id;
  public name;
  private url;

  public search(key: string) {
    window.location.href = this.url.replace('%s', key);
  }

  constructor(data: CustomEngineData) {
    this.id = data.id;
    this.name = data.name;
    this.url = data.url;
  }
}
