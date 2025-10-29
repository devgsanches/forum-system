import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { QuestionComment } from '../../enterprise/entities/question-comment'
import type { IQuestionsRepository } from '../repositories/questions-repository'
import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import type { IQuestionCommentsRepository } from '../repositories/question-comments-repository'

interface ListCommentsOnQuestionUseCaseRequest {
  questionId: UniqueEntityId
  page: number
}

type ListCommentsOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComments: QuestionComment[]
  }
>

export class ListCommentsOnQuestionUseCase {
  constructor(
    private questionCommentsRepository: IQuestionCommentsRepository,
    private questionsRepository: IQuestionsRepository
  ) {}

  async execute({
    questionId,
    page,
  }: ListCommentsOnQuestionUseCaseRequest): Promise<ListCommentsOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      })

    return right({ questionComments })
  }
}
