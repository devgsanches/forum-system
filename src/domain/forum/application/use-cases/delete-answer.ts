import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Answer } from '../../enterprise/entities/answer'
import type { IAnswersRepository } from '../repositories/answers-repository'
import { right, type Either } from '@/core/either'

interface DeleteAnswerUseCaseRequest {
  id: UniqueEntityId
}

type DeleteAnswerUseCaseResponse = Either<
  undefined,
  {
    answers: Answer[]
  }
>

export class DeleteAnswerUseCase {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    id,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answers = await this.answersRepository.delete(id)

    return right({ answers })
  }
}
