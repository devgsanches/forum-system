import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IPaginationParams } from '@/core/repositories/pagination-params'
import type { Question } from '@/domain/forum/enterprise/entities/question'

export interface IQuestionsRepository {
  findBySlug(slug: string): Promise<Question | null>
  findById(id: UniqueEntityId): Promise<Question | null>
  findManyByCompleted(params: IPaginationParams): Promise<Question[]>
  findManyByNotCompleted(params: IPaginationParams): Promise<Question[]>
  findManyRecent(params: IPaginationParams): Promise<Question[]>
  create(question: Question): Promise<void>
  save(question: Question): Promise<void>
  delete(id: UniqueEntityId): Promise<Question[]>
}
