import { Component, Input, OnInit, OnDestroy, EventEmitter, Output, OnChanges, trigger, style, transition, animate, ViewChildren } from '@angular/core';
// import { Store, AppState, DataActions, MiscActions } from '../../../cdux';
import { Subscription, BehaviorSubject } from 'rxjs';
// import { SearchModel } from '../../../pipe';
import * as moment from 'moment';
import { Tools, EditFormComponent } from '../editForm';
declare var $: any;
import * as _ from 'lodash';
import { SearchModel } from '../search.pipe';
import { FormsConfig } from '../formsConfig';

@Component({

	selector: 'edit-list',
	templateUrl: 'editList.component.html',
	styleUrls: ['editList.component.less'],
	animations: [
		trigger('slideInOut', [
			transition('void => *', [
				style({ height: 0, zindex: -100, margin: '0', padding: '0' }),
				animate('400ms ease-in', style({ height: '*', zindex: 0, margin: '*', padding: '*' }))
			]),
			transition('* => void', [
				animate('400ms ease-out', style({height: 0, margin: '0', padding: '0' }))
			])
		])
	]
})
export class EditListComponent implements OnInit, OnDestroy, OnChanges {

	// forms: Array of forms to show. *These forms do not have to have the same structure technically, but should idealy.
	@Input() forms: Tools.Form[] = [];
	// lock the forms down and make them view only.
	@Input() locked: boolean = false;
	@Input() emptyMessage: string;
	@Input() addText: string;
	@Input() addId: string;
	// toggle the add new item button.
	@Input() displayAdd: boolean = true;
	// editing: Editing object.
	editing: { [x: number]: boolean } = {};
	// onAdd: We pass up an event when we click the add item button.
	@Output() onAdd: EventEmitter<void> = new EventEmitter<void>();
	// Pass up and event when we click to edit a form.
	@Output() onEdit: EventEmitter<Tools.Form> = new EventEmitter<Tools.Form>();
	// Optionally specify the max height of the list. If it exceeds it will begin to scroll.
	@Input() listHeight: string;
	// To make this tool generic we need a way to hook into the state system. We expect a BehaviorSubject as your state object. This calls the refreshCall on subscribe.
	@Input() state: BehaviorSubject<any>;

	// When we are showing data inline we need a header.
	headers: string[] = this.calcHeaders();
	// We use this object to only show fields that have a coresponding header.
	searchObject: SearchModel = new SearchModel(['Name'], this.headers);
	// Sub.
	storeSubscription: Subscription;
	lastCodeTables: string[] = [];
	checkGroup = Tools.checkGroup;
	// List of editForm components to force save if needed.
	@ViewChildren(EditFormComponent) editForms: any;

	fieldType = Tools.FieldType;

	constructor(private config: FormsConfig) { };
// private store: Store, private dataActions: DataActions, private miscActions: MiscActions
	ngOnInit() {
		// this.storeSubscription = this.store.subscribe(s => this.onStoreChange(s));
		// this.miscActions.poke();
		this.storeSubscription = this.state.subscribe(s => this.config.refreshCall(s, ...this.forms))

	};

	ngOnDestroy() {
		this.storeSubscription.unsubscribe();
	};

	ngOnChanges(changes) {
		// If we make any changes we need to make sure our header/searchObject is current.
		this.headers = this.calcHeaders();
		this.searchObject = new SearchModel(['Name'], this.headers);

		this.config.refreshCall(this.state.getValue(), ...this.forms);

		// Call to get the codeTables.
		// this.dataActions.getCodeTables(...this.lastCodeTables);

		// this.refreshFormStuff(this.store.getValue());
	}

	// onStoreChange(s: AppState) {
	// 	this.refreshFormStuff(s);
	// };

	// refreshFormStuff(s: AppState) {
	// 	// We want to get codeTables in edit list so we can display them right.
	// 	let codeTables: string[] = [];

	// 	// We loop through each field in each form that is an Option.
	// 	this.forms.forEach(form => form.Fields.filter(f => f.Type === Tools.FieldType.Options).forEach(f => {

