import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
    Student,
    type StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { faker } from '@faker-js/faker'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityId
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      ...override,
    },
    id
  )

  return student
}
