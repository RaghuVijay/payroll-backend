import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  adminUrl: process.env.AXIOS_PARKING_ADMIN_HOST,
}));