	// 		// Make sure we have Params.
	// 		if (f.Params && f.Params.OptionsParams) {
	// 			// We need to map data if we have it.
	// 			if (s.lastAction.type === DataActions.prototype.getCodeTables && s.codeTables[f.Params.OptionsParams]) {
	// 				// We map the codeTable into the OptionsArray.
	// 				f.Params.OptionsArray = <Tools.NameValuePair[]>_.map(s.codeTables[f.Params.OptionsParams], c => ({ Name: c.Name, Value: c.Code }));
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
	// 							m => <Tools.NameValuePair>({Name: m[f.Params.Map['Name']], Value: m[f.Params.Map['Value']]})
	// 						);
	// 					}
	// 				}
	// 			}

	// 			// We want to know if this field wants a codeTable.
	// 			// We check that it has params/optionsParams, and check if optionsParams is in the store. (If not we probably want a codeTable.)
	// 			if (!s.hasOwnProperty(f.Params.OptionsParams)) {
	// 				// Push the name of the codeTable we want into our array.
	// 				codeTables.push(f.Params.OptionsParams);
	// 			}
	// 		}
	// 	}));

	// 	// We keep track of the last codeTable array we used.
	// 	// If this one is different from that one then we want to get data again.
	// 	if (!_.isEqual(_.uniq(codeTables), this.lastCodeTables)) {
	// 		// Set our lastCodeTables.
	// 		this.lastCodeTables = _.uniq(codeTables);
	// 		// Call to get the codeTables.
	// 		this.dataActions.getCodeTables(...this.lastCodeTables);
	// 	}
	// }

	calcHeaders() {
		// We loop through each Field in each Form and grab the Name of every Field that has Display of true.
		return <string[]>_.union(..._.map(this.forms, x => _.map(_.filter(x.Fields, y => y.Display), 'Name')));
	}

	addItem() {
		this.editing = {};
		this.onAdd.emit();
		// We should be editing when we add a new item. New items should have an Id of 0.
		this.editing[0] = true;
	}

	disableAdd() {
		// We should not be able to add more than one Item at a time, the user should save before they add more.
		return _.some(this.forms, f => f.Id === 0);
	}

	edit(form: Tools.Form) {
		// Call cancel functions on new forms.
		this.forms.filter(x => x.Id === 0).forEach(x => x.Cancel(x));
		// We should only edit one item at a time so clear editing. Then edit the current form.
		this.editing = {};
		this.editing[form.Id] = true;
		this.onEdit.emit(form);
	}

	// We split each field evenly when we display it.
	calcHeaderWidth() {
		return `${100 / this.headers.length}%`;
	};

	calcFieldWidth() {
		return `${100 / this.headers.length}%`;
	};

	cancelItem() {
		this.editing = {};
	}

	saveItem() {
		this.editing = {};
		this.headers = this.calcHeaders();
	}

	// Get value to display when not editing options fields
	getValue(field: Tools.Field) {
		if (field.Type === Tools.FieldType.Options) {
			if (field.Params && field.Params.OptionsArray) {
				let foundField = _.find(field.Params.OptionsArray, o => o.Value === field.Value);
				return foundField ? foundField.Name : field.Value;
			}
		} else if (field.Type === Tools.FieldType.Checklist) {
			return field.Value ? field.Value.length : null;
		} else if (field.Type === Tools.FieldType.Date) {
			return field.Value ? moment(field.Value).format('MMM. DD, YYYY') : field.Value;
		}
		return field.Value;
	}

	forceSave() {
		_.forEach(this.editForms._results, (ef:EditFormComponent) => {
			if (this.editing[ef.newForm.Id]){ ef.forceSave(); }
		});
	}

	// If this field has a 'changed' function, call it.
	callChanged(event: any, form: Tools.Form, field: Tools.Field) {
		event.stopPropagation();
		if (field.Params && field.Params.Changed) {
			field.Params.Changed(form, field);
		}
	}

	getHeight(){
		return this.listHeight ? this.listHeight : '100%';
	}
}
