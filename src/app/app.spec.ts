import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { App } from './app';

@Component({ selector: 'app-toast', template: '', standalone: false })
class MockToast {}

@Component({ selector: 'app-modal', template: '', standalone: false })
class MockModal {}

@Component({ selector: 'app-detail-modal', template: '', standalone: false })
class MockDetailModal {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [App, MockToast, MockModal, MockDetailModal],
      imports: [RouterModule.forRoot([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
