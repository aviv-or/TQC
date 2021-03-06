import Express from 'express'
import expressWinston from 'express-winston'
import winston from 'winston'
import bodyParser from 'body-parser'
import router from 'lib/router'
import api from './api'
import {kModuleDidLoad} from '../bus/constants'

export default (scope, callback) => {
  const {config, bus} = scope
  const app = new Express()

  app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') {
      res.send(200)
    } else {
      next()
    }
  })

  app.use(bodyParser.json({limit: '50mb'}))

  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: false,
        colorize: true
      })
    ],
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: () => false
  }))

  app.listen(config.port, error => {
    if (error) {
      scope.logger.log(error)
    } else {
      scope.logger.log(`PQC node started, listen on port: ${config.port}`)
    }
  })

  bus.on(kModuleDidLoad, () => {
    router(api, scope)
  })

  callback(null, app)
}
