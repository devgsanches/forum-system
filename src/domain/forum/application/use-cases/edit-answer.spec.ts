import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import type { Answer } from '../../enterprise/entities/answer'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeStudent } from 'test/factories/make-student'
import type { Student } from '../../enterprise/entities/student'

describe('Edit Answer UseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let author: Student
  let answer: Answer
  let sut: EditAnswerUseCase

  beforeEach(async () => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository) // system under test

    author = makeStudent({}, new UniqueEntityId('author-01'))

    answer = makeAnswer({
      authorId: author.id,
    })

    await inMemoryAnswersRepository.create(answer)
  })

  it('should be able to edit a answer', async () => {
    const response = await sut.execute({
      id: answer.id,
      authorId: answer.authorId,
      content: 'New content',
    })

    if (response.isRight()) {
      const { answer } = response.result
      expect(answer).toMatchObject(
        expect.objectContaining({
          id: answer.id,
          authorId: answer.authorId,
          content: 'New content',
        })
      )
    }
  })
})
