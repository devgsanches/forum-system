import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import type { IAnswersRepository } from '../repositories/answers-repository'
import type { Question } from '../../enterprise/entities/question'
import type { IQuestionsRepository } from '../repositories/questions-repository'
import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

interface ChooseBestAnswerUseCaseRequest {
  studentId: UniqueEntityId
  answerId: UniqueEntityId
}

type ChooseBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseBestAnswerUseCase {
  constructor(
    private questionsRepository: IQuestionsRepository,
    private answersRepository: IAnswersRepository
  ) {}

  async execute({
    studentId,
    answerId,
  }: ChooseBestAnswerUseCaseRequest): Promise<ChooseBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionsRepository.findById(answer.questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    // somente o autor da pergunta pode selecionar a melhor resposta
    if (studentId !== question.studentId) {
      return left(new NotAllowedError())
    }

    // set
    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
