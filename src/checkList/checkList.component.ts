import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, Host, ElementRef, OnChanges } from '@angular/core';
// import { Store, AppState } from '../../../cdux';
import { Subscription } from 'rxjs';
import { Tools } from '../editForm';
import * as _ from 'lodash';

@Component({

	selector: 'check-list',
	templateUrl: 'checkList.component.html',
	styleUrls: ['checkList.component.less'],
	host: {
		'(document:click)': 'clickOutOfDropdown($event)',
	}
})
export class CheckListComponent implements OnInit, OnDestroy, OnChanges {
	@Input() options: Tools.NameValuePair[] = [];
	@Input() values: any[] = [];
	@Output() valuesChange: EventEmitter<Tools.NameValuePair[]> = new EventEmitter<Tools.NameValuePair[]>();
	@Output() onChecked: EventEmitter<any> = new EventEmitter<any>();
	@Input() required: boolean = false;
	@Input() disabled: boolean = false;
	toggled: boolean = false;
	constructor(private elementRef: ElementRef) { }

	get inputValues () {
		return this.values;
	}

	set inputValues(val) {
		this.values = val;
		this.valuesChange.emit(val);
	}

	ngOnInit() {
	}

	ngOnDestroy() {
	}

	ngOnChanges() {
		// let mapped = _.map(this.options, x => x.Value);
		// let difference = _.difference(this.values, mapped);
		// this.values = _.reject(this.values, v => _.some(difference, d => d === v));
	}

	onChanged(value: any) {
		this.onChecked.emit(value);
	}

	@Input() isChecked = function (id: string | number, values) {
		return _.findIndex(this.inputValues, c => c + '' === id + '') >= 0;
	}

	getSelected() {
		return this.inputValues ? this.inputValues.filter(v => !!v).length + " Selected" : "0 Selected";
	}

	isInvalid() {
		return this.required && this.inputValues && this.options && this.inputValues.length === 0 && this.options.length > 0;
	}

	clickOutOfDropdown(event) {
		if (this.toggled && !this.elementRef.nativeElement.contains(event.target)) {
			this.toggled = false;
		}
	}
}
