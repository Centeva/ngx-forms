// /* tslint:disable:no-unused-variable */

// import { By } from '@angular/platform-browser';
// import { DebugElement, EventEmitter } from '@angular/core';
// import { Store, AppState, Action, DataActions, MiscActions, dataReducer, miscReducer } from '../../../cdux';
// import { async, inject } from '@angular/core/testing';
// import { Tools } from '../editForm/';
// import { EditItemType, EditItemRow } from '../editItem/';
// import { EditFormComponent } from './editForm.component';

// import { ScheduleItemProcedureSample } from '../../../models/generated';
// import { CodeType } from '../../../models';

// /* end of imports */

// describe('tools/editForm.component', () => {
// 	let store: Store;
// 	let state: AppState = new AppState();
// 	let dataActions: DataActions;
// 	let component: EditFormComponent;

// 	beforeEach(() => {
// 		store = new Store(state, dataReducer, miscReducer);
// 		dataActions = jasmine.createSpyObj('dataActions', ['getCodeTables']);
// 		component = new EditFormComponent(store, dataActions);
// 	});

// 	it('EditFormComponent', () => {
// 		expect(component).toBeTruthy();
// 	});

// 	it('should get Options codetables', () => {
// 		component.newForm = new Tools.Form(9001, () => {}, () => {}, undefined, undefined, undefined,
// 			new Tools.Field(10, 'InitField-0', Tools.FieldType.Options, undefined, undefined, undefined, undefined,
// 				new Tools.FieldParams('bestCodeTable')
// 			)
// 		);

// 		component.onStoreChange(state);
// 		expect(dataActions.getCodeTables).toHaveBeenCalledWith('bestCodeTable');

// 		state.lastAction = <Action>{type: DataActions.prototype.getCodeTables, payload: []};
// 		state.codeTables['bestCodeTable'] = <CodeType[]>[{Name: 'One', Code: '1'}, {Name: 'Two', Code: '2'}];
// 		component.onStoreChange(state);
// 		expect(component.newForm.Fields.some(f => f.Params.OptionsArray.some(x => x.Name === 'One')));
// 	});

// 	it('should get Options store property', () => {
// 		state.samples = [new ScheduleItemProcedureSample({Description: 'TestSample-1', Id: 1200})];

// 		component.newForm = new Tools.Form(9001, () => {}, () => {}, undefined, undefined, undefined,
// 			new Tools.Field(10, 'InitField-0', Tools.FieldType.Options, undefined, undefined, undefined, undefined,
// 				new Tools.FieldParams('samples', undefined, x => _.map(<{ Description: string, Id: number }[]>x, s => <Tools.NameValuePair>{ Name: s.Description, Value: s.Id }), )
// 			)
// 		);

// 		component.onStoreChange(state);
// 		expect(component.newForm.Fields.some(f => f.Params.OptionsArray.some(x => x.Name === 'TestSample-1'))).toBeTruthy();

// 	});

// 	it('should call changed if the field has it.', () => {
// 		let changedSpy = jasmine.createSpy('changed');
// 		component.newForm = new Tools.Form(9001, () => {}, () => {}, undefined, undefined, undefined,
// 			new Tools.Field(10, 'InitField-0', Tools.FieldType.Options, undefined, undefined, undefined, undefined,
// 				new Tools.FieldParams('samples', undefined, undefined, undefined, changedSpy)
// 			)
// 		);

// 		component.callChanged(100, component.newForm.Fields[0]);
// 		expect(changedSpy).toHaveBeenCalled();
// 	});

// 	it('should save', () => {
// 		let saveFormSpy = jasmine.createSpy('saveForm');
// 		let saveSpy = jasmine.createSpy('saved');
// 		let onSaveSpy = jasmine.createSpyObj('onSave', ['emit']);

// 		component.newForm = new Tools.Form(9001, saveFormSpy, () => {}, undefined, undefined, undefined,
// 			new Tools.Field(10, 'InitField-0', Tools.FieldType.Options, undefined, undefined, undefined, undefined,
// 				new Tools.FieldParams(undefined, undefined, undefined, undefined, undefined, saveSpy)
// 			),
// 			new Tools.Field(20, 'InitField-0', Tools.FieldType.Options, undefined, undefined, undefined, undefined)
// 		);
// 		component.onSave = onSaveSpy;

