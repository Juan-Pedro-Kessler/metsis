
import express from 'express';
import { routes } from './api/routes';

import { log } from './infra/logger';
import { eventBus } from './core/events/EventBus';

const app = express();
app.use(express.json());
app.use(routes);


// Observer demo
eventBus.on('PaymentCaptured', async (e)=> log.info({ msg: 'Send email: payment captured', ...e }));
eventBus.on('PaymentRefunded', async (e)=> log.info({ msg: 'Send email: payment refunded', ...e }));

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, ()=> console.log(`API on http://localhost:${port}`));

export default app;
