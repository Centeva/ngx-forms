"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var moment = require('moment');
var calendarMode_1 = require('../common/calendarMode');
var calendarGrid_component_1 = require('../calendarGrid/calendarGrid.component');
var CalendarComponent = (function () {
    function CalendarComponent() {
        this.CalendarMode = calendarMode_1.CalendarMode;
        this.mode = calendarMode_1.CalendarMode.Calendar;
        this.months = [];
        this.years = [];
        this.monthListeners = [];
        this.yearListeners = [];
        this.generateMonthData();
    }
    CalendarComponent.prototype.ngOnInit = function () { };
    CalendarComponent.prototype.ngOnDestroy = function () { };
    CalendarComponent.prototype.subscribeToChangeMonth = function (listener) {
        this.monthListeners.push(listener);
    };
    CalendarComponent.prototype.subscribeToChangeYear = function (listener) {
        this.yearListeners.push(listener);
    };
    CalendarComponent.prototype.changeMode = function (mode) {
        this.mode = mode;
        switch (mode) {
            case calendarMode_1.CalendarMode.Year:
                this.generateYearData(this.date.year());
                break;
        }
    };
    CalendarComponent.prototype.generateMonthData = function () {
        var date = moment(new Date());
        date.month(0);
        var d = moment(new Date());
        d.month(0);
        while (date.year() === d.year()) {
            this.months.push(d.format("MMM"));
            d.month(d.month() + 1);
        }
    };
    CalendarComponent.prototype.generateYearData = function (year) {
        this.years = [];
        var y = year - CalendarComponent.halfNumYearsShown;
        for (var i = 0; i < CalendarComponent.numYearsShown; i++) {
            this.years.push(y + i);
        }
    };
    CalendarComponent.prototype.goPrev = function () {
        switch (this.mode) {
            case calendarMode_1.CalendarMode.Calendar:
                break;
            case calendarMode_1.CalendarMode.Month:
                break;
            case calendarMode_1.CalendarMode.Year:
                this.generateYearData(this.years[CalendarComponent.halfNumYearsShown] - CalendarComponent.numYearsShown);
        }
    };
    CalendarComponent.prototype.goNext = function () {
        switch (this.mode) {
            case calendarMode_1.CalendarMode.Calendar:
                break;
            case calendarMode_1.CalendarMode.Month:
                break;
            case calendarMode_1.CalendarMode.Year:
                this.generateYearData(this.years[CalendarComponent.halfNumYearsShown] + CalendarComponent.numYearsShown);
        }
    };
    CalendarComponent.prototype.renderCalendar = function (clickCallback, dateTo, dateFrom) {
        this.grid.renderCalendar(this, clickCallback, dateTo, dateFrom);
    };
    CalendarComponent.prototype.setMonth = function (index) {
        this.date.month(index);
        for (var _i = 0, _a = this.monthListeners; _i < _a.length; _i++) {
            var fn = _a[_i];
            fn();
        }
    };
    CalendarComponent.prototype.setYear = function (year) {
        this.date.year(year);
        for (var _i = 0, _a = this.yearListeners; _i < _a.length; _i++) {
            var fn = _a[_i];
            fn();
        }
    };
    CalendarComponent.numYearsShown = 9;
    CalendarComponent.halfNumYearsShown = Math.floor(CalendarComponent.numYearsShown / 2);
    __decorate([
        core_1.ViewChild(calendarGrid_component_1.CalendarGridComponent), 
        __metadata('design:type', calendarGrid_component_1.CalendarGridComponent)
    ], CalendarComponent.prototype, "grid", void 0);
    CalendarComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ct-calendar',
            templateUrl: 'calendar.component.html',
            styleUrls: ['calendar.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [])
    ], CalendarComponent);
    return CalendarComponent;
}());
exports.CalendarComponent = CalendarComponent;
//# sourceMappingURL=calendar.component.js.map