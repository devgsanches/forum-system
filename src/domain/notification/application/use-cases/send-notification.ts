import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '../../enterprise/entities/notification'
import type { INotificationsRepository } from '../repositories/notifications-repository'
import { right, type Either } from '@/core/either'

interface SendNotificationUseCaseRequest {
  title: string
  content: string
  recipientId: UniqueEntityId
}

type SendNotificationUseCaseResponse = Either<
  undefined,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: INotificationsRepository) {}

  async execute({
    title,
    content,
    recipientId,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      title,
      content,
      recipientId,
    })

    await this.notificationsRepository.create(notification)

    return right({ notification })
  }
}
