import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Question } from '../../enterprise/entities/question'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'

describe('Get Question By Slug UseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let question: Question
  let sut: GetQuestionBySlugUseCase

  beforeEach(async () => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository) // system under test

    question = makeQuestion({
      slug: Slug.createFromText('example-question-slug'),
    })

    await inMemoryQuestionsRepository.create(question)
  })

  it('should be able to get a question by slug', async () => {
    const response = await sut.execute({
      slug: 'example-question-slug',
    })

    if (response.isRight()) {
      const { question } = response.result

      expect(question).toMatchObject(
        expect.objectContaining({
          id: question.id,
          slug: expect.objectContaining({ value: 'example-question-slug' }),
        })
      )
    }
  })
})
