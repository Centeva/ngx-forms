import { Injectable, NgModuleRef, ModuleWithProviders } from '@angular/core';
import { Tools } from './form.module';
import { BrowserModule } from "@angular/platform-browser";

export class FieldModuleBase { }

export interface FormsConfig {
    refreshCall<T>(s: T, ...form: Tools.Form[]);
    fieldModules: (ModuleWithProviders | typeof BrowserModule)[];

}

@Injectable()
export abstract class FormsConfig {

    constructor(base?: Partial<FormsConfig>) {
        for (let p in base) {
            if (base.hasOwnProperty(p)) {
                this[p] = base[p];
            }
        }
    }
}

