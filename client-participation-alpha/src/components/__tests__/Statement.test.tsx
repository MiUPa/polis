import type React from 'react'
import { fireEvent, render } from '@testing-library/react'
import enUS from '../../strings/en_us'
import { Statement } from '../Statement'
import type { StatementData } from '../types'

const defaultStatement: StatementData = {
  tid: 42,
  txt: 'Test statement',
  remaining: 10
}

const noopSetImportant =
  jest.fn() as unknown as React.Dispatch<React.SetStateAction<boolean>>

describe('Statement keyboard shortcuts', () => {
  it('submits votes with S/D/F keys', () => {
    const onVote = jest.fn()
    render(
      <Statement
        statement={defaultStatement}
        onVote={onVote}
        isVoting={false}
        s={enUS}
        isStatementImportant={false}
        setIsStatmentImportant={noopSetImportant}
        voteError={null}
        importanceEnabled={false}
      />
    )

    fireEvent.keyDown(window, { key: 's' })
    fireEvent.keyDown(window, { key: 'D' })
    fireEvent.keyDown(window, { key: 'f' })

    expect(onVote.mock.calls).toEqual([
      [-1, defaultStatement.tid],
      [1, defaultStatement.tid],
      [0, defaultStatement.tid]
    ])
  })

  it('does not submit shortcut votes while a vote request is in progress', () => {
    const onVote = jest.fn()
    render(
      <Statement
        statement={defaultStatement}
        onVote={onVote}
        isVoting={true}
        s={enUS}
        isStatementImportant={false}
        setIsStatmentImportant={noopSetImportant}
        voteError={null}
        importanceEnabled={false}
      />
    )

    fireEvent.keyDown(window, { key: 's' })
    fireEvent.keyDown(window, { key: 'd' })
    fireEvent.keyDown(window, { key: 'f' })

    expect(onVote).not.toHaveBeenCalled()
  })

  it('does not trigger shortcut votes while typing into an input field', () => {
    const onVote = jest.fn()
    const { container } = render(
      <Statement
        statement={defaultStatement}
        onVote={onVote}
        isVoting={false}
        s={enUS}
        isStatementImportant={false}
        setIsStatmentImportant={noopSetImportant}
        voteError={null}
        importanceEnabled={false}
      />
    )

    const input = document.createElement('input')
    container.appendChild(input)
    input.focus()

    fireEvent.keyDown(input, { key: 's' })
    fireEvent.keyDown(input, { key: 'd' })
    fireEvent.keyDown(input, { key: 'f' })

    expect(onVote).not.toHaveBeenCalled()
  })
})
