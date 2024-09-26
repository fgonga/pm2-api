require('dotenv').config();
const express = require('express');
const pm2 = require('pm2');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = process.env.PORT || 3000;
const serverIp = process.env.SERVER_IP || 'localhost';
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'PM2 Manager API',
      version: '1.0.0',
      description: 'API to manage processes with PM2',
    },
    servers: [
      {
        url: `http://${serverIp}:${port}`,
      },
    ],
  },
  apis: ['./server.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

const connectToPm2 = () => {
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

/**
 * @swagger
 * /processes:
 *   get:
 *     summary: List all processes managed by PM2
 *     responses:
 *       200:
 *         description: List of processes
 */
app.get('/processes', async (req, res) => {
  try {
    await connectToPm2();
    pm2.list((err, processList) => {
      pm2.disconnect();
      if (err) {
        res.status(500).json({ status: 'error', message: 'Error listing processes' });
      } else {
        res.status(200).json({ status: 'success', data: processList });
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error connecting to PM2' });
  }
});

/**
 * @swagger
 * /start:
 *   post:
 *     summary: Start a new application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               script:
 *                 type: string
 *               params:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Process started successfully
 *       500:
 *         description: Error starting process
 */
app.post('/start', async (req, res) => {
  const { script, params, name } = req.body;
  const processName = name || `srv-${uuidv4()}`;

  try {
    await connectToPm2();
    pm2.start(
      {
        script,
        args: params,
        name: processName,
        exec_mode: 'fork',
      },
      (err, process) => {
        pm2.disconnect();
        if (err) {
          res.status(500).json({ status: 'error', message: 'Error starting process' });
        } else {
          res.status(200).json({ status: 'success', message: 'Process started successfully', data: process });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error connecting to PM2' });
  }
});

/**
 * @swagger
 * /delete:
 *   post:
 *     summary: Delete an application using UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Process deleted successfully
 *       500:
 *         description: Error deleting process
 */
app.post('/delete', async (req, res) => {
  const { uuid } = req.body;

  try {
    await connectToPm2();
    pm2.delete(uuid, (err) => {
      pm2.disconnect();
      if (err) {
        res.status(500).json({ status: 'error', message: 'Error deleting process' });
      } else {
        res.status(200).json({ status: 'success', message: 'Process deleted successfully' });
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error connecting to PM2' });
  }
});

/**
 * @swagger
 * /stop:
 *   post:
 *     summary: Stop an application using UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Process stopped successfully
 *       500:
 *         description: Error stopping process
 */
app.post('/stop', async (req, res) => {
  const { uuid } = req.body;

  try {
    await connectToPm2();
    pm2.stop(uuid, (err) => {
      pm2.disconnect();
      if (err) {
        res.status(500).json({ status: 'error', message: 'Error stopping process' });
      } else {
        res.status(200).json({ status: 'success', message: 'Process stopped successfully' });
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error connecting to PM2' });
  }
});

/**
 * @swagger
 * /restart:
 *   post:
 *     summary: Restart an application using UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Process restarted successfully
 *       500:
 *         description: Error restarting process
 */
app.post('/restart', async (req, res) => {
  const { uuid } = req.body;

  try {
    await connectToPm2();
    pm2.restart(uuid, (err) => {
      pm2.disconnect();
      if (err) {
        res.status(500).json({ status: 'error', message: 'Error restarting process' });
      } else {
        res.status(200).json({ status: 'success', message: 'Process restarted successfully' });
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error connecting to PM2' });
  }
});

/**
 * @swagger
 * /status/{uuid}:
 *   get:
 *     summary: Monitor the status of a process using UUID
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         description: UUID of the process
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Process description
 *       500:
 *         description: Error retrieving process status
 */
app.get('/status/:uuid', async (req, res) => {
  const { uuid } = req.params;

  try {
    await connectToPm2();
    pm2.describe(uuid, (err, processDescription) => {
      pm2.disconnect();
      if (err) {
        res.status(500).json({ status: 'error', message: 'Error retrieving process status' });
      } else {
        res.status(200).json({ status: 'success', data: processDescription });
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error connecting to PM2' });
  }
});

app.listen(port, () => {
  console.log(`PM2 management API running on port ${port}`);
});
