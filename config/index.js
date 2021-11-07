import dotenv from 'dotenv'

dotenv.config()

export const{
    APP_PORT,
    DB_URL,
    DEBUG_MODE,
    JWT_SECRET,
    REFRESH_SECRET,
    APP_URL,
    STRIPE_SECRET_KEY,
    STRIPE_API_KEY


} = process.env;