// 		component.save();

// 		expect(saveFormSpy).toHaveBeenCalled();
// 		expect(saveSpy).toHaveBeenCalled();
// 		expect(onSaveSpy.emit).toHaveBeenCalled();

// 	});

// 	it('should cancel', () => {
// 		let cancelFormSpy = jasmine.createSpy('cancelForm');
// 		let onCancelSpy = jasmine.createSpyObj('onCancel', ['emit']);

// 		component.form = new Tools.Form(9001, () => {}, cancelFormSpy, undefined, undefined, undefined,
// 			new Tools.Field(20, 'InitField-0', Tools.FieldType.Options, undefined, undefined, undefined, undefined)
// 		);
// 		component.newForm = new Tools.Form(9001, () => {}, cancelFormSpy, undefined, undefined, undefined,
// 			new Tools.Field(20, 'InitField-0', Tools.FieldType.Options, undefined, undefined, undefined, undefined)
// 		);
// 		component.onCancel = onCancelSpy;

// 		component.cancel();

// 		expect(cancelFormSpy).toHaveBeenCalled();
// 		expect(onCancelSpy.emit).toHaveBeenCalled();

// 	});

// 	it('should call util', () => {
// 		let utilSpy = jasmine.createSpy('Util');
// 		component.newForm = new Tools.Form(9001, () => {}, () => {}, utilSpy, undefined, undefined,
// 			new Tools.Field(20, 'InitField-0', Tools.FieldType.Options, undefined, undefined, undefined, undefined)
// 		);

// 		component.util();
// 		expect(utilSpy).toHaveBeenCalledWith(component.newForm);

// 	});

// 	it('should check if form is invalid', () => {
// 		let utilSpy = jasmine.createSpy('Util');
// 		component.newForm = new Tools.Form(9001, () => {}, () => {}, utilSpy, undefined, undefined,
// 			new Tools.Field(20, 'InitField-0', Tools.FieldType.Options, undefined, undefined, true, undefined)
// 		);

// 		let result = component.isFormInvalid();
// 		expect(result).toBeTruthy();

// 		component.newForm = new Tools.Form(9001, () => {}, () => {}, utilSpy, undefined, undefined,
// 			new Tools.Field(20, 'InitField-0', Tools.FieldType.Options, 100, undefined, true, undefined)
// 		);

// 		result = component.isFormInvalid();
// 		expect(result).toBeFalsy();
// 	});

// 	it('should check if field is invalid', () => {
// 		let testField = new Tools.Field(0, 'TestField-1', Tools.FieldType.Numeric, null, undefined, true);
// 		expect(component.isFieldInvalid(testField, [testField])).toBeTruthy();
// 		testField.Required = false;
// 		expect(component.isFieldInvalid(testField, [testField])).toBeFalsy();
// 	});

// 	// What is this even doing?
// 	it('should format value for checklist', () => {
// 		let testField = new Tools.Field(1, 'InitField-0', Tools.FieldType.Checklist, undefined);
// 		component.optionChecked(testField, 1);
// 		expect(testField.Value[0]).toEqual('1');
// 		expect(testField.Value.length).toEqual(1);
// 		component.optionChecked(testField, '2');
// 		expect(testField.Value[1]).toEqual('2');
// 		expect(testField.Value.length).toEqual(2);
// 		component.optionChecked(testField, '1');
// 		component.optionChecked(testField, '2');
// 		expect(testField.Value.length).toEqual(0);
// 	});

// 	it('should try to save, or will cancel', () => {
// 		let val = false;
// 		component.isFormInvalid = (() => val).bind(this);
// 		component.save = jasmine.createSpy('save');
// 		component.cancel = jasmine.createSpy('cancel');

// 		component.forceSave();
// 		expect(component.save).toHaveBeenCalled();

// 		val = true;
// 		component.forceSave();
// 		expect(component.cancel).toHaveBeenCalled();
// 	});
// });
