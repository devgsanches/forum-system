import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import { Comment, type CommentProps } from './comment'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  // getters em todas as props, para termos acesso aos valores. (apenas leitura)

  get answerId(): UniqueEntityId {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const answerComment = new AnswerComment({
      props: {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    })

    return answerComment
  }
}
