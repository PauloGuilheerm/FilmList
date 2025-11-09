import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../assets/clapper.png', () => ({ default: 'clapper.png' }));

const mockNavigate = vi.fn();
let mockLocation = { pathname: '/', search: '' };
const mockUseDebounce = vi.fn();

type MockTab = { label: string; to: string; onClick?: () => void };
type MockTabsProps = {
  tabs: MockTab[];
  orientation?: 'horizontal' | 'vertical';
  onSelect?: (path: string) => void;
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

vi.mock('../../hooks/useDebounce', () => ({
  default: (value: string) => mockUseDebounce(value),
}));


vi.mock('../Tabs', () => ({
  Tabs: ({ tabs, orientation = 'horizontal', onSelect }: MockTabsProps) => (
    <div data-testid={`tabs-${orientation}`}>
      {tabs.map((tab) => (
        <button
          key={`${orientation}-${tab.label}`}
          type="button"
          onClick={() => {
            tab.onClick?.();
            onSelect?.(tab.to);
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ),
}));

import Header from './index';

const renderHeader = () => {
  const user = userEvent.setup();
  return {
    user,
    ...render(<Header />),
  };
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
  mockLocation = { pathname: '/', search: '' };
  mockUseDebounce.mockImplementation((value: string) => ({
    value,
    debouncedValue: value,
  }));
});

describe('Header', () => {
  it('should render logo and search field', () => {
    renderHeader();

    expect(screen.getByText('MovieDB')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar filmes...')).toBeInTheDocument();
  });

  it('should navigate to search when typing a query', async () => {
    const { user } = renderHeader();
    const searchInput = screen.getByPlaceholderText('Buscar filmes...');

    await user.click(searchInput);
    await user.paste('aventura');

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/search?q=aventura')
    );
  });

  it('should read the query string and populate the search field', async () => {
    mockLocation = { pathname: '/search', search: '?q=aventura' };
    renderHeader();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Buscar filmes...')).toHaveValue('aventura');
    });
  });

  it('should clear search and navigate home when brand button is clicked', async () => {
    mockLocation = { pathname: '/search', search: '?q=aventura' };
    const { user, rerender } = renderHeader();
    const searchInput = screen.getByPlaceholderText('Buscar filmes...');

    await waitFor(() => expect(searchInput).toHaveValue('aventura'));

    mockNavigate.mockClear();

    const brandButton = screen.getByRole('button', { name: /MovieDB/i });
    await user.click(brandButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');

    mockLocation = { pathname: '/', search: '' };
    rerender(<Header />);

    await waitFor(() => expect(searchInput).toHaveValue(''));
  });

  it('should toggle the mobile menu and close it on second click', async () => {
    const { user } = renderHeader();
    const menuButton = screen.getByRole('button', { name: 'Abrir menu' });

    expect(screen.queryByTestId('tabs-vertical')).not.toBeInTheDocument();

    await user.click(menuButton);
    expect(screen.getByTestId('tabs-vertical')).toBeInTheDocument();

    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.queryByTestId('tabs-vertical')).not.toBeInTheDocument();
    });
  });

  it('should close the mobile menu when the search input gains focus', async () => {
    const { user } = renderHeader();
    const menuButton = screen.getByRole('button', { name: 'Abrir menu' });
    const searchInput = screen.getByPlaceholderText('Buscar filmes...');

    await user.click(menuButton);
    expect(screen.getByTestId('tabs-vertical')).toBeInTheDocument();

    await user.click(searchInput);

    await waitFor(() => {
      expect(screen.queryByTestId('tabs-vertical')).not.toBeInTheDocument();
    });
  });

  it('should trigger tab actions and close menu via onSelect', async () => {
    mockLocation = { pathname: '/search', search: '?q=aventura' };
    const { user, rerender } = renderHeader();
    const searchInput = screen.getByPlaceholderText('Buscar filmes...');

    await waitFor(() => expect(searchInput).toHaveValue('aventura'));

    mockNavigate.mockClear();

    const homeTab = screen.getByRole('button', { name: 'Home' });
    await user.click(homeTab);

    expect(mockNavigate).toHaveBeenCalledWith('/');
    mockLocation = { pathname: '/', search: '' };
    rerender(<Header />);
    await waitFor(() => expect(searchInput).toHaveValue(''));

    const favoritesTab = screen.getByRole('button', { name: 'Favoritos' });
    await user.click(favoritesTab);

    expect(mockNavigate).toHaveBeenLastCalledWith('/favorites');
    mockLocation = { pathname: '/favorites', search: '' };
    rerender(<Header />);
    await waitFor(() => expect(searchInput).toHaveValue(''));
  });

  it('should close the mobile menu when a vertical tab is selected', async () => {
    const { user } = renderHeader();
    const menuButton = screen.getByRole('button', { name: 'Abrir menu' });

    await user.click(menuButton);
    const verticalTabs = screen.getByTestId('tabs-vertical');
    const homeTabMobile = within(verticalTabs).getByRole('button', { name: 'Home' });

    await user.click(homeTabMobile);

    await waitFor(() => {
      expect(screen.queryByTestId('tabs-vertical')).not.toBeInTheDocument();
    });
  });
});

