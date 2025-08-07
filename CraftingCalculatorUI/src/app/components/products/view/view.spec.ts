import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsView } from './view';

describe('View', () => {
  let component: ProductsView;
  let fixture: ComponentFixture<ProductsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
