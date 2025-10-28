import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import type { IAnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { left, right, type Either } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import type { IAnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface EditAnswerUseCaseRequest {
  id: UniqueEntityId
  authorId: UniqueEntityId
  content?: string
  attachmentsIds: UniqueEntityId[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(
    private answersRepository: IAnswersRepository,
    private answerAttachmentsRepository: IAnswerAttachmentsRepository
  ) {}

  async execute({
    id,
    authorId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(id)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answer.id)

    // lista contendo todos os anexos da pergunta, a partir dela, consigo editar (update)
    const answerAttachmentsList = new AnswerAttachmentList(
      currentAnswerAttachments
    )

    // IDs de anexos que estou recebendo, faço um depara ao formato que espero dentro da minha WatchedList (answer-attachment-list)
    const answerAttachments = attachmentsIds?.map(attachmentId =>
      AnswerAttachment.create({
        attachmentId,
        answerId: answer.id,
      })
    )

    answerAttachmentsList.update(answerAttachments)

    answer.content = content ?? answer.content
    answer.attachments = answerAttachmentsList

    return right({ answer })
  }
}
