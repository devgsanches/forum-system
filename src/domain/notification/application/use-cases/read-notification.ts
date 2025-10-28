import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '../../enterprise/entities/notification'
import type { INotificationsRepository } from '../repositories/notifications-repository'
import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'

interface ReadNotificationUseCaseRequest {
  notificationId: UniqueEntityId
  userId: UniqueEntityId
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: INotificationsRepository) {}

  async execute({
    notificationId,
    userId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (notification.recipientId.toString() !== userId.toString()) {
      return left(new NotAllowedError())
    }

    notification.readAt = new Date()

    await this.notificationsRepository.save(notification)

    return right({ notification })
  }
}
