import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import type { IQuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { left, right, type Either } from '@/core/either'

interface EditQuestionUseCaseRequest {
  id: UniqueEntityId
  studentId: UniqueEntityId
  title?: string
  content?: string
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(private questionsRepository: IQuestionsRepository) {}

  async execute({
    id,
    studentId,
    title,
    content,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(id)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (studentId !== question.studentId) {
      return left(new NotAllowedError())
    }

    question.title = title ?? question.title
    question.content = content ?? question.content

    return right({ question })
  }
}
