import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentQuestionUseCase } from './create-question-comment'

describe('Comment Question UseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

  let sut: CommentQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new CommentQuestionUseCase(
      inMemoryQuestionCommentsRepository,
      inMemoryQuestionsRepository
    ) // system under test
  })

  it('should be able to comment a question', async () => {
    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    const response = await sut.execute({
      content: 'What is the title of the question?',
      questionId: question.id,
      authorId: new UniqueEntityId('author-01'),
    })

    if (response.isRight()) {
      const { questionComment } = response.result

      expect(inMemoryQuestionCommentsRepository.items[0]).toEqual(
        expect.objectContaining({
          id: questionComment.id,
          content: 'What is the title of the question?',
          questionId: question.id,
          authorId: questionComment.authorId,
        })
      )
    }
  })
})
