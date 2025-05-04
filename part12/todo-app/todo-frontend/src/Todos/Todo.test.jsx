import {test, beforeEach, vi, expect, describe} from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import Todo from './Todo.jsx'

const mockComplete = vi.fn()
const mockDelete = vi.fn()

const mockTodo = {
    text: 'Testing',
    done: false,
    _id: '2323a3'
}

beforeEach(() => {
    cleanup()   
})
describe('Todo component', () => {
    test('is correctly rendered if undone', () =>{
        mockTodo.done = false
        render(
            <Todo todo={mockTodo} onClickComplete={mockComplete} onClickDelete={mockDelete} />
        )
        expect(screen.getByText('Testing')).toBeDefined()
        expect(screen.getByRole('button', {name: 'Set as done'})).toBeDefined()

}),
test('is correctly rendered if done', () =>{
    mockTodo.done = true
    render(
        <Todo todo={mockTodo} onClickComplete={mockComplete} onClickDelete={mockDelete} />
    )
    expect(screen.getByText('Testing')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Set as done' })).toBeNull()
})
})
