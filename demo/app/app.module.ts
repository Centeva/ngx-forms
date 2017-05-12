import { HomeComponent } from './component/home/';
import { NgModule, Component, NgModuleRef } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy, PlatformLocation } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { appRouterProviders } from './app.routes';
import { NgxFormsUtil, Tools } from '../../src/form.module';
import { FormsConfig, FieldModuleBase } from '../../src/formsConfig';
import { makeDecorator } from "@angular/core/src/util/decorators";
import { isPresent } from "@angular/core/src/facade/lang";
import * as R from 'reflect-metadata';

@Component({
	selector: 'field-one',
	template: '<h3>Field One!</h3>'
})
class fieldOneComponent { }

@Field({Type: 'WOW'}) class fieldTwoComponent{ }

@NgModule({
	declarations: [
		fieldOneComponent,
		fieldTwoComponent
	],
	exports: [
		fieldOneComponent,
		fieldTwoComponent
	]
})
class projectFields extends FieldModuleBase {
	Fields = [fieldOneComponent, fieldTwoComponent]
 }

class MyFormConfig extends FormsConfig {
	refreshCall(s: { Type: string }, form) {
		console.log('WOW!');
	}

	fieldModules = [ projectFields ]
};

let config = new MyFormConfig();

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent
	],
	imports: [
		appRouterProviders,
		BrowserModule,
		FormsModule,
		HttpModule,
		ReactiveFormsModule,
		NgxFormsUtil.forRoot(config)
	],
	bootstrap: [
		AppComponent
	],
	providers: [
		{ provide: LocationStrategy, useClass: HashLocationStrategy },
		HttpModule,
	],
})
export class AppModule {}

export type ngxFieldConfig = Partial<{ Type: string }>;

export function Field(annotation: any) {
  return function (target: Function) {
    var parentTarget = Object.getPrototypeOf(target.prototype).constructor;
    
    var parentAnnotations = R.getMetadata('annotations', parentTarget);
		console.log(parentAnnotation[0]);
    
    var parentAnnotation = parentAnnotations[0];
    Object.keys(parentAnnotation).forEach(key => {
      if (isPresent(parentAnnotation[key])) {
        if (!isPresent(annotation[key])) {
          annotation[key] = parentAnnotation[key];
        }
      }
    });
    
    var metadata = new ComponentMetadata(annotation);

    Reflect.defineMetadata('annotations', [ metadata ], target);
  };
};