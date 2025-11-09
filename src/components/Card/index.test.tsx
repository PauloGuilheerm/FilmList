import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Card from './index';

const renderCard = (overrideProps = {}) => {
  const defaultProps = {
    title: 'Star Wars: A New Hope',
    rating: 4.5,
    posterUrl: '/poster.jpg',
    onToggleFavorite: vi.fn(),
    onMovieClick: vi.fn(),
    isFavorite: false,
    index: 3,
    cardAction: 'favorite' as const,
    highlightTerm: undefined,
  };

  return {
    user: userEvent.setup(),
    props: { ...defaultProps, ...overrideProps },
    ...render(<Card {...defaultProps} {...overrideProps} />),
  };
};

describe('Card', () => {
  it('should render title, rating and accessible metadata', () => {
    const { props: { title } } = renderCard();

    expect(screen.getByLabelText(`Filme: ${title}`)).toBeInTheDocument();
    expect(screen.getByTitle(title)).toHaveTextContent(title);
    expect(screen.getByTitle('Nota')).toHaveTextContent('4.50');
  });

  it('should format rating with two decimal places', () => {
    renderCard({ rating: 7 });

    expect(screen.getByTitle('Nota')).toHaveTextContent('7.00');
  });

  it('should highlight matched term ignoring case', () => {
    renderCard({ highlightTerm: 'star' });

    const highlight = screen.getByText('Star', { selector: 'span' });
    expect(highlight).toHaveClass('bg-yellow-400');
  });

  it('should render fallback block when poster is missing', () => {
    renderCard({ posterUrl: undefined });

    expect(screen.getByText('Poster do Filme')).toBeInTheDocument();
  });

  it('should render poster image when url is provided', () => {
    const { props: { title } } = renderCard({ posterUrl: '/sample.png' });

    const image = screen.getByRole('img', { name: `Poster do filme ${title}` });
    expect(image).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/sample.png');
  });

  it('should call onMovieClick with index when card is clicked', async () => {
    const onMovieClick = vi.fn();
    const { user, props: { title, index } } = renderCard({ onMovieClick });

    await user.click(screen.getByLabelText(`Filme: ${title}`));

    expect(onMovieClick).toHaveBeenCalledWith(index);
  });

  it('should call onToggleFavorite and stop propagation', async () => {
    const onToggleFavorite = vi.fn();
    const onMovieClick = vi.fn();
    const { user } = renderCard({ onToggleFavorite, onMovieClick });

    const toggleButton = screen.getByRole('button', { name: 'Adicionar aos favoritos' });
    await user.click(toggleButton);

    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onMovieClick).not.toHaveBeenCalled();
  });

  it('should render favorite button states correctly', () => {
    renderCard({ isFavorite: true });

    expect(
      screen.getByTestId('favorite-icon')
    ).toBeInTheDocument();
  });

  it('should render delete button when cardAction is delete', () => {
    renderCard({ cardAction: 'delete' });

    expect(
      screen.getByRole('button', { name: /deletar dos favoritos/i })
    ).toBeInTheDocument();
  });

  it('should set tabIndex using the provided index', () => {
    const { props: { title } } = renderCard({ index: 7 });

    expect(screen.getByLabelText(`Filme: ${title}`)).toHaveAttribute('tabindex', '7');
  });
});

