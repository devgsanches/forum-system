import { right, type Either } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import type { IQuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ListQuestionsUseCaseRequest {
  page: number
  completed?: boolean
}

type ListQuestionsUseCaseResponse = Either<
  undefined,
  {
    questions: Question[]
  }
>

export class ListQuestionsUseCase {
  constructor(private questionsRepository: IQuestionsRepository) {}

  async execute({
    page,
    completed,
  }: ListQuestionsUseCaseRequest): Promise<ListQuestionsUseCaseResponse> {
    if (completed) {
      const questions = await this.questionsRepository.findManyByCompleted({
        page,
      })

      return right({
        questions,
      })
    }

    const questions = await this.questionsRepository.findManyByNotCompleted({
      page,
    })

    return right({ questions })
  }
}
