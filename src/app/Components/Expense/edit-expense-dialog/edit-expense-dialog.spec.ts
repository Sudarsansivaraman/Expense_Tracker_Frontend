import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExpenseDialog } from './edit-expense-dialog';

describe('EditExpenseDialog', () => {
  let component: EditExpenseDialog;
  let fixture: ComponentFixture<EditExpenseDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExpenseDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExpenseDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
