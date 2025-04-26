import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackForm } from '../components/FeedbackForm';

describe('FeedbackForm Component', () => {
  test('renders the feedback form title', () => {
    render(<FeedbackForm />);
    const titleElement = screen.getByText('Обратная связь');
    expect(titleElement).toBeInTheDocument();
  });

  test('allows entering name and message', async () => {
    const user = userEvent.setup();
    render(<FeedbackForm />);
    
    const nameInput = screen.getByPlaceholderText('Ваше имя');
    const messageInput = screen.getByPlaceholderText('Ваше сообщение');

    await user.type(nameInput, 'John Doe');
    await user.type(messageInput, 'This is a test message');

    expect(nameInput).toHaveValue('John Doe');
    expect(messageInput).toHaveValue('This is a test message');
  });

  test('shows confirmation message after submitting with valid data', async () => {
    const user = userEvent.setup();
    render(<FeedbackForm />);
    
    const nameInput = screen.getByPlaceholderText('Ваше имя');
    const messageInput = screen.getByPlaceholderText('Ваше сообщение');
    const submitButton = screen.getByText('Отправить');

    await user.type(nameInput, 'John Doe');
    await user.type(messageInput, 'This is a test message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Спасибо, John Doe!/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('does not show confirmation when name or message is empty', async () => {
    const user = userEvent.setup();
    render(<FeedbackForm />);
    const submitButton = screen.getByText('Отправить');

    await user.type(screen.getByPlaceholderText('Ваше сообщение'), 'Test message');
    await user.click(submitButton);
    
    await user.type(screen.getByPlaceholderText('Ваше имя'), 'Test name');
    await user.clear(screen.getByPlaceholderText('Ваше сообщение'));
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Спасибо,/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('submit button exists and is enabled', () => {
    render(<FeedbackForm />);
    const submitButton = screen.getByText('Отправить');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });

  test('does not show confirmation when only spaces are entered', async () => {
    const user = userEvent.setup();
    render(<FeedbackForm />);
    const nameInput = screen.getByPlaceholderText('Ваше имя');
    const messageInput = screen.getByPlaceholderText('Ваше сообщение');
    const submitButton = screen.getByText('Отправить');

    await user.type(nameInput, '   ');
    await user.type(messageInput, '     ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Спасибо,/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });
});