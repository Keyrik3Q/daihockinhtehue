import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D5QuestionnaireComponent } from './d5-questionnaire.component';

describe('D5QuestionnaireComponent', () => {
  let component: D5QuestionnaireComponent;
  let fixture: ComponentFixture<D5QuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D5QuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D5QuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
