import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Notification } from '@/domain/notification/enterprise/entities/notification'

export interface INotificationsRepository {
  create(notification: Notification): Promise<void>
  save(notification: Notification): Promise<void>
  findById(id: UniqueEntityId): Promise<Notification | null>
}
