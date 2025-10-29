import { AggregateRoot } from '../entities/aggregate-root'
import type { UniqueEntityId } from '../entities/unique-entity-id'
import type { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

// eventos serão classes que implementam a interface DomainEvent (base class)
class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    // poderia ser qualquer agregado > ex: Question, Answer, etc.
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    /*
      SPY CONCEPT > uma função vazia que me retorna informações (se foi chamada ou não | pode ser usado para testes)
      O test aqui é: quando os eventos pendentes daquele agregado são disparados, a função callbackSpy deve ser chamada
    */

    const callbackSpy = vi.fn()

    // register > registra um subscriber (callback - first argument) para um determinado evento (second argument)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // adiciono um evento à lista de eventos *pendentes* daquele agregado | ainda não disparou o evento
    const aggregate = CustomAggregate.create()

    // estou assegurando que o evento foi criado porém NÃO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // disparo os eventos pendentes daquele agregado | eventos são disparados com seus listeners (cada register)
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // o subscriber ouve o evento e faz o que precisa ser feito | nesse caso, chama a função callbackSpy
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
