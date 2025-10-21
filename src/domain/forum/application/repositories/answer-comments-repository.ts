import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IPaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface IAnswerCommentsRepository {
  findById(id: UniqueEntityId): Promise<AnswerComment | null>
  findManyByAnswerId(
    answerId: UniqueEntityId,
    params: IPaginationParams
  ): Promise<AnswerComment[]>
  create(answerComment: AnswerComment): Promise<void>
  delete(id: UniqueEntityId): Promise<void>
}
