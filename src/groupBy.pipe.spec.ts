import {
  async, inject
} from '@angular/core/testing';
import { GroupByPipe } from './groupBy.pipe';

describe('Pipe: groupBy', () => {
  it('create an instance', () => {
    let pipe = new GroupByPipe();
    expect(pipe).toBeTruthy();
  });
});
