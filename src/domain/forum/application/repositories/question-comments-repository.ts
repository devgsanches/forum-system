import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IPaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionComment } from '../../enterprise/entities/question-comment'

export interface IQuestionCommentsRepository {
  findById(id: UniqueEntityId): Promise<QuestionComment | null>
  findManyByQuestionId(
    questionId: UniqueEntityId,
    params: IPaginationParams
  ): Promise<QuestionComment[]>
  create(questionComment: QuestionComment): Promise<void>
  delete(id: UniqueEntityId): Promise<void>
}
