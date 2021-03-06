import * as moment from 'moment';
import * as _ from 'lodash';

export namespace Tools {
	// FieldType: The type of fields we can show. This acts like a string enum. It HAS to be one of the values shown.
	// !IMPORTANT: Only add new items to the bottom! It will break findings if you don't.
	export enum FieldType {
		Header,
		Static,
		Text,
		Email,
		TextArea,
		Date,
		Options,
		Checklist,
		Checkbox,
		Button,
		List,
		Slider,
		Link,
		RichText,
		DualDate,
		Numeric,
		Component
	}

	// A type used for passing data into dropdowns.
	export interface NameValuePair { Name: string | number; Value: any; };

	export type mapFunc = (value: any) => NameValuePair[];

	export type WidthTypes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

	export class DualDates {
		From: moment.Moment;
		To: moment.Moment;

		constructor(from?: moment.Moment, to?: moment.Moment) {
			this.From = from;
			this.To = to;
		}
	};

	// FormParams: Extra paramaters that can be passed into a form.
	export type FormParams = {
		Style?: string,
		Icon?: string,
		ShowButtons?: Function,
		FormName?: string
	};

	// FieldParams: Extra paramaters that can be passed into a field.
	export class FieldParams {
		// OptionsParams: Used for dropdowns, We can populate dropdowns multiple ways.
		// 1- string name of a codeTable. We will fetch the code table and fill the dropdown with the result.
		// 2- string name of a store object. We will grab that object from the store and use the *Map* param to turn it into an array of NameValuePairs.
		// The end result of each of these is to populate the OptionsArray, That is what we really care about.
		OptionsParams?: string;
		// OptionsArray: An array of NameValuePairs. This can be assigned manually, or automatically by passing a string into OptionsParams.
		OptionsArray?: NameValuePair[];
		// Map: Used to map a store object into a NameValuePair array.
		// 1- A function used to map a store object into a NameValuePair array.
		// 2- A NameValuePair of the name and value we want to map from.
		Map?: mapFunc | NameValuePair;
		// Style: String name of a css class to apply to the field. NOT IMPLEMENTED (Its on buttons).
		Style?: string;
		// Changed: A callback function for when a dropdown changes or when a button is clicked. Needs to be added to other fieldTypes.
		Changed?: (form: Form, field: Field) => void;
		// Save: A funtion to save this field. Will be called before the forms save function. This is not the main way to save a form. Use the save function on a form.
		Save?: (field: Field) => void;

		// GroupBy: Sometimes we don't want to show a field unless another field has a certain condition.
		// We also want to sometimes do And/Or operations to groups.
		// You can pass in an array of NameValuePair arrays to do this.
		// Vertical is "And" and Horizontal is "Or".
		// And: [[{Name: 1, Value: 0}, {Name: 2, Value: 1}]]. This means that this field will only show if another field with id of 1's value is 0 AND another field with id of 2's value is 1.
		// Or: [[{Name: 1, Value: 0}], [{Name: 2, Value: 1}]]. This means that this field will only shof if another field with id of 1's value is 0 OR another field with id of 2's value is 1.
		// The difference is the nesting of the arrays.
		// These can also be mixed and matched. [[{Name: 1, Value: 0}, {Name: 2, Value: 0}], [{Name: 1, Value: 2}]].
		GroupBy?: [NameValuePair[]];

		// Flag if you want options selected by default.
		// We use this for Checklist to select all items when you start.
		OptionsStartSelected?: boolean;

		// css name of Icons to apply to the displayed field.
		Icon?: string;

		// Specify if you want to override the column width.
		Width?: WidthTypes;

		// Enable/disable the field.
		Disabled?: boolean;

		// Same as displayed but as a Function.
		DisabledCallback?: Function;

		//Parameters when using an edit list
		ListParams?: ListParams;

		// An optional param that can be used to specify the property this field maps back to. Our MapFormToModel function looks at this first when trying to map a field.
		MapName?: string;

		// We need to make a data call when we search in docketSearch.
		DataCall?: Function;

		// Alt text for buttons.
		AltText?: string;

		constructor(OptionsParams?: string, OptionsArray?: NameValuePair[], Map?: mapFunc | NameValuePair, Style?: string, Changed?: (form: Form, field: Field) => void, Save?: (field: Field) => void, GroupBy?: [NameValuePair[]], OptionsStartSelected = false, Icon?: string, Width?: WidthTypes, Disabled?: boolean, DisabledCallback?: Function, ListParams?: ListParams, MapName?: string, DataCall?: Function, AltText?: string) {
			this.OptionsParams = OptionsParams;
			this.OptionsArray = OptionsArray;
			this.Map = Map;
			this.Style = Style;
			this.Changed = Changed;
			this.Save = Save;
			this.GroupBy = GroupBy;
			this.OptionsStartSelected = OptionsStartSelected;
			this.Icon = Icon;
			this.Width = Width;
			this.Disabled = Disabled;
			this.DisabledCallback = DisabledCallback;
			this.ListParams = ListParams;
			this.MapName = MapName;
			this.DataCall = DataCall;
			this.AltText = AltText;
		}
	};

