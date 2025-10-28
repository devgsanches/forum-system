import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IAnswersRepository } from '../repositories/answers-repository'
import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteAnswerUseCaseRequest {
  id: UniqueEntityId
  authorId: UniqueEntityId
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteAnswerUseCase {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    id,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(id)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(id)

    return right({})
  }
}
