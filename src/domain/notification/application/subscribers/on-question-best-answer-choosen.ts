import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import { ChooseBestAnswerEvent } from '@/domain/forum/enterprise/events/question-best-answer-choosen-event'
import type { SendNotificationUseCase } from '../use-cases/send-notification'
import type { IAnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

export class OnChooseBestAnswer implements EventHandler {
  constructor(
    private answersRepository: IAnswersRepository,
    private SendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  // cria/registra o subscriber > setupSubscriptions
  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewBestAnswerNotification.bind(this), // bind(this) para garantir que essa função será chamada com o contexto correto | o this aqui é essa classe | OnChooseBestAnswer
      ChooseBestAnswerEvent.name
    )
  }

  // não é apenas um método execute, pois posso ter mais de um subscriber registrado para o mesmo evento (criação de uma resposta).
  private async sendNewBestAnswerNotification({
    question,
  }: ChooseBestAnswerEvent) {
    if (!question.bestAnswerId) return

    const answer = await this.answersRepository.findById(question.bestAnswerId)

    if (question && answer) {
      const response = await this.SendNotification.execute({
        recipientId: answer.authorId,
        title: `Parabéns! Sua resposta resolveu o problema.`,
        content: `A resposta "${answer.excerpt}" foi escolhida como a melhor para a pergunta "${question.title.substring(0, 20)}".`,
      })

      if (response.isRight()) {
        const { notification } = response.result
        console.log(notification)
      }
    }
  }
}
