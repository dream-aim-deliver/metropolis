import { HTTPRequest } from '@/lib/sdk/http'
import { Headers } from 'node-fetch'
import { Readable } from 'stream'
import { Response } from 'node-fetch'
import fetchMock from 'jest-fetch-mock'

/**
 * Represents a mock HTTP request endpoint.
 */
export interface MockEndpoint extends HTTPRequest {
  /**
   * A string that the URL must end with to match this endpoint.
   */
  endsWith?: string | null

  /**
   * A string that the URL must include to match this endpoint.
   */
  includes?: string | null

  /**
   * The response to send when this endpoint is matched.
   */
  response: MockGatewayResponse
}

/**
 * Represents a mock HTTP response from the Gateway.
 */
export type MockGatewayResponse = {
  /**
   * The HTTP status code to return in the response.
   */
  status: number

  /**
   * The headers to include in the response.
   */
  headers: Headers | { [key: string]: string } | null

  /**
   * The body of the response.
   */
  body: string | Readable | null
}

/**
 * A factory for creating mock HTTP servers.
 */
export default class MockServerFactory {
  /**
   * A valid authentication token used by the Mock Server.
   */
  static VALID_AUTH_TOKEN: string = 'ddmlab-askdjljioj'

  /**
   * The host URL for the Mock server.
   */
  static HOST: string = 'https://my-host.com'

  /**
   * Creates a mock server with the specified endpoints.
   * @param checkAuth Whether to check the authentication token for each request.
   * @param endpoints The endpoints to match against incoming requests.
   */
  static createMockServer(checkAuth: boolean = true, endpoints: MockEndpoint[]) {
    // @ts-ignore
    fetchMock.mockIf(/^https?:\/\/my-host.com.*$/, req => {
      if (checkAuth) {
        const authToken = req.headers.get('Authorization')
        if (authToken !== MockServerFactory.VALID_AUTH_TOKEN) {
          return Promise.resolve(
            new Response('Invalid Auth Token', {
              status: 401,
            }),
          )
        }
      }
      const endpoint = endpoints.find(endpoint => {
        if (endpoint.url === req.url && endpoint.method === req.method) {
          return true
        }
        if (endpoint.endsWith && req.url.endsWith(endpoint.endsWith) && endpoint.method === req.method) {
          return true
        }
        if (endpoint.includes && req.url.includes(endpoint.includes) && endpoint.method === req.method) {
          return true
        }
        return false
      })
      if (!endpoint) {
        return Promise.resolve({
          status: 404,
          body: JSON.stringify('Not found'),
        } as MockGatewayResponse)
      }
      return Promise.resolve(endpoint.response)
    })
  }
}
