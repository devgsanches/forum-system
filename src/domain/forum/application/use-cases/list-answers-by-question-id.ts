import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Answer } from '../../enterprise/entities/answer'
import type { IAnswersRepository } from '../repositories/answers-repository'
import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ListAnswersByQuestionUseCaseRequest {
  questionId: UniqueEntityId
  page: number
}

type ListAnswersByQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answers: Answer[]
  }
>

export class ListAnswersByQuestionUseCase {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    questionId,
    page,
  }: ListAnswersByQuestionUseCaseRequest): Promise<ListAnswersByQuestionUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
      }
    )

    if (!answers) {
      return left(new ResourceNotFoundError())
    }

    return right({ answers })
  }
}
