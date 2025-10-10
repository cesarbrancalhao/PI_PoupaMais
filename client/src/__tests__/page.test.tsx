import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home Page', () => {
  it('renders the home page', () => {
    render(<Home />)
    
    // Check if the page renders without crashing - looking for any text that exists
    expect(screen.getByText(/Get started by editing/)).toBeInTheDocument()
  })
})
