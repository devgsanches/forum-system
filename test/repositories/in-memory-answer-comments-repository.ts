import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'
import type { IPaginationParams } from '@/core/repositories/pagination-params'
import type { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements IAnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)

    DomainEvents.dispatchEventsForAggregate(answerComment.id)
  }

  async findManyByAnswerId(
    answerId: UniqueEntityId,
    { page }: IPaginationParams
  ) {
    const answerComments = this.items
      .filter(item => item.answerId === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async findById(id: UniqueEntityId) {
    const answerComment = this.items.find(item => item.id === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async delete(id: UniqueEntityId) {
    const answerComments = this.items.filter(item => item.id !== id)
    this.items = answerComments
  }
}
