import { Component, OnChanges, Input, trigger, state, style, transition, animate, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
// import { AppState, Store, DataActions } from '../../../cdux';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Tools } from './editForm.models';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FormsConfig } from '../formsConfig';

@Component({

	selector: 'edit-form',
	templateUrl: 'editForm.component.html',
	styleUrls: ['editForm.component.less'],
	animations: [
		trigger('slideInOut', [
			state('in', style({
				opacity: '1'
			})),
			transition('void => *', [
				style({ opacity: '0', height: '0', margin: '0', padding: '0' }),
				animate('400ms ease-in', style({ opacity: '1', height: '*', margin: '*', padding: '*' }))
			]),
			transition('* => void', [
				animate('400ms ease-out', style({ opacity: '0', height: '0', margin: '0', padding: '0' }))
			])
		]),
		trigger('slideInOutChild', [
			state('in', style({
				opacity: '1'
			})),
			transition('void => *', [
				style({ position: 'relative' }),
				animate('400ms ease-in', style({ position: 'absolute' }))
			]),
			transition('* => void', [
				animate('400ms ease-out', style({ position: 'relative' }))
			])
		]),
		trigger('listSlideChild', [
			transition('void => *', [
				style({ position: 'absolute', width: '100%', 'z-index': -5, opacity: '0', height: '0', margin: '0', padding: '0' }),
				animate('400ms ease-in', style({ position: '*', opacity: '1', height: '*', margin: '*', padding: '*' }))
			]),
			transition('* => void', [
				animate('400ms ease-out', style({ position: 'absolute', opacity: '0', height: '0', margin: '0', padding: '0' }))
			])
		])
	]
})
export class EditFormComponent implements OnInit, OnDestroy, OnChanges {

	// form: What form object are we using?
	@Input() form: Tools.Form = null;
	// onCancel: We needed to call a forms cancel button from inside editForm, but we also needed to toggle the editing object in editlist, we needed chose to pass an event up. This should not be used unless inside a 'middle-man' component like editList.
	@Output() onCancel: EventEmitter<Tools.Form> = new EventEmitter<Tools.Form>();
	// onSave: We need to toggle the editing object in editList when we save so we pass this up as well
	@Output() onSave: EventEmitter<Tools.Form> = new EventEmitter<Tools.Form>();
	// lock the form down and make it view only.
	@Input() locked: boolean = false;
	// Make the form display only, like locked but doesn't use input fields.
	@Input() display: boolean = false;
	// To make this tool generic we need a way to hook into the state system. We expect a BehaviorSubject as your state object. This calls the refreshCall on subscribe.
	@Input() state: BehaviorSubject<any>;
	// newForm: We bind to this form instead of 'form' so that if we cancel we revert c hanges.
	newForm: Tools.Form;
	helpText: { [x: string]: boolean } = {};
	fieldType = Tools.FieldType;
	checkGroup = Tools.checkGroup;
	storeSubscription: Subscription;
	editing = {};
	animState: EditFormComponent = this;

	constructor(private config: FormsConfig) { }
// private store: Store, private dataActions: DataActions
	ngOnInit() {

		this.form.Fields.forEach(f => void (f.Type === Tools.FieldType.DualDate && _.isNil(f.Value) && (f.Value = new Tools.DualDates())));

		// Set newForm to form.
		this.newForm = _.cloneDeep(this.form);

		this.storeSubscription = this.state.subscribe(s => this.config.refreshCall(s, this.newForm))

		// Setup cdux.
		// this.storeSubscription = this.store.subscribe(s => this.onStoreChange(s));
	}

	// onStoreChange(s: AppState) {
	// 	this.refreshFormStuff(s);
	// }

	ngOnChanges() {
		this.form.Fields.forEach(f => void (f.Type === Tools.FieldType.DualDate && _.isNil(f.Value) && (f.Value = new Tools.DualDates())));
		this.newForm = _.cloneDeep(this.form);
		this.config.refreshCall(this.state.getValue(), this.newForm);
		// this.refreshFormStuff(this.store.getValue());
	}

	mapCodes(values: any[], mapFunc: Tools.mapFunc | Tools.NameValuePair): Tools.NameValuePair[] {
		if (mapFunc instanceof Function) {
			return (<Tools.mapFunc>mapFunc)(values);
		}
		return <Tools.NameValuePair[]>_.map(values, c => ({ Name: c.Name, Value: c.Code }));
	}

	// refreshFormStuff(s: AppState) {
	// 	// We want to get data for Options fields. We loop through each field that is an Options.
	// 	this.newForm.Fields.filter(f => f.Type === Tools.FieldType.Options || f.Type === Tools.FieldType.Checklist).forEach(f => {
	// 		// We check to see if we have Params.OptionsParams.
	// 		if (f.Params && f.Params.OptionsParams) {
	// 			// We may have already looped through here and hit getCodeTables. If so we want to take those codeTables.
	// 			if (s.lastAction.type === DataActions.prototype.getCodeTables && s.codeTables[f.Params.OptionsParams]) {
	// 				// We map the codeTable into the OptionsArray.
	// 				f.Params.OptionsArray = this.mapCodes(s.codeTables[f.Params.OptionsParams], f.Params.Map);
	// 			} else {
	// 				// We can also pass a string name of a store property, and fill the field that way.
	// 				if (_.has(s, f.Params.OptionsParams)) {
	// 					// Map can be a NameValuePair to use or a function, This is because we do not want to trust a function from the database.
	// 					if (f.Params.Map instanceof Function) {
	// 						// Return our map function.
	// 						f.Params.OptionsArray = f.Params.Map(_.get(s, f.Params.OptionsParams));
	// 					} else {
	// 						// Map our property names to a NameValuePair.
	// 						f.Params.OptionsArray = _.map(<any>_.get(s, f.Params.OptionsParams),
	// 							m => <Tools.NameValuePair>({ Name: m[f.Params.Map['Name']], Value: m[f.Params.Map['Value']] })
	// 						);
	// 					}
	// 				} else if (f.Params.OptionsParams.search('\.') === 0 && f.Params.OptionsArray === undefined && s.lastAction.type !== DataActions.prototype.getCodeTables) {
	// 					// The store doesn't have anything with this name, it must be a codeTable. Call to get it.
	// 					this.dataActions.getCodeTables(f.Params.OptionsParams);
	// 				}
	// 			}
	// 			if (f.Params.OptionsArray && f.Params.OptionsStartSelected && f.Type === Tools.FieldType.Checklist && f.Value === undefined) {
	// 				f.Value = _.map(f.Params.OptionsArray, x => x.Value + '');
	// 			}
	// 			if (f.Type === Tools.FieldType.Checklist && f.Value && f.Params.OptionsArray) {
	// 				f.Value.forEach(x => {
	// 					if (_.findIndex(f.Params.OptionsArray, o => o.Value + '' === x + '') === -1) {
	// 						f.Value = _.reject(f.Value, v => v === x);
	// 					}
	// 				});
	// 			}
	// 		}
	// 	});
	// }

	ngOnDestroy() {
		// cleanup.
		this.storeSubscription.unsubscribe();
	}

	// If this field has a 'changed' function, call it.
	callChanged(value: any, field: Tools.Field) {
		if (field.Params && field.Params.Changed) {
			let newField = _.cloneDeep(field);
			newField.Value = value;
			field.Params.Changed(this.newForm, newField);
		}
		this.newForm.Fields.filter(x => x.Type === Tools.FieldType.Static).forEach(x => {
			if (x.Params && x.Params.Changed) {
				let newField = _.cloneDeep(x);
				x.Params.Changed(this.newForm, newField);
			}
		});
	}

	listOnAdd(field: Tools.Field) {
		field.Value.push(field.Params.ListParams.OnAdd());
	}

	disableCallback(field: Tools.Field) {
		return field && field.Params && field.Params.DisabledCallback && field.Params.DisabledCallback();
	}

	calcStaticValue(field: Tools.Field) {
		switch (typeof(field.Value)) {
			case 'function': return field.Value();
			default: return field.Value;
		}
	}

	showButtons(form: Tools.Form) {
		if (form && form.Params && form.Params.ShowButtons) {
			return form.Params.ShowButtons();
		} else {
			return true;
		}
	}

	// Save the form.
	save() {
		// Set form to newForm.
		this.form = _.cloneDeep(this.newForm);
		// Call each fields optional save funtion.
		this.newForm.Fields.forEach(f => {
			if (f.Params && f.Params.Save) { f.Params.Save(f); }
		});
		// Call the forms save function.
		this.newForm.Save(this.newForm);
		// Pass up our onSave event.
		this.onSave.emit();
	}

	// cancel the form.
	cancel() {
		// Set newForm to form.
		this.newForm = _.cloneDeep(this.form);

		// Call the forms cancel function.
		this.newForm.Cancel(this.newForm);

		// Pass up our onCancel event.
		this.onCancel.emit(this.newForm);
	}

	// Call util function on the form.
	util() {
		// Call the forms util function.
		this.newForm.Util(this.newForm);
	}

	formatDate(date) {
		if (date) {
			return moment(date).format('MMM. DD, YYYY');
		} else {
			return '-';
		}
	}

	log(text: string) {
		console.log(text);
	}

	callDataCall(event, field: Tools.Field) {
		if (field.Params && field.Params.DataCall) {
			field.Params.DataCall(event);
		}
	}

	isFormInvalid() {
		return _.find(this.newForm.Fields, x => this.isFieldInvalid(x, this.newForm.Fields)) !== undefined;
	}

	isFieldInvalid(f: Tools.Field, fields: Tools.Field[]) {
		if (Tools.checkGroup(f, fields)) {
			return f.Type !== Tools.FieldType.Static && f.Required && (_.isNil(f.Value) || (typeof (f.Value) === 'string' && f.Value.length <= 0) || (Array.isArray(f.Value) && f.Value.length === 0));
		} else {
			return false;
		}
	}

	// Format values of our checklist field
	optionChecked(field: Tools.Field, value: any) {
		value = value += '';
		if (field.Value !== null && _.findIndex(field.Value, x => x + '' === value) >= 0) {
			field.Value = _.filter(field.Value, x => x + '' !== value);
		} else {
			if (field.Value === null || field.Value === undefined) {
				field.Value = [value];
			} else {
				field.Value.push(value);
			}
		}
		if (field.Params && field.Params.Changed) {
			field.Params.Changed(this.newForm, field);
		}
	}

	forceSave() {
		if (!this.isFormInvalid()) {
			this.save();
		} else {
			this.cancel();
		}
	}

	getId(field: Tools.Field) {
		if (this.newForm && this.newForm.Params && this.newForm.Params.FormName) {
			return this.newForm.Params.FormName + field.Id;
		} else {
			return field.Id;
		}
	}
}
