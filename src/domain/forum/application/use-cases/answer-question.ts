import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import type { IAnswersRepository } from '../repositories/answers-repository'
import { right, type Either } from '@/core/either'

interface AnswerQuestionUseCaseRequest {
  content: string
  questionId: UniqueEntityId
  authorId: UniqueEntityId
}

type AnswerQuestionUseCaseResponse = Either<
  undefined,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    content,
    questionId,
    authorId,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      questionId,
      authorId,
    })

    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
