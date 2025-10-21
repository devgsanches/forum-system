import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import type { QuestionComment } from '../../enterprise/entities/question-comment'
import { NotAllowedError } from './errors/not-allowed-error'

describe('Delete Question Comment UseCase', () => {
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let sut: DeleteQuestionCommentUseCase
  let questionComment: QuestionComment

  questionComment = makeQuestionComment(
    {
      authorId: new UniqueEntityId('author-01'),
      questionId: new UniqueEntityId('question-01'),
    },
    new UniqueEntityId('question-comment-01')
  )

  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository) // system under test
  })

  it('should be able delete a question comment', async () => {
    inMemoryQuestionCommentsRepository.create(questionComment)

    await sut.execute({
      authorId: questionComment.authorId,
      id: questionComment.id,
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able delete a question comment', async () => {
    inMemoryQuestionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      authorId: new UniqueEntityId('author-02'),
      id: questionComment.id,
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.reason).toBeInstanceOf(NotAllowedError)
    }
  })
})
