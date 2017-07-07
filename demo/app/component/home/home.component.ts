import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Tools } from '../../../../src/form.module';
import { BehaviorSubject, Observable } from 'rxjs';
import { fieldOneComponent, fieldTwoComponent, fieldThreeComponent } from "../../app.module";
import { SearchOptionsComponent } from "../../../../src/searchOptions/index";

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {

  mytest: test = new test({Three: 'Noice!'});
  form: TestTwoForm = new TestTwoForm(1, this.mytest);

  constructor(private fb: FormBuilder) {
    //Observable.timer(0, 1000).subscribe(t => this.form.model = new test({Three: t.toString()}));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}

class test {
  Id: number;
  One: any;
  Two: any;
  Three: any;
  Four: any;
  Five: any;

  constructor(fields?: Partial<test>) {
    Object.assign(this, fields);
  }
}

class TestTwoForm extends Tools.FormConstructor<test> {

	ids() {
		enum ids {
			one,
			two,
			three
		}
		return ids;
	}

	protected onSave(converted: test) {
    console.log(converted);
	}

	initFields() {
		return [
			new Tools.Field<test>(this.ids().one, 'One', fieldOneComponent),
			new Tools.Field<test>(this.ids().two, 'Two', fieldTwoComponent),
			new Tools.Field<test, fieldThreeComponent>(this.ids().three, 'Three', { fieldName: 'Three!' }),
		];
	}

}
