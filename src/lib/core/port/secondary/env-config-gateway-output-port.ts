export default interface EnvConfigGatewayOutputPort {
  /**
   * Returns the value of the environment variable with the given key if it exists. Returns undefined otherwise.
   * p.s. There is no special Data Transfer Object (DTO) for this use case.
   * @param key The key of the environment variable
   * @param required If true, throws an {@link ConfigNotFound} error if the environment variable does not exist
   * @returns The value of the environment variable with the given key if it exists. Returns undefined if environment variable is not required and does not exist.
   * @throws {@link ConfigNotFound} if the environment variable does not exist and required is true
   */
  get(key: string, required?: boolean): Promise<string | undefined>
}
