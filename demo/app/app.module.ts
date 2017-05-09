import { HomeComponent } from './component/home/';
import { NgModule, Component, NgModuleRef } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy, PlatformLocation } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { appRouterProviders } from './app.routes';
import { FormModule, Tools } from '../../src/form.module';
import { FormsConfig, FieldModuleBase } from '../../src/formsConfig';

@Component({
	selector: 'field-one',
})
class fieldOneComponent { }

@NgModule({
	declarations: [
		fieldOneComponent
	],
	exports: [
		fieldOneComponent
	]
})
class projectFields extends FieldModuleBase { }

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
		FormModule.initModule(config)
	],
	bootstrap: [
		AppComponent
	],
	providers: [
		{ provide: LocationStrategy, useClass: HashLocationStrategy },
		HttpModule,
	],
})
export class AppModule {
}
