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

  async findById(id: UniqueEntityId) {
    const notification = this.items.find(item => item.id === id)

    if (!notification) {
      return null
    }

    return notification
  }
}
