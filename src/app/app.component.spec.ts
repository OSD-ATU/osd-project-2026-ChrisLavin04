import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    const { HttpClientTestingModule } = await import('@angular/common/http/testing');
    const { RouterTestingModule } = await import('@angular/router/testing');
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: 'ActivatedRoute', useValue: {} }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the correct title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Sports Management System');
  });

  it('should render title in nav brand', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // The title is rendered in the nav brand anchor
    expect(compiled.querySelector('.nav-brand a')?.textContent).toContain('Sports Management System');
  });
});
