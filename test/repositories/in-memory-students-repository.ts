import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { IStudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import type { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements IStudentsRepository {
  public items: Student[] = []

  async create(student: Student) {
    this.items.push(student)
  }

  async findById(id: UniqueEntityId) {
    const student = this.items.find(item => item.id === id)

    if (!student) {
      return null
    }

    return student
  }

  async delete(id: UniqueEntityId) {
    const students = this.items.filter(item => item.id !== id)

    this.items = students

    return students
  }
}
