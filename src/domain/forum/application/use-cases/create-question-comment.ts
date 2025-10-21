import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import type {
  IQuestionCommentsRepository
} from '../repositories/question-comments-repository'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import type { IQuestionsRepository } from '../repositories/questions-repository'
import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CommentQuestionUseCaseRequest {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
}

type CommentQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentQuestionUseCase {
  constructor(
    private questionCommentsRepository: IQuestionCommentsRepository,
    private questionsRepository: IQuestionsRepository
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentQuestionUseCaseRequest): Promise<CommentQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId,
      questionId,
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({ questionComment })
  }
}
