import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Student } from '@/domain/forum/enterprise/entities/student'

export interface IStudentsRepository {
  findById(id: UniqueEntityId): Promise<Student | null>
  create(student: Student): Promise<void>
  delete(id: UniqueEntityId): Promise<Student[]>
}