	// All of the parameters passed into an edit list
	export class ListParams {
		// A call back for when Add is called in a List.
		OnAdd?: Function;

		// String for when a List is empty.
		EmptyMessage?: string;

		// Text displayed for add button
		AddText?: string;
	}

	export class Field {
		Id: number;
		// Name: The label that will be displayed. Used for header names.
		Name: string;
		// Type: What type of field is this? TextArea, Options, etc.
		Type: FieldType;
		// HelpText: Optional help text that can be displayed.
		HelpText: string;
		// Required: Is this field required to save?
		Required: Boolean;
		// Display: Will this field be displayed when were not editing it? I.e. Will it have a header?
		Display: Boolean;
		// FieldParams: Additional params that can be passed to a field.
		Params: FieldParams;
		// Value: The actual value of the field.
		Value: any;
		//Do we want to hide this element in our form? Useful if you want to show it in the header only
		HideInForm?: boolean;

		constructor(Id: number, Name: string, Type: FieldType, Value: any = undefined, HelpText = '', Required = false, Display = false, Params: FieldParams = undefined, HideInForm = false) {
			this.Id = Id;
			this.Name = Name;
			this.Type = Type;
			this.HelpText = HelpText;
			this.Required = Required;
			this.Display = Display;
			this.Params = Params;
			this.Value = Value;
			this.HideInForm = HideInForm;
		}
	};

	// Form: The main object for the editForm. We will pass one of these to an editForm, Or an array of them into editList.
	export class Form {
		Id: number;
		// Fields: An array of fields that the form will have. What inputs does this form need?
		Fields: Field[];
		// Params: Extra paramaters. NEED IMPLEMENTATION.
		Params: FormParams;
		// Save: A function used to save the form. *make sure to ().bind(this) if you use 'this' in your function!
		Save: (form: Form) => void;
		// Cancel: A function used to cancel a form. *make sure to ().bind(this) if you use 'this' in your function!
		Cancel: (form: Form) => void;
		// Util: A function called when the utility button at the bottom of the form is clicked. If no function is passed in the button will not be shown
		// *make sure to ().bind(this) if you use 'this' in your function!
		Util: (form: Form) => void;
		// Text displayed for the util button. If no text is supplied it will default to 'Delete'
		UtilText: string;

		constructor(Id: number, Save: (form: Form) => void, Cancel: (form: Form) => void, Util?: (form: Form) => void, UtilText = 'Delete', Params?: FormParams, ...fields: Field[]) {
			this.Id = Id;
			this.Save = Save;
			this.Cancel = Cancel;
			this.Util = Util;
			this.UtilText = UtilText;
			this.Params = Params;
			this.Fields = fields;
		}
	};

	export function checkGroup(field: Field, fields: Field[]): boolean {
		let result = true;
		if (field.Params && field.Params.GroupBy) {

			result = _.some(field.Params.GroupBy, gby => _.every(gby, g => _.some(fields, f => {
				if (g.Name === f.Name && this.checkGroup(f, fields)) {
					if (g.Value !== null && g.Value !== undefined) {
						if (g.Value + '' === f.Value + '') {
							return true;
						}
					} else {
						return true;
					}
				}
				return false;
			})));
		}
		return result;
	};

	// {CodeTableName: 'CodeTableCode'}
	export type mapObj = { [key: string]: string };

	export function mapFormToModel<T>(form: Form, mapObj: mapObj = {}, ...ignore: string[]): T {
		let val = {};
		form.Fields.forEach(f => {
			if (f.Params && f.Params.MapName) {
				mapObj[f.Name] = f.Params.MapName;
			}
		});

		for (let field of form.Fields) {
			if (!ignore.some(i => i === field.Name)) {
				if (this.checkGroup(field, form.Fields)) {
					if (mapObj && mapObj.hasOwnProperty(field.Name)) {
						val = _.set(val, mapObj[field.Name], field.Value);
					} else {
						val = _.set(val, field.Name.replace(/\s/g, ''), field.Value);
					}
				}
			}
		}

		val['Id'] = form.Id;

		return val as T;
	};

	interface modelBase {
		Id: number;
	}

	export type keyOf<T> = {
		[P in keyof T]: P;
	};

