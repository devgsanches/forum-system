import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export interface IQuestionAttachmentsRepository {
  findManyByQuestionId(
    questionId: UniqueEntityId
  ): Promise<QuestionAttachment[]>
  deleteManyByQuestionId(questionId: UniqueEntityId): Promise<void>
}
