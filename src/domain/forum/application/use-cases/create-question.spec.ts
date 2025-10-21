import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Create Question UseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: CreateQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository) // system under test
  })

  it('should be able to create a question', async () => {
    const response = await sut.execute({
      studentId: new UniqueEntityId('1'),
      title: 'Title',
      content: 'Content',
    })

    if (response.isRight()) {
      const { question } = response.result

      expect(question).toMatchObject(
        expect.objectContaining({
          id: question.id,
          studentId: new UniqueEntityId('1'),
          title: 'Title',
          content: 'Content',
        })
      )
    }
  })
})
