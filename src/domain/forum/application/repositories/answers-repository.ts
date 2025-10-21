import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IPaginationParams } from '@/core/repositories/pagination-params'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'

export interface IAnswersRepository {
  findById(id: UniqueEntityId): Promise<Answer | null>
  findManyByQuestionId(
    questionId: UniqueEntityId,
    params: IPaginationParams
  ): Promise<Answer[]>
  create(answer: Answer): Promise<void>
  delete(id: UniqueEntityId): Promise<Answer[]>
}
