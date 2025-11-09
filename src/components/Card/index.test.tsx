import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { MouseEvent, ReactNode } from 'react';
import Card from './index';

type CardActionProps = {
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

const DefaultCardAction = ({ handleClick }: CardActionProps) => (
  <button type="button" aria-label="Card action" onClick={handleClick}>
    Action
  </button>
);

const renderCard = (overrideProps = {}) => {
  const title = 'Star Wars: A New Hope';
  const defaultProps = {
    title: title,
    rating: 4.5,
    posterUrl: '/poster.jpg',
    onToggleFavorite: vi.fn(),
    onMovieClick: vi.fn(),
    index: 3,
    CardAction: DefaultCardAction,
    highlightTerm: undefined,
  };

  const user = userEvent.setup();
  render(<Card {...defaultProps} {...overrideProps} />);

  return {
    user,
    props: { ...defaultProps, ...overrideProps },
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
    const { user } = renderCard({
      onToggleFavorite,
      onMovieClick,
      CardAction: ({ handleClick }: CardActionProps): ReactNode =>
        <button
          type="button"
          aria-label="Adicionar aos favoritos"
          onClick={handleClick}
        />
    });

    const toggleButton = screen.getByRole('button', { name: 'Adicionar aos favoritos' });
    await user.click(toggleButton);

    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onMovieClick).not.toHaveBeenCalled();
  });

  it('should set tabIndex using the provided index', () => {
    const { props: { title } } = renderCard({ index: 7 });

    expect(screen.getByLabelText(`Filme: ${title}`)).toHaveAttribute('tabindex', '7');
  });

  it('should render CardAction when provided', () => {
    renderCard({
      CardAction: ({ handleClick }: CardActionProps): ReactNode =>
        <button
          type="button"
          aria-label="deletar dos favoritos"
          onClick={handleClick}
        />
    });

    expect(screen.getByLabelText('deletar dos favoritos')).toBeInTheDocument();
  });
});

