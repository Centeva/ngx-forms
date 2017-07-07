import * as _ from 'lodash';
import { Component } from "@angular/core";

export namespace Tools {

	interface fieldTypes { }

	export type NameValuePair<T> = { Name: string | number; Value: T; };

	export type fieldDecoratorConfig = {
		type: string;
	};
	export function field(config: Tools.fieldDecoratorConfig) {
	}

	export type FormParams = {

	}

	export class Form<T> {
		public id: number;
		public params?: Tools.FormParams;
		public fields: Tools.Field<T>[];

		constructor(id: number, params?: Tools.FormParams, ...fields: Tools.Field<T>[]) {
			this.id = id;
			this.params = params;
			this.fields = fields;
		}
	}

	export class Field<T, U extends Component = any> {

		public id: number;
		public fieldName: keyof T;
		public value: T[keyof T];
		public component: U;
		public IO: Partial<U>;

		constructor(id: number, fieldName: keyof T, IO?: Partial<U>) {
			this.id = id;
			this.fieldName = fieldName;
			this.IO = IO;
			let pair = { Name: '', Value: Array<string>() }
		}

		paramsType(field: any) {
			let props = Reflect.getMetadataKeys(field.component);
			return typeof props;
		}
	}

	type mapObj = { [key: string]: string };

	export function mapFormToModel<T>(form: Tools.Form<T>): T {
		let val = {};
		let mapObj: mapObj = {};

		for (let field of form.fields) {
			val = _.set(val, field.fieldName, field.value);
		}

		val['id'] = form.id;

		return val as T;
	};

	interface modelBase {
		Id: number;
	}

	export type keyOf<T> = {
		[P in keyof T]: P;
	};

	// export function enumerate<T>(type: { new (): T; }) {
	// 	let obj = new type();
	// 	return obj;
	// }

	export interface FormConstructor<T extends modelBase> {
		params?: Tools.FormParams;
		onCancel?(form: Tools.Form<T>): void;
	}

	export abstract class FormConstructor<T extends modelBase> {

		// public map = enumerate<T>(this.model);
		private _form: Tools.Form<T>;
		private _editing: boolean = false;
		private _model: T;

		abstract ids<U>(): U;

		get form(): Tools.Form<T> {
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

		constructor(id: number, model: T, params?: Tools.FormParams) {
			this.params = params;
			this.model = model;
			if (id === 0) {
				this.isEditing = true;
			}
		}

		public setForm(data?: T) {
			console.log('setForm!');
			data = data ? data : <T>{};
			this._form = new Tools.Form<T>(
				data.Id || 0,
				this.params,
				...this.baseInitFields(data));
		}

		public save() {
			let converted = Tools.mapFormToModel<T>(this.form);
			this.onSave(converted);
			this.isEditing = false;
		}

		protected abstract onSave(converted);

		private baseInitFields(data: T) {
			let fields = this.initFields();
			fields.forEach(f => f.value = data[<string>f.fieldName]);
			return fields;
		}

		abstract initFields<T>(data?: T): Tools.Field<T, any>[];

		public cancel() {
			if (this.onCancel) {
				this.onCancel(this.form);
			}

			this.isEditing = false;
		}

	}
}
