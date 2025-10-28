import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Slug } from './value-objects/slug'
import type { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import type { QuestionAttachment } from './question-attachment'
import { QuestionAttachmentList } from './question-attachment-list'

export interface QuestionProps {
  studentId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  title: string
  content: string
  slug: Slug
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
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

  get attachments(): QuestionAttachmentList {
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

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.hasUpdated()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityId
  ) {
    const question = new Question(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList([]),
      },
      id
    )

    return question
  }
}
