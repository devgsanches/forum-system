import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AnswerComment } from '../../enterprise/entities/answer-comment'
import type { IAnswersRepository } from '../repositories/answers-repository'
import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import type { IAnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface ListCommentsOnAnswerUseCaseRequest {
  answerId: UniqueEntityId
  page: number
}

type ListCommentsOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComments: AnswerComment[]
  }
>

export class ListCommentsOnAnswerUseCase {
  constructor(
    private answerCommentsRepository: IAnswerCommentsRepository,
    private answersRepository: IAnswersRepository
  ) {}

  async execute({
    answerId,
    page,
  }: ListCommentsOnAnswerUseCaseRequest): Promise<ListCommentsOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, { page })

    return right({ answerComments })
  }
}
