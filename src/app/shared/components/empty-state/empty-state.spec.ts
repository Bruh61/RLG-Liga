import { TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders the icon and message inputs', async () => {
    const fixture = TestBed.createComponent(EmptyState);
    fixture.componentRef.setInput('message', 'Nichts gefunden');
    fixture.componentRef.setInput('icon', 'search_off');
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.empty-state__message')?.textContent).toContain('Nichts gefunden');
    expect(el.querySelector('mat-icon')?.textContent).toContain('search_off');
  });
});
