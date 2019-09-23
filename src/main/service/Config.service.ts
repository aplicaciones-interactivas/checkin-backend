import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'local')
        .default('local'),
      API_PORT: Joi.number().default(3000),
      API_AUTH_ENABLED: Joi.boolean().required(),
      DB_DIALECT: Joi.string().required(),
      DB_HOST: Joi.string().default('localhost'),
      DB_PORT: Joi.number().required(),
      DB_USER: Joi.string().required(),
      DB_PASSWORD: Joi.string(),
      DB: Joi.string().required(),
      DB_SYNCHRO: Joi.boolean().default(false),
      JWT_SECRET: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get getEnvConfig() {
    return this.envConfig;
  }
}
