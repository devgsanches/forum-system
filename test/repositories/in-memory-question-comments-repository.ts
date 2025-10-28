import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IPaginationParams } from '@/core/repositories/pagination-params'
import type { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements IQuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async findManyByQuestionId(
    questionId: UniqueEntityId,
    { page }: IPaginationParams
  ) {
    const questionComments = this.items
      .filter(item => item.questionId === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async findById(id: UniqueEntityId) {
    const questionComment = this.items.find(item => item.id === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async delete(id: UniqueEntityId) {
    const questionComments = this.items.filter(item => item.id !== id)
    this.items = questionComments
  }
}