	export interface FormConstructor<T extends modelBase> {
		utilText?: string;
		params?: Tools.FormParams;
		util?(form: Tools.Form): void;
		cancel?(form: Tools.Form): void;
	}

	export abstract class FormConstructor<T extends modelBase> {
		public Map: keyOf<T> = <keyOf<T>>{};
		private _form: Tools.Form;
		private _editing: boolean = false;
		private _model: T;

		get form(): Tools.Form {
			return this._form;
		}

		get isEditing(): boolean {
			return this._editing;
		}

		set isEditing(value: boolean) {
			this._editing = value;
		}

		set model(value: T) {
			this._model = value;
			this.setForm(this._model);
		}

		get model(): T {
			return this._model;
		}

		constructor(id: number, model?: T, params?: Tools.FormParams) {
			this.params = params;
			this.setForm();
			this.model = model;
			if (id === 0) {
				this.isEditing = true;
			}
		}

		public setForm(data?: T) {
			data = data ? data : <T>{};
			this._form = new Tools.Form(
				data.Id || 0,
				this.baseSave.bind(this),
				this.baseCancel.bind(this),
				this.baseUtil.bind(this),
				this.utilText,
				this.params,
				...this.initFields(data));
		}

		private baseSave<T>(form: Tools.Form) {
			let converted = Tools.mapFormToModel<T>(form);
			this.save(converted);
			this.isEditing = false;
		}

		abstract save(converted);

		private baseCancel(form: Tools.Form) {
			if (this.cancel) {
				this.cancel(form);
			}

			this.isEditing = false;
		}

		private baseUtil(form: Tools.Form) {
			if (this.util) {
				this.util(form);
			}
		}

		abstract initFields<T>(data?: T): Tools.Field[];

		// Options
		newOptions<U extends keyof T & string>(id: number, displayName: string, fieldName: U, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, options>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, options>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.Options, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// Header
		newHeader<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, coreParams>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, coreParams>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.Header, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// Static
		newStatic<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, staticField>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, staticField>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.Static, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// Text
		newText<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, coreParams>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, coreParams>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.Text, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// Email
		newEmail<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, coreParams>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, coreParams>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.TextArea, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// TextArea
		newTextarea<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, coreParams>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, coreParams>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.TextArea, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// Date
		newDate<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, date>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, date>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.Date, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}


		// Checklist
		newChecklist<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, checklist>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, checklist>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.Checklist, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// Button
		newButton<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, button>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, button>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.Button, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// List
		newEditList<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, list>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, list>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.List, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// Checkbox
		newCheckbox<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, checkbox>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, checkbox>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.Checkbox, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}
		// Slider
		newSlider<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, coreParams>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, coreParams>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.Slider, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// Link
		newLink<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, coreParams>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, coreParams>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.Link, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// // DocketSearch
		// newDocketSearch<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, docketSearch>> = { value: undefined }) {
		// 	let params: Partial<Pick<Tools.FieldParams, docketSearch>> = { ...optional } as Tools.FieldParams;
		// 	return new Tools.Field(id, displayName, Tools.FieldType.DocketSearch, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		// }

		// RichText
		newRichText<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, coreParams>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, coreParams>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.RichText, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// DualDate
		newDualDate<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, coreParams>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, coreParams>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.DualDate, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}

		// Numeric
		newNumeric<U extends keyof T & string>(id: number, displayName: string, fieldName: string, optional: coreOptional<T, U> & Partial<Pick<Tools.FieldParams, coreParams>> = { value: undefined }) {
			let params: Partial<Pick<Tools.FieldParams, coreParams>> = { ...optional } as Tools.FieldParams;
			return new Tools.Field(id, displayName, Tools.FieldType.Numeric, optional.value, optional.helpText, optional.required, optional.display, { ...params, MapName: fieldName }, optional.hideInForm);
		}
	}

	type coreOptional<T, U extends keyof T> = { display?: boolean, required?: boolean, value?: T[U], helpText?: string, hideInForm?: boolean };

	type coreParams = 'Style' | 'Save' | 'Width' | 'GroupBy';
	type button = coreParams | 'Disabled' | 'DisabledCallback' | 'Changed' | 'Icon' | 'DisabledCallback' | 'AltText';
	type options = coreParams | 'Disabled' | 'DisabledCallback' | 'Changed' | 'Map' | 'OptionsParams' | 'OptionsArray';
	type docketSearch = coreParams | 'Changed' | 'DataCall';
	type checklist = options | 'OptionsStartSelected';
	type list = coreParams | 'ListParams' | 'Changed';
	type checkbox = coreParams | 'Changed';
	type date = coreParams | 'Changed';
	type staticField = coreParams | 'Changed';

}
