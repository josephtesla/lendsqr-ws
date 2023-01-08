import app from './app'
import { logger } from './logger'
import { config } from './config'

const port = config.port || 5000
app.listen(port, () => {
  logger.info(`Server running on port: ${port}`)
})
