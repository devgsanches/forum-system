import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { ListCommentsOnQuestionUseCase } from './list-comments-on-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('List Comments On Question UseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

  let sut: ListCommentsOnQuestionUseCase

  const question = makeQuestion()

  async function createTwentyTwoCommentsOnQuestion() {
    for (let i = 1; i <= 22; i++) {
      const newQuestionComment = makeQuestionComment({
        questionId: question.id,
      })
      await inMemoryQuestionCommentsRepository.create(newQuestionComment)
    }
    return
  }

  beforeEach(async () => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()

    await inMemoryQuestionsRepository.create(question)

    await createTwentyTwoCommentsOnQuestion()

    sut = new ListCommentsOnQuestionUseCase(
      inMemoryQuestionCommentsRepository,
      inMemoryQuestionsRepository
    ) // system under test
  })

  it('should be able to list comments on a question and must return the first 20 comments', async () => {
    const response = await sut.execute({
      page: 1,
      questionId: question.id,
    })

    if (response.isRight()) {
      const { questionComments } = response.result

      expect(questionComments).toHaveLength(20)
      expect(questionComments).not.toContain(
        expect.objectContaining({
          questionId: new UniqueEntityId('new-question-id'),
        })
      )
    }
  })
})
