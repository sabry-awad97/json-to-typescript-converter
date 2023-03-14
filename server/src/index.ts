import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { Logger, createLogger, transports } from 'winston';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import compression from 'compression';

interface ConvertRequest {
  value: string;
}

interface ConvertResponse {
  message: string;
  response?: string;
}

dotenv.config();

const app = express();
const logger: Logger = createLogger({
  level: 'info',
  transports: [new transports.Console()],
});

// Use middleware for parsing requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use middleware for handling CORS
app.use(cors());

// Use middleware for handling response compression
app.use(compression());

// Use a router for organizing routes
const router = express.Router();

// Input validation schema
const convertRequestSchema = z.object({
  value: z.unknown().refine(
    value => {
      try {
        JSON.parse(value as string);
        return true;
      } catch (e) {
        return false;
      }
    },
    {
      message: 'Value must be a valid JSON string',
    }
  ),
});

// Cache for storing generated TypeScript interfaces
const cache = new NodeCache({ stdTTL: 3600 });

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 requests per minute
});

router.post<{}, ConvertResponse, ConvertRequest>(
  '/convert',
  limiter,
  async (req, res) => {
    try {
      const { value } = convertRequestSchema.parse(req.body);
      const cachedResponse = cache.get<string>(value as string);
      if (cachedResponse) {
        logger.info(`Found cached response for ${value}`);
        return res.json({
          message: 'Successful',
          response: cachedResponse,
        });
      }

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY!,
      });

      const openai = new OpenAIApi(configuration);

      const prompt = `Write Typescript interfaces for the given JSON object. \n ${value} \n`;
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      const response = completion.data.choices[0].message?.content;
      if (!response) {
        throw new Error('Failed to generate response from OpenAI API');
      }

      cache.set(value as string, response);

      res.json({
        message: 'Successful',
        response,
      });
    } catch (err: any) {
      logger.error(err.stack);
      res.status(400).json({
        message: err.message || 'Invalid request',
      });
    }
  }
);

app.use('/api', router);

// Use middleware for handling errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
  });
});

// Use environment variables for configuration
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
});
