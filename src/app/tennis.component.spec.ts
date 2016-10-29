import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { TennisAppComponent } from '../app/tennis.component';

beforeEachProviders(() => [TennisAppComponent]);

describe('App: Tennis', () => {
  it('should create the app',
      inject([TennisAppComponent], (app: TennisAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'tennis works!\'',
      inject([TennisAppComponent], (app: TennisAppComponent) => {
    expect(app.title).toEqual('tennis works!');
  }));
});
