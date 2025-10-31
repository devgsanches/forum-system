import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event'
import type { SendNotificationUseCase } from '../use-cases/send-notification'
import type { IAnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import type { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import type { IQuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionsRepository: IQuestionsRepository,
    private questionCommentsRepository: IQuestionCommentsRepository,
    private SendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  // cria/registra o subscriber > setupSubscriptions
  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentNotification.bind(this), // bind(this) para garantir que essa função será chamada com o contexto correto | o this aqui é essa classe | OnQuestionCommentCreated
      QuestionCommentCreatedEvent.name
    )
  }

  // não é apenas um método execute, pois posso ter mais de um subscriber registrado para o mesmo evento (criação de uma resposta).
  private async sendNewQuestionCommentNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    if (!questionComment) return

    const question = await this.questionsRepository.findById(
      questionComment.questionId
    )

    const comment = await this.questionCommentsRepository.findById(
      questionComment.id
    )

    if (question && comment) {
      const response = await this.SendNotification.execute({
        recipientId: question.studentId,
        title: `Novo comentário em "${question.title.substring(0, 20)}"`,
        content: `${questionComment.excerpt}`,
      })

      if (response.isRight()) {
        const { notification } = response.result
        console.log(notification)
      }
    }
  }
}
