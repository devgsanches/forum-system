import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'
import type { Question } from '../entities/question'

export class ChooseBestAnswerEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question

  constructor(question: Question) {
    this.question = question
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.question.id
  }
}
