import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IPaginationParams } from '@/core/repositories/pagination-params'
import type { IQuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'
import type { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'

export class InMemoryQuestionsRepository implements IQuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  ) {}

  async create(question: Question) {
    this.items.push(question)
  }

  async findManyByCompleted({ page }: IPaginationParams) {
    const questions = this.items
      .filter(item => item.bestAnswerId)
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async findManyByNotCompleted({ page }: IPaginationParams) {
    const questions = this.items
      .filter(item => item.bestAnswerId === undefined)
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async findManyRecent({ page }: IPaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20) // ordena as questões por data de criação, da mais recente para a mais antiga

    return questions
  }

  async findById(id: UniqueEntityId) {
    const question = this.items.find(item => item.id.toString() === id.toString())

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find(item => item.slug.value === slug)
    if (!question) {
      return null
    }

    return question
  }

  async delete(id: UniqueEntityId) {
    await this.questionAttachmentsRepository.deleteManyByQuestionId(id)
    const items = this.items.filter(item => item.id.toString() !== id.toString())

    this.items = items

    return items
  }
}
