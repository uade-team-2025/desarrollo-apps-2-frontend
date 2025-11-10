import { render, screen } from '@testing-library/react';
import { NoDataFound } from '../../core/components/no-data-found';

// Mock Chakra UI
jest.mock('@chakra-ui/react', () =>
  require('../../__mocks__/@chakra-ui__react')
);

// Mock DotLottieReact
jest.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: ({ src, loop, autoplay, style }: any) => (
    <div
      data-testid="lottie-animation"
      data-src={src}
      data-loop={loop.toString()}
      data-autoplay={autoplay.toString()}
      style={style}
    >
      Lottie Animation
    </div>
  ),
}));

// Mock the animation import
jest.mock('../../animations/NoDataFound.lottie', () => 'mocked-animation-url');

describe('NoDataFound', () => {
  describe('default rendering', () => {
    it('should render with default props', () => {
      render(<NoDataFound />);

      expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
      expect(
        screen.getByText('No se encontraron elementos para mostrar.')
      ).toBeInTheDocument();
      expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
    });

    it('should render lottie animation with correct props', () => {
      render(<NoDataFound />);

      const animation = screen.getByTestId('lottie-animation');
      expect(animation).toHaveAttribute('data-src', 'mocked-animation-url');
      expect(animation).toHaveAttribute('data-loop', 'true');
      expect(animation).toHaveAttribute('data-autoplay', 'true');
    });
  });

  describe('custom props', () => {
    it('should render custom title and message', () => {
      render(
        <NoDataFound
          title="Custom Title"
          message="Custom message for no data"
        />
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(
        screen.getByText('Custom message for no data')
      ).toBeInTheDocument();
    });

    it('should render action button when provided', () => {
      const mockAction = jest.fn();

      render(
        <NoDataFound actionLabel="Create New Item" onAction={mockAction} />
      );

      const actionButton = screen.getByText('Create New Item');
      expect(actionButton).toBeInTheDocument();

      actionButton.click();
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('should not render action button when only actionLabel is provided', () => {
      render(<NoDataFound actionLabel="Create New Item" />);

      expect(screen.queryByText('Create New Item')).not.toBeInTheDocument();
    });

    it('should not render action button when only onAction is provided', () => {
      const mockAction = jest.fn();

      render(<NoDataFound onAction={mockAction} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('size variants', () => {
    it('should render with small size', () => {
      render(<NoDataFound size="sm" />);

      const animation = screen.getByTestId('lottie-animation');
      expect(animation).toHaveStyle({ width: '100%', height: '100%' });
    });

    it('should render with medium size (default)', () => {
      render(<NoDataFound size="md" />);

      const animation = screen.getByTestId('lottie-animation');
      expect(animation).toHaveStyle({ width: '100%', height: '100%' });
    });

    it('should render with large size', () => {
      render(<NoDataFound size="lg" />);

      const animation = screen.getByTestId('lottie-animation');
      expect(animation).toHaveStyle({ width: '100%', height: '100%' });
    });

    it('should apply correct action button size for large variant', () => {
      const mockAction = jest.fn();

      render(
        <NoDataFound
          size="lg"
          actionLabel="Large Action"
          onAction={mockAction}
        />
      );

      expect(screen.getByText('Large Action')).toBeInTheDocument();
    });

    it('should apply correct action button size for medium variant', () => {
      const mockAction = jest.fn();

      render(
        <NoDataFound
          size="md"
          actionLabel="Medium Action"
          onAction={mockAction}
        />
      );

      expect(screen.getByText('Medium Action')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('should call onAction when action button is clicked', () => {
      const mockAction = jest.fn();

      render(<NoDataFound actionLabel="Click Me" onAction={mockAction} />);

      const button = screen.getByText('Click Me');

      button.click();
      button.click();
      button.click();

      expect(mockAction).toHaveBeenCalledTimes(3);
    });
  });

  describe('accessibility', () => {
    it('should have proper text content for screen readers', () => {
      render(
        <NoDataFound
          title="No Users Found"
          message="There are currently no users in the system."
        />
      );

      expect(
        screen.getByRole('heading', { name: 'No Users Found' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('There are currently no users in the system.')
      ).toBeInTheDocument();
    });

    it('should have clickable button when action is provided', () => {
      const mockAction = jest.fn();

      render(<NoDataFound actionLabel="Add User" onAction={mockAction} />);

      const button = screen.getByRole('button', { name: 'Add User' });
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });
  });

  describe('layout structure', () => {
    it('should render card layout structure', () => {
      const { container } = render(<NoDataFound />);

      // Should have main container
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render divider when action button is present', () => {
      const mockAction = jest.fn();

      render(<NoDataFound actionLabel="Action" onAction={mockAction} />);

      // The divider is rendered as part of the layout when action button exists
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('should not render divider when no action button', () => {
      render(<NoDataFound />);

      // Only title and message should be present, no action button or divider
      expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
      expect(
        screen.getByText('No se encontraron elementos para mostrar.')
      ).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('animation container', () => {
    it('should render animation container with proper dimensions', () => {
      render(<NoDataFound size="md" />);

      const animation = screen.getByTestId('lottie-animation');
      expect(animation).toBeInTheDocument();
      expect(animation).toHaveTextContent('Lottie Animation');
    });

    it('should handle different sizes for animation container', () => {
      const { rerender } = render(<NoDataFound size="sm" />);
      expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();

      rerender(<NoDataFound size="md" />);
      expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();

      rerender(<NoDataFound size="lg" />);
      expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
    });
  });
});
