import { render, screen } from '@testing-library/react';
import { PlayerIndicator } from './PlayerIndicator';

describe('PlayerIndicator', () => {
  test('プレイヤーの石の色と名前を表示する', () => {
    render(<PlayerIndicator color="black" label="プレイヤー" />);

    expect(screen.getByText('プレイヤー')).toBeInTheDocument();
    expect(screen.getByTestId('player-stone')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /black stone/i })).toBeInTheDocument();
  });

  test('CPUの石の色と名前を表示する', () => {
    render(<PlayerIndicator color="white" label="CPU" />);

    expect(screen.getByText('CPU')).toBeInTheDocument();
    expect(screen.getByTestId('player-stone')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /white stone/i })).toBeInTheDocument();
  });

  test('石の色がnoneの場合は空の石を表示する', () => {
    render(<PlayerIndicator color="none" label="待機中" />);

    expect(screen.getByText('待機中')).toBeInTheDocument();
    expect(screen.getByTestId('player-stone')).toBeInTheDocument();
    
    const stoneElement = screen.getByTestId('player-stone').querySelector('.stone-empty');
    expect(stoneElement).toBeInTheDocument();
  });

  test('現在のターンの場合はハイライト表示される', () => {
    const { container } = render(<PlayerIndicator color="black" label="プレイヤー" isCurrentTurn={true} />);

    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('border-blue-500', 'bg-blue-50');
  });

  test('現在のターンでない場合は通常表示される', () => {
    const { container } = render(<PlayerIndicator color="black" label="プレイヤー" isCurrentTurn={false} />);

    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('border-gray-300', 'bg-white');
  });
});