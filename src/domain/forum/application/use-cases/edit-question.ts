import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import type { IQuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { left, right, type Either } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import type { IQuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface EditQuestionUseCaseRequest {
  id: UniqueEntityId
  studentId: UniqueEntityId
  title?: string
  content?: string
  attachmentsIds: UniqueEntityId[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: IQuestionsRepository,
    private questionAttachmentsRepository: IQuestionAttachmentsRepository
  ) {}

  async execute({
    id,
    studentId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(id)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (studentId !== question.studentId) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(question.id)

    // lista contendo todos os anexos da pergunta, a partir dela, consigo editar (update)
    const questionAttachmentsList = new QuestionAttachmentList(
      currentQuestionAttachments
    )

    // IDs de anexos que estou recebendo, faço um depara ao formato que espero dentro da minha WatchedList (question-attachment-list)
    const questionAttachments = attachmentsIds?.map(attachmentId =>
      QuestionAttachment.create({
        attachmentId,
        questionId: question.id,
      })
    )

    questionAttachmentsList.update(questionAttachments)

    question.title = title ?? question.title
    question.content = content ?? question.content
    question.attachments = questionAttachmentsList

    return right({ question })
  }
}
