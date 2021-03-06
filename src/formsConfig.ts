import { Injectable } from '@angular/core';
import { Tools } from './form.module';

@Injectable()
export abstract class FormsConfig {
    abstract refreshCall<T> (s: T, ...form: Tools.Form[]);

    constructor({}:Partial<FormsConfig> = {}) {
        for(let p in arguments[0]) {
            if(arguments[0].hasOwnProperty(p)) {
                this[p] = arguments[0][p];
            }
        }
    }
}
