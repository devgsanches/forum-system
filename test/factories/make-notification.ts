import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Notification,
  type NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId
) {
  const notification = Notification.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      recipientId: new UniqueEntityId(),
      ...override,
    },
    id
  )

  return notification
}
