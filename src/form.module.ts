import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EditFormComponent } from './editForm';
import { NgxFormComponent } from './ngxForm';
import { EditListComponent } from './editList';
import { CheckListComponent } from './checkList';
import { SearchOptionsComponent } from './searchOptions';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { NgPipesModule } from 'angular-pipes';
import { DatePickerModule } from 'ct-ngx-datepicker';
import { QuillComponent } from './quill/';
import { DynamicComponent } from './dynamicComponent/';

import { IsEmpty } from './isEmpty.pipe';
import { GroupByPipe } from './groupBy.pipe';
import { Search, SearchModel } from './search.pipe';

import { FormsConfig } from './formsConfig';

export { FormsConfig } from './formsConfig';
export { Tools } from './editForm';

export class NgxFormsModule {

  static initModule(config: FormsConfig = <FormsConfig>{}): ModuleWithProviders {
    @NgModule({
      imports: [
        MdCheckboxModule,
        CommonModule,
        NgPipesModule,
        DatePickerModule,
        FormsModule,
        ...config.fieldModules
      ],
      declarations: [
        EditFormComponent,
        EditListComponent,
        CheckListComponent,
        NgxFormComponent,
        SearchOptionsComponent,
        QuillComponent,
        DynamicComponent,
        IsEmpty,
        GroupByPipe,
        Search
      ],
      exports: [
        EditFormComponent,
        EditListComponent,
        SearchOptionsComponent,
        CheckListComponent,
        NgxFormComponent,
        QuillComponent,
        DynamicComponent

      ],
    }) class NgxFormsInnerModule { }
    return {
      ngModule: NgxFormsInnerModule,
      providers: [
        { provide: FormsConfig, useValue: config }
      ]
    }
  }
}

class emptyConfig extends FormsConfig { }
