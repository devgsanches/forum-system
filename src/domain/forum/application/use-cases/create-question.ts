import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import type { IQuestionsRepository } from '../repositories/questions-repository'
import { right, type Either } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface CreateQuestionUseCaseRequest {
  studentId: UniqueEntityId
  title: string
  content: string
  attachmentsIds: UniqueEntityId[]
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
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    // RN para permitir que somente um estudante possa criar uma pergunta
    const question = Question.create({
      studentId,
      title,
      content,
    })

    const questionAttachments = attachmentsIds?.map(attachmentId =>
      QuestionAttachment.create({
        attachmentId,
        questionId: question.id,
      })
    )

    // utilizando setter
    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionsRepository.create(question)

    return right({ question })
  }
}
