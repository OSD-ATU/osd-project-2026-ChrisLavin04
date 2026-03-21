import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerFormComponent } from './player-form.component';

describe('PlayerFormComponent', () => {
  let component: PlayerFormComponent;
  let fixture: ComponentFixture<PlayerFormComponent>;

  beforeEach(async () => {
    const { HttpClientTestingModule } = await import('@angular/common/http/testing');
    const { RouterTestingModule } = await import('@angular/router/testing');
    await TestBed.configureTestingModule({
      imports: [PlayerFormComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: 'ActivatedRoute', useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
