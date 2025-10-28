import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export interface IAnswerAttachmentsRepository {
  findManyByAnswerId(
    answerId: UniqueEntityId
  ): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answerId: UniqueEntityId): Promise<void>
}
