import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { right, type Either } from '@/core/either'
import type { IAnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface CommentAnswerUseCaseRequest {
  authorId: UniqueEntityId
  answerId: UniqueEntityId
  content: string
}

type CommentAnswerUseCaseResponse = Either<
  undefined,
  {
    answerComment: AnswerComment
  }
>

export class CommentAnswerUseCase {
  constructor(private answerCommentsRepository: IAnswerCommentsRepository) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentAnswerUseCaseRequest): Promise<CommentAnswerUseCaseResponse> {
    const answerComment = AnswerComment.create({
      authorId,
      answerId,
      content,
    })

    await this.answerCommentsRepository.create(answerComment)

    return right({ answerComment })
  }
}
