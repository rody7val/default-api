module.exports = {
  db: process.env.MONGO_DB || 'mongodb://localhost:27017/default-api',
  TOKEN_SECRET: process.env.TOKEN_SECRET || "tokenultrasecreto",
  WEBMAIL_EMAIL: process.env.WEBMAIL_EMAIL || null,
  WEBMAIL_PASSWORD: process.env.WEBMAIL_PASSWORD || null,
  port: process.env.PORT || 3000,
  raiz: __dirname
}
