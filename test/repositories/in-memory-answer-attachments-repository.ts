import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements IAnswerAttachmentsRepository
{
  
  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: UniqueEntityId) {
    const answerAttachments = this.items.filter(
      item => item.answerId === answerId
    )

    return answerAttachments
  }

  async deleteManyByAnswerId(answerId: UniqueEntityId): Promise<void> {
    const items = this.items.filter(
      item => item.answerId.toString() !== answerId.toString()
    )

    this.items = items
  }
}
