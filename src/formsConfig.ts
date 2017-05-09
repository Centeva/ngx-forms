import { Injectable, NgModuleRef } from '@angular/core';
import { Tools } from './form.module';

@Injectable()
export abstract class FormsConfig {
    abstract refreshCall<T> (s: T, ...form: Tools.Form[]);

    abstract fieldModules = [];

    constructor(config:Partial<FormsConfig> = {}) {
        Object.assign(this, config);
    }
}
