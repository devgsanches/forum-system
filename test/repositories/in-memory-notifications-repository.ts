import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

import type { INotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import type { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements INotificationsRepository
{
  public items: Notification[] = []

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification) {
    const notificationIndex = this.items.findIndex(
      item => item.id.toString() === notification.id.toString()
    )

    if (notificationIndex >= 0) {
      this.items[notificationIndex] = notification
    }
  }

  async findById(id: UniqueEntityId) {
    const notification = this.items.find(item => item.id === id)

    if (!notification) {
      return null
    }

    return notification
  }
}
