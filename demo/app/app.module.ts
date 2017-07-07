import { HomeComponent } from './component/home/';
import { NgModule, Component, NgModuleRef, EventEmitter, Output, Input } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy, PlatformLocation, CommonModule } from "@angular/common";
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
import { NgPipesModule } from 'angular-pipes';
import { SearchOptionsComponent } from "../../src/searchOptions/index";

@Component({
	selector: 'field-one',
	template: '<h3>Field One!</h3>'
})
export class fieldOneComponent { }

@Component({
	selector: 'field-two',
	template: '<h3>Field Two!</h3>'
})
export class fieldTwoComponent{ }

@Component({
	selector: 'field-three',
	template: '<h3>{{fieldName}}</h3> <input type="text" [(ngModel)]="value" (keyup)="valueChanged.emit(value);">'
})
export class fieldThreeComponent {
	@Input() fieldName: string;
	@Input() value: string;
	@Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
 }

@NgModule({
	declarations: [
		fieldOneComponent,
		fieldTwoComponent,
		fieldThreeComponent,
	],
	exports: [
		fieldOneComponent,
		fieldTwoComponent,
		fieldThreeComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		NgPipesModule
	]
})
class projectFields extends FieldModuleBase {}

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

// export function Field(annotation: any) {
//   return function (target: Function) {
//     var parentTarget = Object.getPrototypeOf(target.prototype).constructor;
    
//     var parentAnnotations = R.getMetadata('annotations', parentTarget);
// 		console.log(parentAnnotation[0]);
    
//     var parentAnnotation = parentAnnotations[0];
//     Object.keys(parentAnnotation).forEach(key => {
//       if (isPresent(parentAnnotation[key])) {
//         if (!isPresent(annotation[key])) {
//           annotation[key] = parentAnnotation[key];
//         }
//       }
//     });
    
//     var metadata = new ComponentMetadata(annotation);

//     Reflect.defineMetadata('annotations', [ metadata ], target);
//   };
// };