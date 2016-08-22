import { Injectable } from '@angular/core';
import { Config } from './config';

@Injectable()
export class Storage {
  private store = {};
  private isStorageAvailable: boolean;

  constructor(private config: Config) {
    this.isStorageAvailable = (() => {
      try {
        let supported = config.storageType in window && window[config.storageType] !== null;

        if (supported) {
          let key = Math.random().toString(36).substring(7);
          (<any>window[this.config.storageType]).setItem(key, '');
          (<any>window[this.config.storageType]).removeItem(key);
        }

        return supported;
      } catch (e) {
        return false;
      }
    })();
    if (!this.isStorageAvailable) {
      console.warn(config.storageType + ' is not available.');
    }
  }

  get(key: string) {
    return this.isStorageAvailable ? window[this.config.storageType].getItem(key) : this.store[key];
  }

  set(key: string, value: string) {
    return this.isStorageAvailable ? window[this.config.storageType].setItem(key, value) : this.store[key] = value;
  }

  remove(key: string) {
    return this.isStorageAvailable ? window[this.config.storageType].removeItem(key) : delete this.store[key];
  }
}
