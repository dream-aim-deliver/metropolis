export default interface EnvConfigGatewayOutputPort {
  /**
   * Returns the value of the environment variable with the given key if it exists. Returns undefined otherwise.
   * p.s. There is no special Data Transfer Object (DTO) for this use case.
   * @param key The key of the environment variable
   * @returns The value of the environment variable with the given key if it exists. Returns undefined if environment variable does not exist.
   */
  get(key: string): string | undefined

  /**
   * Returns the configuration for ArangoDB
   * @returns The configuration for ArangoDB
   * @throws {@link InvalidConfig} if the configuration is invalid
   */
  arangoDBConfig(): { URL: string; PORT: number; DATABASE: string; USERNAME: string; PASSWORD: string; ROOT_PASSWORD: string }
}
