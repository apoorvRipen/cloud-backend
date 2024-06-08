import cors from 'cors';
import express from 'express';
import { createServer, Server } from 'http';
import morgan from 'morgan';

const PORT = Number(process.env.PORT) || 3000;
const HOST: string = String(process.env.HOST || '0.0.0.0');

const appLoader = async (app: express.Express, router: any) =>
  new Promise<any>(resolve => {
    const server: Server = createServer(app);
    app.use(
      cors({
        origin: true
      })
    );
    app.use(
      express.json({
        limit: '10mb'
      })
    );
    app.use(
      express.urlencoded({
        extended: true
      })
    );
    app.use(morgan('dev'));
    app.use('/api', router);
    app.use((req, res) => {
      res.status(404)
      .send({
        success: false,
        data: undefined,
        message: 'the resource you are looking for is not found.'
      });
    });
    server.listen(PORT , HOST, async () => {
      console.log(`* App is running at PORT: ${PORT} *`);
      resolve(true);
    });
  });

export { appLoader };
