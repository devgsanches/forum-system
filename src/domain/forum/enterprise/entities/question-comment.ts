import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import { Comment, type CommentProps } from './comment'
import { QuestionCommentCreatedEvent } from '../events/question-comment-created-event'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  // getters em todas as props, para termos acesso aos valores. (apenas leitura)

  get questionId(): UniqueEntityId {
    return this.props.questionId
  }

  get excerpt(): string {
    return this.content.substring(0, 60).trimEnd().concat('..')
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    const isNew = !id

    if (isNew) {
      questionComment.addDomainEvent(
        new QuestionCommentCreatedEvent(questionComment)
      )
    }

    return questionComment
  }
}
