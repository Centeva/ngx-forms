import { Component, Input, ViewContainerRef, ViewChild, AfterViewInit, SimpleChange, OnChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as quill from 'quill';
import * as _ from 'lodash';
@Component({
	selector: 'quill',
	templateUrl: 'quill.component.html',
	styleUrls: ['quill.component.less'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => QuillComponent),
			multi: true
		}
	],
})
export class QuillComponent implements ControlValueAccessor, AfterViewInit {

	@Input() _quillValue: any = null;
	@Input() readOnly: boolean = false;
	@Input() placeholder: string = '';
	@Input() modules: Object;
	@Input() theme: string;
	@Input() formats: string[];

	@ViewChild('editor', { read: ViewContainerRef }) editor;

	defaultModules = {
		toolbar: [
			['bold', 'italic', 'underline', 'strike'],
			['blockquote'],
			[{ 'list': 'ordered' }, { 'list': 'bullet' }],
			[{ 'font': [] }],
			[{ 'align': [] }],
			['clean']
		]
	};

	quillEditor: any;
	propagateChange = (_: any) => { };

	get quillValue() {
		// return this._quillValue;
		return this._quillValue;
	}

	set quillValue(val) {
		this._quillValue = val;
		this.propagateChange(this._quillValue);
	}

	writeValue(value: any) {
		if (!_.isNil(value)) {
			this.quillValue = value;
			this.quillEditor.deleteText(0, this.quillEditor.getLength());
			this.quillEditor.clipboard.dangerouslyPasteHTML(0, value);
		}
	}

	registerOnChange(fn) {
		this.propagateChange = fn;
	}

	registerOnTouched() { }

	ngAfterViewInit() {
		let Parchment = quill.import('parchment');
		this.updateEditor();

		this.quillEditor.on('text-change', (() => {
			this.quillValue = this.quillEditor.root.innerHTML;
		}).bind(this));
	}

	updateEditor() {
		this.quillEditor = new quill(this.editor.element.nativeElement, {
			modules: this.modules || this.defaultModules,
			placeholder: this.placeholder,
			readOnly: this.readOnly,
			theme: this.theme || 'snow',
			formats: this.formats,
		});
	}
}
