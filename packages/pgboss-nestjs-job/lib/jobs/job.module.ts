import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { JobRegistry } from './job.registry.js'

@Module({
  imports: [
    DiscoveryModule
  ],
  providers: [
    JobRegistry
  ],
  exports: [
    JobRegistry
  ]
})
export class JobModule {}
