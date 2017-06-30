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

export class NgxFormsUtil {

  static BaseFieldModule() {
    @NgModule({
      imports: [
        MdCheckboxModule,
        CommonModule,
        NgPipesModule,
        DatePickerModule,
        FormsModule,
      ],
      declarations: [
        CheckListComponent,
        SearchOptionsComponent,
        QuillComponent,
        DynamicComponent,
        IsEmpty,
        GroupByPipe,
        Search
      ],
      exports: [
        SearchOptionsComponent,
        CheckListComponent,
        QuillComponent,
        DynamicComponent,
        IsEmpty,
        GroupByPipe,
        Search

      ],
    }) class BaseFieldModule { }
    return BaseFieldModule
  }

  static forRoot(config: FormsConfig = <FormsConfig>{}): ModuleWithProviders {
    @NgModule({
      imports: [
        CommonModule,
        NgPipesModule,
        DatePickerModule,
        FormsModule,
        MdCheckboxModule,
        NgxFormsUtil.BaseFieldModule(),
        ...config.fieldModules
      ],
      declarations: [
        EditFormComponent,
        EditListComponent,
        NgxFormComponent
      ],
      exports: [
        EditFormComponent,
        EditListComponent,
        NgxFormComponent
      ],
    }) class NgxFormsInnerModule { }
    
    config.innerModule = NgxFormsInnerModule;

    return {
      ngModule: NgxFormsInnerModule,
      providers: [
        { provide: FormsConfig, useValue: config }
      ]
    }    
  }
}

class emptyConfig extends FormsConfig { }
