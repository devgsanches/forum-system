import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerCreatedEvent } from '../events/answer-created-event'

export interface AnswerProps {
  content: string
  questionId: UniqueEntityId
  authorId: UniqueEntityId
  attachments: AnswerAttachmentList
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
  // getters em todas as props, para termos acesso aos valores. (apenas leitura)
  get content(): string {
    return this.props.content
  }

  get questionId(): UniqueEntityId {
    return this.props.questionId
  }

  get authorId(): UniqueEntityId {
    return this.props.authorId
  }

  get attachments(): AnswerAttachmentList {
    return this.props.attachments
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  // os métodos getters permitem que possamos acessar props da Entidade, que nem estão declaradas na interface.
  // é como se criássemos uma propriedade virtual, que não existe na interface, mas que podemos acessar.

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('..')
  } // resumo da resposta

  /* para os setters, crio SOMENTE para as props que fazem sentido serem alteradas. Aqui neste caso, é somente o content.
  Porém, quando usuario atualiza o conteudo da sua resposta, tenho que marcar que aquela resposta em si recebeu atualização.
  Então, crio um setter (método) que altera o updatedAt daquela resposta com a data atual.
  */

  private hasUpdated() {
    this.props.updatedAt = new Date()
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments
    this.hasUpdated()
  }

  set content(content: string) {
    this.props.content = content
    this.hasUpdated()
  }

  static create(
    props: Optional<AnswerProps, 'attachments' | 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList([]),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
    const isNewAnswer = !id

    // garanto que é uma *nova* Answer
    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}
