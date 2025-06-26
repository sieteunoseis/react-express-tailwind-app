import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataForm from '../DataForm';

// Mock the config context
vi.mock('../../config/ConfigContext', () => ({
  useConfig: () => ({
    config: [
      {
        name: 'name',
        type: 'TEXT',
        validator: { name: 'isAscii', options: '' }
      },
      {
        name: 'hostname',
        type: 'TEXT',
        validator: { name: 'isFQDN', options: { allow_numeric_tld: true } }
      }
    ]
  })
}));

// Mock toast
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const mockOnSubmit = vi.fn();

describe('DataForm', () => {
  it('renders form fields based on config', () => {
    render(<DataForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hostname/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<DataForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<DataForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/name/i), 'TestConnection');
    await user.type(screen.getByLabelText(/hostname/i), 'example.com');
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'TestConnection',
        hostname: 'example.com'
      });
    });
  });
});