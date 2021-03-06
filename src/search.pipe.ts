import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as _ from 'lodash';

export class SearchModel {
	matchArray: string[] = [''];
	matchObject: any = '';

	constructor(matchArray: string[], matchObject: any = '') {
		this.matchArray = matchArray;
		this.matchObject = matchObject;
	}
}

@Pipe({
	name: 'search',
	pure: false
})
export class Search implements PipeTransform {

	transform(value: any, args: any): any {
		if (args.matchObject === (null || '')) { return value; }
		let returnVal = _.filter(value, x => {
			let gets: any;
			gets = _.map(args.matchArray, m => {
				let prop = m as string;
				if (x.hasOwnProperty(prop) && x[prop] !== null) {
					return _.get(x, prop || '');
				} else {
					return '';
				}
			});
			for (let get of gets) {
				let result;
				if (typeof (args.matchObject) === 'string') {
					result = get.toString().toLowerCase().includes(args.matchObject.toLowerCase());
				} else if (args.matchObject instanceof Array) {
					result = _.some(args.matchObject, x => x === get);
				} else {
					result = get === args.matchObject;
				}
				if (result === true) return result;
			};
			return false;
		});
		return returnVal;
	}

}
