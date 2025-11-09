import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from './index';

describe('Badge', () => {
  it('should render provided text content', () => {
    render(<Badge>Highlight</Badge>);

    expect(screen.getByText('Highlight')).toBeInTheDocument();
  });

  it('should support complex children without losing content', () => {
    render(
      <Badge>
        <>
          <strong>8.5</strong>
          <span> / 10</span>
        </>
      </Badge>
    );

    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByText('/ 10')).toBeInTheDocument();
  });

  it('should apply base classes by default', () => {
    const { container } = render(<Badge>Popular</Badge>);

    const badge = container.querySelector('span');

    expect(badge).toHaveClass(
      'bg-ocean',
      'text-white',
      'px-2',
      'py-1',
      'rounded-md',
      'rounded-xl',
      'text-sm',
      'font-medium'
    );
    expect(badge?.className).not.toContain('undefined');
  });

  it('should merge additional classes with defaults', () => {
    const { container } = render(
      <Badge className="uppercase tracking-wide">Now Playing</Badge>
    );

    const badge = container.querySelector('span');

    expect(badge).toHaveClass('uppercase', 'tracking-wide');
    expect(badge).toHaveClass('bg-ocean');
  });
});

