import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IPaginationParams } from '@/core/repositories/pagination-params'
import type { IAnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'
import type { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryAnswersRepository implements IAnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  ) {}

  async create(answer: Answer) {
    this.items.push(answer)

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findManyByQuestionId(
    questionId: UniqueEntityId,
    { page }: IPaginationParams
  ) {
    const answers = this.items
      .filter(item => item.questionId === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async findById(id: UniqueEntityId) {
    const answer = this.items.find(item => item.id === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async delete(id: UniqueEntityId) {
    await this.answerAttachmentsRepository.deleteManyByAnswerId(id)
    const answers = this.items.filter(item => item.id !== id)

    this.items = answers
  }
}
