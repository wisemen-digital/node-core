import { PrimaryColumn, Column, Entity } from 'typeorm'
import { JobState } from './job-state.enum.js'

@Entity({ name: 'job', schema: 'pgboss', synchronize: false })
export abstract class Job<T> {
  @PrimaryColumn('uuid', { name: 'id' })
  uuid: string

  @Column('text')
  name: string

  @Column('int')
  priority: number

  @Column('jsonb', { nullable: true })
  data: T | null

  @Column({
    type: 'enum',
    enum: JobState
  })
  state: JobState

  @Column('int', { name: 'retry_limit' })
  retryLimit: number

  @Column('int', { name: 'retry_count' })
  retryCount: number

  @Column('int', { name: 'retry_delay' })
  retryDelay: number

  @Column('boolean', { name: 'retry_backoff' })
  retryBackoff: boolean

  @Column('timestamp', { name: 'start_after' })
  startAfter: Date

  @Column('timestamp', { name: 'started_on', nullable: true })
  startedAt: Date | null

  @Column('text', { name: 'singleton_key', nullable: true })
  singletonKey: string | null

  @Column('timestamp', { name: 'created_on' })
  createdAt: Date

  @Column('timestamp', { name: 'completed_on', nullable: true })
  completedAt: Date | null

  @Column('jsonb', { nullable: true })
  output: object | null
}
