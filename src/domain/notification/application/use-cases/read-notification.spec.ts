import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeNotification } from 'test/factories/make-notification'
import type { Notification } from '../../enterprise/entities/notification'

describe('Read Notification UseCase', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: ReadNotificationUseCase
  let notification: Notification

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    inMemoryNotificationsRepository.create(
      makeNotification({
        recipientId: new UniqueEntityId('1'),
      })
    )

    notification = inMemoryNotificationsRepository.items[0]

    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository) // system under test
  })

  it('should be able to read a notification', async () => {
    const response = await sut.execute({
      notificationId: notification.id,
      userId: notification.recipientId,
    })

    expect(response.isRight()).toBe(true)

    // type assertion
    if (response.isRight()) {
      const { notification } = response.result

      expect(notification.readAt).toEqual(expect.any(Date))
    }
  })
})
