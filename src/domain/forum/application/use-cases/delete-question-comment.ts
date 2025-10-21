import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import type { IQuestionCommentsRepository } from '../repositories/question-comments-repository'
import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteQuestionCommentUseCaseRequest {
  authorId: UniqueEntityId
  id: UniqueEntityId
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionCommentUseCase {
  constructor(
    private questionCommentsRepository: IQuestionCommentsRepository
  ) {}

  async execute({
    authorId,
    id,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.questionCommentsRepository.findById(id)

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (questionComment.authorId !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(id)

    return right({})
  }
}
