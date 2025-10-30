import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import type { IQuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import type { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: IQuestionsRepository,
    private SendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  // cria o subscriber > setupSubscriptions
  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this), // bind(this) para garantir que essa função será chamada com o contexto correto | o this aqui é essa classe | OnAnswerCreated
      AnswerCreatedEvent.name
    )
  }

  // não é apenas um método execute, pois posso ter mais de um subscriber registrado para o mesmo evento (criação de uma resposta).
  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(answer.questionId)

    if (question) {
      const response = await this.SendNotification.execute({
        recipientId: question.studentId,
        title: `Nova resposta em "${question.title.substring(0, 40).trimEnd().concat('..')}"`,
        content: answer.excerpt,
      })

      if (response.isRight()) {
        const { notification } = response.result
        console.log(notification)
      }
    }
  }
}
