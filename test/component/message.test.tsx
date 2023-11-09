import { Message } from '@/lib/infrastructure/component-library/conversation/message'
import { render, act, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/jest-globals'

describe('color', () => {
  it('should render Message component with Text', async () => {
    const date = new Date()
    await act(async () => {
      render(<Message name="Mayank Sharma" content="This is a test" />)

    })
    expect(screen.getByText('Mayank Sharma')).toBeInTheDocument()

  })
})
