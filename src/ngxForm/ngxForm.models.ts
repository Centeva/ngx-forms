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

	export type FieldParams = {}

	export class Field<T> {

		public id: number;
		public fieldName: string;
		public displayName: keyof T;
		public params?: Tools.FieldParams;
		public value: T[keyof T];
		public component: Component;
		public IO: keyof Component;

		constructor(id: number, fieldName: string, displayName: keyof T, component: Component, IO?: keyof Component, params?: Tools.FieldParams) {
			this.id = id;
			this.fieldName = fieldName;
			this.displayName = displayName;
			this.params = params;
			this.component = component;
			this.IO = IO;
			let pair = { Name: '', Value: Array<string>() }
		}

		paramsType(field: any) {
			let props = Reflect.getMetadataKeys(field.component);
			console.log(props);
			return typeof props;
		}
	}

	type mapObj = { [key: string]: string };

	export function mapFormToModel<T>(form: Tools.Form<T>): T {
		let val = {};
		let mapObj: mapObj = {};

		for (let field of form.fields) {
			if (this.checkGroup(field, form.fields)) {
				val = _.set(val, field.fieldName, field.value);
			}
		}

		val['id'] = form.id;

		return val as T;
	};

	interface modelBase {
		Id: number;
		new (): this;
	}

	export type keyOf<T> = {
		[P in keyof T]: P;
	};

	export function enumerate<T>(type: { new (): T; }) {
		let obj = new type();
		return obj;
	}

	export interface FormConstructor<T extends modelBase> {
		params?: Tools.FormParams;
		cancel?(form: Tools.Form<T>): void;
	}

	export abstract class FormConstructor<T extends modelBase> {

		public map = enumerate<T>(this.model);
		private _form: Tools.Form<T>;
		private _editing: boolean = false;
		private _model: T;

		abstract ids;

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
			this._form = new Tools.Form<T>(
				data.Id || 0,
				this.params,
				...this.initFields(data));
		}

		private baseSave<T>(form: Tools.Form<T>) {
			let converted = Tools.mapFormToModel<T>(form);
			this.save(converted);
			this.isEditing = false;
		}

		abstract save(converted);

		abstract initFields<T>(data?: T): Tools.Field<T>[];

		private baseCancel(form: Tools.Form<T>) {
			if (this.cancel) {
				this.cancel(form);
			}

			this.isEditing = false;
		}

	}
}
