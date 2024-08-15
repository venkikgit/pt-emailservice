import app from './app.js';
import { Config } from './utils/index.js';
import { logger } from './utils/logger.js';
const startServer = () => {
    try {
        app.listen(Config.PORT, () => {
            logger.debug('Hello');
            logger.info('Starting server on port ' + Config.PORT);
            // console.log('listening on port', Config.PORT);
        });
    } catch (err) {
        if (err instanceof Error) {
            logger.error(err.message);
            process.exit(1);
        }
    }
};
startServer();
