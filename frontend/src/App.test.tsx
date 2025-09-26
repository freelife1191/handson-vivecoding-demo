import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <MantineProvider>
        <App />
      </MantineProvider>
    );
    expect(screen.getByText(/TODO APP/i)).toBeInTheDocument();
  });
});
