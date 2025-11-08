/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EstrangeiroComponent } from './estrangeiro.component';

describe('EstrangeiroComponent', () => {
  let component: EstrangeiroComponent;
  let fixture: ComponentFixture<EstrangeiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstrangeiroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstrangeiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
