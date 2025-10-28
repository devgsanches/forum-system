import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import type { IAnswersRepository } from '../repositories/answers-repository'
import { right, type Either } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerQuestionUseCaseRequest {
  content: string
  questionId: UniqueEntityId
  authorId: UniqueEntityId
  attachmentsIds: UniqueEntityId[]
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
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      questionId,
      authorId,
    })

    const answerAttachments = attachmentsIds.map(attachmentId =>
      AnswerAttachment.create({
        attachmentId,
        answerId: answer.id,
      })
    )

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
