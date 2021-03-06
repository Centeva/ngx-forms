import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { Tools } from './form.module';
@Pipe({
	name: 'groupByFields'
})
export class GroupByPipe implements PipeTransform {

	transform(fields: Tools.Field[]): Tools.Field[] {
		return _.filter(fields, f => Tools.checkGroup(f, fields) && f.Display);
	}
}
