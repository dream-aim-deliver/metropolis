import 'reflect-metadata'
import StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port'
import StreamingGateway from '../../sdk/streaming-gateway'
import { Container, interfaces } from 'inversify'
import { IronSession } from 'iron-session'
import { NextApiResponse } from 'next'
import CONTROLLERS from './ioc-symbols-controllers'
import INPUT_PORT from './ioc-symbols-input-port'
import USECASE_FACTORY from './ioc-symbols-usecase-factory'
import GATEWAYS from './ioc-symbols-gateway'
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port'
import EnvConfigGateway from '../gateway/env-config-gateway'
import { loadFeaturesSync } from '@/lib/sdk/ioc-helpers'
import ArangoDBRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-repository-output-port'
import ArangoDBRepository from '../repository/arangodb-repository'
import REPOSITORY from './ioc-symbols-repository'
import ArangoDBCollectionRepositoryOutputPort from '@/lib/core/port/secondary/arangodb-collection-repository-output-port'
import ArangoDBCollectionRepository from '../repository/arangodb-collection-repository'

/**
 * IoC Container configuration for the application.
 */
const appContainer = new Container()

/** GATEWAYS */
appContainer.bind<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG).to(EnvConfigGateway)
appContainer.bind<StreamGatewayOutputPort>(GATEWAYS.STREAM).to(StreamingGateway)

/** REPOSITORIES */
appContainer.bind<ArangoDBRepositoryOutputPort>(REPOSITORY.ARANGODB).to(ArangoDBRepository)
appContainer.bind<ArangoDBCollectionRepositoryOutputPort>(REPOSITORY.ARANGODB_COLLECTION).to(ArangoDBCollectionRepository)


export default appContainer
