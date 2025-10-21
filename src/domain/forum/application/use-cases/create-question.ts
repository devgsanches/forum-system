import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import type { IQuestionsRepository } from '../repositories/questions-repository'
import { right, type Either } from '@/core/either'

interface CreateQuestionUseCaseRequest {
  studentId: UniqueEntityId
  title: string
  content: string
}

type CreateQuestionUseCaseResponse = Either<
  undefined,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: IQuestionsRepository) {}

  async execute({
    studentId,
    title,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    // RN para permitir que somente um estudante possa criar uma pergunta
    const question = Question.create({
      studentId,
      title,
      content,
    })

    await this.questionsRepository.create(question)

    return right({ question })
  }
}
