import { Component, OnChanges, Input, trigger, state, style, transition, animate, OnInit, OnDestroy, Output, EventEmitter, ViewContainerRef, Compiler, ModuleWithComponentFactories, ViewChild, ReflectiveInjector, Type } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Tools } from './ngxForm.models';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FormsConfig } from '../formsConfig';

function create<T>(type: {new (): T}) {
	return new type();
}

@Component({
	selector: 'ngx-form',
	templateUrl: 'ngxForm.component.html',
	styleUrls: ['ngxForm.component.less']
})
export class NgxFormComponent<T> implements OnChanges {

	@ViewChild('body', { read: ViewContainerRef }) body;
	factory: ModuleWithComponentFactories<any>;

	@Input() form: Tools.Form<T>;

	constructor(public config: FormsConfig, private vcRef: ViewContainerRef, private compiler: Compiler) { }


	ngOnChanges() {
		this.build();
	}

	build() {
		this.compiler.compileModuleAndAllComponentsAsync(this.config.innerModule)
			.then((moduleWithComponentFactories) => {
				this.factory = moduleWithComponentFactories;
				this.body.clear();
				this.form.fields.forEach(f => this.add(f));
			});
	}

	activator<T>(type: {new(): T}) {
		return new Type<T>();
	}

	add<U>(field: Tools.Field<U>) {
		console.log(field.component);
		console.log(this.factory.componentFactories);
		

		const compFactory = this.factory.componentFactories.find(x => x.componentType === this.activator(U));
		const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
		const cmpRef = this.body.createComponent(compFactory, this.body.length, injector, []);
		if (field.IO) {
			Object.keys(field.IO).forEach(i => cmpRef.instance[i] = field.IO[i]);
			cmpRef.instance.value = field.value;
			cmpRef.instance.valueChanged.subscribe(value => field.value = value);
		}
	}
}
