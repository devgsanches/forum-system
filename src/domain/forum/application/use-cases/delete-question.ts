import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IQuestionsRepository } from '../repositories/questions-repository'
import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

interface DeleteQuestionUseCaseRequest {
  id: UniqueEntityId
  studentId: UniqueEntityId
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: IQuestionsRepository) {}

  async execute({
    id,
    studentId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(id)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.studentId !== studentId) {
      return left(new NotAllowedError())
    }

    await this.questionsRepository.delete(id)

    return right({})
  }
}
