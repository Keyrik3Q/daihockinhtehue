import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { A6ManagerWebsiteComponent } from './a6-manager-website.component';

describe('A6ManagerWebsiteComponent', () => {
  let component: A6ManagerWebsiteComponent;
  let fixture: ComponentFixture<A6ManagerWebsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ A6ManagerWebsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(A6ManagerWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
