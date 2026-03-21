import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchFormComponent } from './match-form.component';

describe('MatchFormComponent', () => {
  let component: MatchFormComponent;
  let fixture: ComponentFixture<MatchFormComponent>;

  beforeEach(async () => {
    const { HttpClientTestingModule } = await import('@angular/common/http/testing');
    const { RouterTestingModule } = await import('@angular/router/testing');
    await TestBed.configureTestingModule({
      imports: [MatchFormComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: 'ActivatedRoute', useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
