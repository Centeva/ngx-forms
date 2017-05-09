import { Component, OnChanges, Input, trigger, state, style, transition, animate, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Tools } from './ngxForm.models';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FormsConfig } from '../formsConfig';

@Component({

	selector: 'ngx-form',
	templateUrl: 'ngxForm.component.html',
	styleUrls: ['ngxForm.component.less']
})
export class NgxFormComponent {

}
