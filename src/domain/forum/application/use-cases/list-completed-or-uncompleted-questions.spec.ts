import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'
import { ListQuestionsUseCase } from './list-completed-or-uncompleted-questions'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('List Questions UseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: ListQuestionsUseCase

  beforeEach(async () => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new ListQuestionsUseCase(inMemoryQuestionsRepository) // system under test

    async function createFiveCompletedQuestions() {
      for (let i = 1; i <= 5; i++) {
        const newQuestion = makeQuestion({
          bestAnswerId: new UniqueEntityId('1'),
        })
        await inMemoryQuestionsRepository.create(newQuestion)
      }
      return
    }

    async function createFiveNotCompletedQuestions() {
      for (let i = 1; i <= 5; i++) {
        const newQuestion = makeQuestion()
        await inMemoryQuestionsRepository.create(newQuestion)
      }
      return
    }

    await createFiveCompletedQuestions()
    await createFiveNotCompletedQuestions()
  })

  it('should be able to list all questions completed', async () => {
    const response = await sut.execute({
      completed: true,
      page: 1,
    })

    if (response.isRight()) {
      const { questions } = response.result

      expect(questions).toHaveLength(5)
      expect(questions).not.toContain(
        expect.objectContaining({
          bestAnswerId: undefined,
        })
      )
    }
  })

  it('should be able to list all questions not completed', async () => {
    const response = await sut.execute({
      completed: false,
      page: 1,
    })

    if (response.isRight()) {
      const { questions } = response.result

      expect(questions).toHaveLength(5)
      expect(questions).not.toContain(
        expect.objectContaining({
          bestAnswerId: new UniqueEntityId('question-id'),
        })
      )
    }
  })
})
