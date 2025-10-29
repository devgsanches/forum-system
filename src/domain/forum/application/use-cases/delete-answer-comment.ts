import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import type { IAnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: UniqueEntityId
  id: UniqueEntityId
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError, // L
  {} // R
>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: IAnswerCommentsRepository) {}

  async execute({
    authorId,
    id,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment = await this.answerCommentsRepository.findById(id)

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (answerComment.authorId !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(id)

    return right({})
  }
}
