import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Answer } from '../../enterprise/entities/answer'
import type { IAnswersRepository } from '../repositories/answers-repository'
import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import type { NotAllowedError } from './errors/not-allowed-error'

interface EditAnswerUseCaseRequest {
  id: UniqueEntityId
  authorId: UniqueEntityId
  content: string
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    id,
    authorId,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(id)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId) {
      throw new Error('Not allowed to edit this answer.')
    }

    answer.content = content ?? answer.content

    return right({ answer })
  }
}
