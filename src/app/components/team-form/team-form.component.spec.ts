import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamFormComponent } from './team-form.component';

describe('TeamFormComponent', () => {
  let component: TeamFormComponent;
  let fixture: ComponentFixture<TeamFormComponent>;

  beforeEach(async () => {
    const { HttpClientTestingModule } = await import('@angular/common/http/testing');
    const { RouterTestingModule } = await import('@angular/router/testing');
    await TestBed.configureTestingModule({
      imports: [TeamFormComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: 'ActivatedRoute', useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
