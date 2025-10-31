import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event'
import type { SendNotificationUseCase } from '../use-cases/send-notification'
import type { IAnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import type { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: IAnswersRepository,
    private answerCommentsRepository: IAnswerCommentsRepository,
    private SendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  // cria/registra o subscriber > setupSubscriptions
  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this), // bind(this) para garantir que essa função será chamada com o contexto correto | o this aqui é essa classe | OnAnswerCommentCreated
      AnswerCommentCreatedEvent.name
    )
  }

  // não é apenas um método execute, pois posso ter mais de um subscriber registrado para o mesmo evento (criação de uma resposta).
  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    if (!answerComment) return

    const answer = await this.answersRepository.findById(answerComment.answerId)

    const comment = await this.answerCommentsRepository.findById(
      answerComment.id
    )

    if (answer && comment) {
      const response = await this.SendNotification.execute({
        recipientId: answer.authorId,
        title: `Novo comentário em "${answer.content.substring(0, 20)}"`,
        content: `${answerComment.excerpt}`,
      })

      if (response.isRight()) {
        const { notification } = response.result
        console.log(notification)
      }
    }
  }
}
