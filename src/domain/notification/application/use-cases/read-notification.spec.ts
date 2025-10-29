import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeNotification } from 'test/factories/make-notification'
import type { Notification } from '../../enterprise/entities/notification'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

describe('Read Notification UseCase', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: ReadNotificationUseCase
  let notification: Notification

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    inMemoryNotificationsRepository.create(
      makeNotification({
        recipientId: new UniqueEntityId('recipient-01'),
      })
    )

    notification = inMemoryNotificationsRepository.items[0]

    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository) // system under test
  })

  it('should be able to read a notification', async () => {
    const response = await sut.execute({
      notificationId: notification.id,
      recipientId: notification.recipientId,
    })

    expect(response.isRight()).toBe(true)

    // type assertion
    if (response.isRight()) {
      const { notification } = response.result

      expect(notification.readAt).toEqual(expect.any(Date))
    }
  })

  it('should not be able to read a notification from another user', async () => {
    const response = await sut.execute({
      notificationId: notification.id,
      recipientId: new UniqueEntityId('recipient-02'),
    })

    expect(response.isLeft()).toBe(true)

    if (response.isLeft()) {
      expect(response.reason).toBeInstanceOf(NotAllowedError)
    }
  })
})
