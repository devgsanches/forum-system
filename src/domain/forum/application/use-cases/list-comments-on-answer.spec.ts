import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { ListCommentsOnAnswerUseCase } from './list-comments-on-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('List Comments On Answer UseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

  let sut: ListCommentsOnAnswerUseCase

  const answer = makeAnswer()

  async function createTwentyTwoCommentsOnAnswer() {
    for (let i = 1; i <= 22; i++) {
      const newAnswerComment = makeAnswerComment({
        answerId: answer.id,
      })
      await inMemoryAnswerCommentsRepository.create(newAnswerComment)
    }
    return
  }

  beforeEach(async () => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()

    await inMemoryAnswersRepository.create(answer)

    await createTwentyTwoCommentsOnAnswer()

    sut = new ListCommentsOnAnswerUseCase(
      inMemoryAnswerCommentsRepository,
      inMemoryAnswersRepository
    ) // system under test
  })

  it('should be able to list comments on a answer and must return the first 20 comments', async () => {
    const response = await sut.execute({
      page: 1,
      answerId: answer.id,
    })

    if (response.isRight()) {
      const { answerComments } = response.result

      expect(answerComments).toHaveLength(20)
      expect(answerComments).not.toContain(
        expect.objectContaining({
          answerId: new UniqueEntityId('new-answer-id'),
        })
      )
    }
  })
})
