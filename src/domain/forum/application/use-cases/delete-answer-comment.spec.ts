import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

describe('Delete Answer Comment UseCase', () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let sut: DeleteAnswerCommentUseCase
  let answerComment: AnswerComment

  answerComment = makeAnswerComment(
    {
      authorId: new UniqueEntityId('author-01'),
      answerId: new UniqueEntityId('answer-01'),
    },
    new UniqueEntityId('answer-comment-01')
  )

  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository) // system under test
  })

  it('should be able delete a answer comment', async () => {
    inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId,
      id: answerComment.id,
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able delete a answer comment', async () => {
    inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      authorId: new UniqueEntityId('author-02'),
      id: answerComment.id,
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.reason).toBeInstanceOf(NotAllowedError)
    }
  })
})
