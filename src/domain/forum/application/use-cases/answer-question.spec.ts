import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

describe('Answer Question UseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let sut: AnswerQuestionUseCase

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository) // system under test
  })

  it('should be able to answer a question', async () => {
    const response = await sut.execute({
      authorId: new UniqueEntityId('1'),
      questionId: new UniqueEntityId('2'),
      content: 'New answer',
    })

    if (response.isRight()) {
      const { answer } = response.result

      expect(inMemoryAnswersRepository.items[0]).toMatchObject(
        expect.objectContaining({
          id: answer.id,
          authorId: new UniqueEntityId('1'),
          questionId: new UniqueEntityId('2'),
          content: 'New answer',
        })
      )
    }
  })
})
