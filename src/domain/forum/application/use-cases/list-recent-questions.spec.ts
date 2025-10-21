import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ListRecentQuestionsUseCase } from './list-recent-questions'
import { makeQuestion } from 'test/factories/make-question'

describe('List Recent Questions UseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: ListRecentQuestionsUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new ListRecentQuestionsUseCase(inMemoryQuestionsRepository) // system under test
  })

  it('should be able to list recent questions', async () => {
    for (let i = 1; i <= 20; i++) {
      await inMemoryQuestionsRepository.create(
        makeQuestion({
          createdAt: new Date('2023-06-14T12:00:00Z'),
        })
      )
      return
    }

    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date('2025-10-17T09:00:00-03:00'),
      })
    )

    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date('2025-10-17T09:00:00-03:00'),
      })
    )

    const response = await sut.execute({
      page: 1,
    })

    if (response.isRight()) {
      const { questions } = response.result

      expect(questions).toHaveLength(20)
      expect(inMemoryQuestionsRepository.items[0].createdAt).toEqual(
        new Date('2025-10-17T09:00:00-03:00')
      )
      expect(inMemoryQuestionsRepository.items[1].createdAt).toEqual(
        new Date('2025-10-17T09:00:00-03:00')
      )
      expect(inMemoryQuestionsRepository.items[2].createdAt).toEqual(
        new Date('2023-06-14T12:00:00Z')
      )
    }
  })
})
