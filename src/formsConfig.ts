import { Injectable, NgModuleRef, ModuleWithProviders, NgModule } from '@angular/core';
import { Tools } from './form.module';
import { BrowserModule } from "@angular/platform-browser";

export class FieldModuleBase { }

export interface FormsConfig {
    fieldModules: (ModuleWithProviders | typeof BrowserModule)[];
    innerModule;
}

@Injectable()
export abstract class FormsConfig {

    constructor(config:Partial<FormsConfig> = {}) {
        Object.assign(this, config);
    }
}

