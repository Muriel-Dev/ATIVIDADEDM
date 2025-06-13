import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinhaContaPage } from './minha-conta.page';

describe('MinhaContaPage', () => {
  let component: MinhaContaPage;
  let fixture: ComponentFixture<MinhaContaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinhaContaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
