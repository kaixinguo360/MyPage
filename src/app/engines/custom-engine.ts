import { Engine } from './engine.service';

export interface CustomEngineData {
  id: string;
  name: string;
  url: string;
}

export class CustomEngine implements Engine {

  public id;
  public name;
  public shortName;
  public logo;
  private url;

  public search(key: string) {
    window.location.href = this.url.replace('%s', key);
  }

  constructor(data: CustomEngineData) {
    this.id = data.id;
    this.url = data.url;

    const tmp = data.name.split(',');
    this.name = tmp[0];
    this.shortName = tmp[1] ? tmp[1] : null;
    this.logo = tmp[2] ? tmp[2] : null;
  }
}
