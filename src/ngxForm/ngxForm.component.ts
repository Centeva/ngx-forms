import { Component, OnChanges, Input, trigger, state, style, transition, animate, OnInit, OnDestroy, Output, EventEmitter, ViewContainerRef, Compiler, ModuleWithComponentFactories, ViewChild, ReflectiveInjector } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Tools } from './ngxForm.models';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FormsConfig } from '../formsConfig';

@Component({
	selector: 'ngx-form',
	templateUrl: 'ngxForm.component.html',
	styleUrls: ['ngxForm.component.less']
})
export class NgxFormComponent<T> implements OnInit {

	@ViewChild('body', { read: ViewContainerRef }) body;
	factory: ModuleWithComponentFactories<any>;

	@Input() form: Tools.Form<T>;

	constructor(public config: FormsConfig, private vcRef: ViewContainerRef, private compiler: Compiler) {
		console.log(config.fieldModules);
	}

	ngOnInit() {
		this.compiler.compileModuleAndAllComponentsAsync(this.config.innerModule)
			.then((moduleWithComponentFactories) => {
				this.factory = moduleWithComponentFactories;
				this.form.fields.forEach(f => this.add(f));
			});
	}

	add<U>(field: Tools.Field<U>) {
		const compFactory = this.factory.componentFactories.find(x => x.componentType === field.component);
		const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
		const cmpRef = this.body.createComponent(compFactory, this.body.length, injector, []);
		if (field.IO) {
			Object.keys(field.IO).forEach(i => cmpRef.instance[i] = field.IO[i]);
		}
	}
}
