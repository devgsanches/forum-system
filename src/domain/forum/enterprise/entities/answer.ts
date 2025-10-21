import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export interface AnswerProps {
  content: string
  questionId: UniqueEntityId
  authorId: UniqueEntityId
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {
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

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  // os métodos getters permitem que possamos acessar props da Entidade, que nem estão declaradas na interface.
  // é como se criássemos uma propriedade virtual, que não existe na interface, mas que podemos acessar.

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...')
  } // resumo da resposta

  /* para os setters, crio SOMENTE para as props que fazem sentido serem alteradas. Aqui neste caso, é somente o content.
  Porém, quando usuario atualiza o conteudo da sua resposta, tenho que marcar que aquela resposta em si recebeu atualização.
  Então, crio um setter (método) que altera o updatedAt daquela resposta com a data atual.
  */

  private hasUpdated() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.hasUpdated()
  }

  static create(
    props: Optional<AnswerProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const answer = new Answer({
      props: {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    })

    return answer
  }
}
