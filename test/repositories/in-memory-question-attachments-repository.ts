import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IPaginationParams } from '@/core/repositories/pagination-params'
import type { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import type { IQuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements IQuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: UniqueEntityId) {
    const questionAttachments = this.items.filter(
      item => item.questionId === questionId
    )

    return questionAttachments
  }

  async deleteManyByQuestionId(questionId: UniqueEntityId) {
    const items = this.items.filter(
      item => item.questionId.toString() !== questionId.toString()
    )

    this.items = items
  }
}
