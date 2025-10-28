import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Send Notification UseCase', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: SendNotificationUseCase

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new SendNotificationUseCase(inMemoryNotificationsRepository) // system under test
  })

  it('should be able to send a notification', async () => {
    const response = await sut.execute({
      recipientId: new UniqueEntityId('1'),
      title: 'Title',
      content: 'Content',
    })

    expect(response.isRight()).toBe(true)
    // type assertion
    if (response.isRight()) {
      const { notification } = response.result

      expect(notification).toMatchObject(
        expect.objectContaining({
          id: notification.id,
          recipientId: new UniqueEntityId('1'),
          title: 'Title',
          content: 'Content',
        })
      )
    }
  })
})
