import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Tabs } from './index';

const setup = (initialPath = '/', props?: Partial<React.ComponentProps<typeof Tabs>>) => {
  const user = userEvent.setup();
  const onSelect = vi.fn();
  const onHomeClick = vi.fn();
  const onFavClick = vi.fn();

  const tabs = [
    { label: 'Home', to: '/', onClick: onHomeClick },
    { label: 'Favoritos', to: '/favorites', onClick: onFavClick },
  ];

  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Tabs
        tabs={tabs}
        onSelect={onSelect}
        {...props}
      />
    </MemoryRouter>
  );

  return { user, onSelect, onHomeClick, onFavClick };
};

describe('Tabs', () => {
  it('should render tabs and highlight the active one based on route', () => {
    setup('/favorites');

    const home = screen.getByRole('link', { name: 'Home' });
    const fav = screen.getByRole('link', { name: 'Favoritos' });

    expect(home).toBeInTheDocument();
    expect(fav).toBeInTheDocument();

    expect(fav.className).toMatch(/bg-\[#3b82f6\]/);
    expect(home.className).toMatch(/text-slate-300/);
  });

  it('should navigate on click and call onSelect and tab onClick', async () => {
    const { user, onSelect, onHomeClick, onFavClick } = setup('/');

    const home = screen.getByRole('link', { name: 'Home' });
    const fav = screen.getByRole('link', { name: 'Favoritos' });

    expect(home.className).toMatch(/bg-\[#3b82f6\]/);
    expect(fav.className).toMatch(/text-slate-300/);

    await user.click(fav);

    expect(fav.className).toMatch(/bg-\[#3b82f6\]/);
    expect(home.className).toMatch(/text-slate-300/);

    expect(onSelect).toHaveBeenCalledWith('/favorites');
    expect(onFavClick).toHaveBeenCalled();

    await user.click(home);

    expect(onSelect).toHaveBeenCalledWith('/');
    expect(onHomeClick).toHaveBeenCalled();
    expect(home.className).toMatch(/bg-\[#3b82f6\]/);
  });

  it('should apply vertical orientation when specified', () => {
    setup('/', { orientation: 'vertical' });

    const list = screen.getByRole('list');
    expect(list.className).toMatch(/flex-col/);
    expect(list.className).toMatch(/items-start/);
  });

  it('should merge additional className on list container', () => {
    setup('/', { className: 'w-full custom-class' });
    const list = screen.getByRole('list');
    expect(list.className).toMatch(/w-full/);
    expect(list.className).toMatch(/custom-class/);
  });
});


