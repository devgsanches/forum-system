import { left, right, type Either } from './either'

interface Error {
  message: string
  status: number
}

interface Success {
  message: string
  status: number
}

function doSomething(shouldSuccess: boolean): Either<Error, Success> {
  if (shouldSuccess) {
    return right({
      message: 'Successfully created.',
      status: 201,
    })
  } else {
    return left({
      message: 'Not Allowed.',
      status: 401,
    })
  }
}

test('must be success', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('must be error', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})
