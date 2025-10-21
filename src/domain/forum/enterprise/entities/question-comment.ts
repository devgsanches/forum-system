import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import { Comment, type CommentProps } from './comment'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  // getters em todas as props, para termos acesso aos valores. (apenas leitura)

  get questionId(): UniqueEntityId {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const questionComment = new QuestionComment({
      props: {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    })

    return questionComment
  }
}
