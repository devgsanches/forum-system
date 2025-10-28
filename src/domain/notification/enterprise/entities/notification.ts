import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export interface NotificationProps {
  title: string
  content: string
  recipientId: UniqueEntityId
  createdAt: Date
  readAt?: Date
}

export class Notification extends Entity<NotificationProps> {
  // getters em todas as props, para termos acesso aos valores. (apenas leitura)

  get title(): string {
    return this.props.title
  }

  get content(): string {
    return this.props.content
  }

  get recipientId(): UniqueEntityId {
    return this.props.recipientId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get readAt(): Date | undefined {
    return this.props.readAt
  }

  // os métodos getters permitem que possamos acessar props da Entidade, que nem estão declaradas na interface.
  // é como se criássemos uma propriedade virtual, que não existe na interface, mas que podemos acessar.

  get excerpt(): string {
    return this.content.substring(0, 40).trimEnd().concat('...')
  } // resumo da notificação

  /* para os setters, crio SOMENTE para as props que fazem sentido serem alteradas. Aqui neste caso, é somente o content.
  Porém, quando usuario atualiza o conteudo da sua resposta, tenho que marcar que aquela resposta em si recebeu atualização.
  Então, crio um setter (método) que altera o updatedAt daquela resposta com a data atual.
  */

  set readAt(readAt: Date) {
    this.props.readAt = readAt
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return notification
  }
}
