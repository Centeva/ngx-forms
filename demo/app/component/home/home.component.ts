import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Tools } from '../../../../src/form.module';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {

  form: TestOneForm;
  date1: moment.Moment = undefined;
  date2: moment.Moment = undefined;
  date3: moment.Moment = undefined;
  state: BehaviorSubject<any>;

  yearFirstRegex = new RegExp(/^(\d{4})(-|\/)(\d{2})(-|\/)(\d{2})$/);

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    this.form = new TestOneForm(0);
	let testState = {DataOne: [{Code: 'ONE', Value: 1}, {Code: 'TWO', Value: 2}]};
	this.state = new BehaviorSubject<any>(testState);
	let obs = Observable.interval(1000).subscribe((() => this.state.next(testState)).bind(this));
  }

  ngOnDestroy() {
  }

}

type test = {
  One: any;
  Two: any;
  Three: any;
  Four: any;
  Five: any;
}

export class TestOneForm extends Tools.FormConstructor<test & {Id: number}> {
	toggled = false;

	constructor(id: number) {
		super(id, undefined, { Style: 'dropdown-style' });
		super['offset'] = null;
		super['completionDate'] = null;
	}

	save(converted: test & {Id: number, Dockets: any[], dualDates: {To: moment.Moment, From: moment.Moment}}) {

		delete converted.dualDates;
		delete converted.Id;
		delete converted.Dockets;

		this.toggled = false;
	}

	cancel() {
		this.toggled = false;
	}

	allCall(searchString) {
		this['searchString'] = searchString;
	}

	calcOffset() {
		if (this['completionDate'] && this['offset']) {
			return moment(this['completionDate']).add(this['offset'], 'days').format('MM/DD/YYYY');
		}

		return 'Select an Inspection Type and Completion Date.';
	}

	toggle() {
		this.toggled = !this.toggled;
	}

	initFields() {
		return [
			super.newOptions(0, 'Report Type', 'One', {
				Width: 12,
				OptionsParams: 'ReportType'
			}),
			super.newOptions(0, 'Another one', 'Two', {
				Width: 12,
				OptionsParams: 'DataOne',
				Map: (d) => d.map(o => ({Name: o.Code, Value: o.Value}))
			}),
			super.newDualDate(0, 'Date Available in HRMS', 'Three', {
				Width: 12
			}),
			super.newOptions(0, 'Inspection Type', 'Four', {
				Width: 12,
        OptionsArray: [{Name: 'One', Value: 1}, {Name: 'Two', Value: 2}]
			}),
			super.newChecklist(0, 'Some List', '', {
				OptionsArray: [{Name: 'One', Value: 1}, {Name: 'Two', Value: 2}],
				Width: 12
			}),
			super.newDate(0, 'Inspection Completion Date', 'Five', {
				Width: 6,
				Changed: ((form, field) => this['completionDate'] = field.Value)
			})
		];
	}

}