import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import type { IQuestionsRepository } from '../repositories/questions-repository'
import { right, type Either } from '@/core/either'

interface DeleteQuestionUseCaseRequest {
  id: UniqueEntityId
}

type DeleteQuestionUseCaseResponse = Either<
  undefined,
  {
    questions: Question[]
  }
>

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: IQuestionsRepository) {}

  async execute({
    id,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const questions = await this.questionsRepository.delete(id)

    return right({ questions })
  }
}
