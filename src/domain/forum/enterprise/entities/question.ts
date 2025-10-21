import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Slug } from './value-objects/slug'
import { Entity } from '@/core/entities/entity'
import type { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'

export interface QuestionProps {
  studentId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  title: string
  content: string
  slug: Slug
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
  get studentId(): UniqueEntityId {
    return this.props.studentId
  }

  get bestAnswerId(): UniqueEntityId | undefined {
    return this.props.bestAnswerId
  }

  get title(): string {
    return this.props.title
  }

  get content(): string {
    return this.props.content
  }

  get slug(): Slug {
    return this.props.slug
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  // os métodos getters permitem que possamos acessar props da Entidade, que nem estão declaradas na interface.
  // é como se criássemos uma propriedade virtual, que não existe na interface, mas que podemos acessar.

  get isNew(): boolean {
    return dayjs().diff(this.props.createdAt, 'days') <= 3
    // retorna true se a resposta for criada há menos ou a exatos 3 dias, false caso contrário.
  }

  // setters

  private hasUpdated() {
    this.props.updatedAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.hasUpdated()
  }

  set content(content: string) {
    this.props.content = content
    this.hasUpdated()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId) {
    this.props.bestAnswerId = bestAnswerId
    this.hasUpdated()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug'>,
    id?: UniqueEntityId
  ) {
    const question = new Question({
      props: {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        slug: props.slug ?? Slug.createFromText(props.title),
      },
      id,
    })

    return question
  }
}
