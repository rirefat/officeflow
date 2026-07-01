/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialization of Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured.');
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Endpoint: Summarize Task & Suggest Subtasks
  app.post('/api/gemini/summarize-task', async (req: express.Request, res: express.Response) => {
    try {
      const { title, description } = req.body;
      if (!title) {
        res.status(400).json({ error: 'Task title is required.' });
        return;
      }

      const ai = getGeminiClient();
      const prompt = `You are an expert project manager. Analyze this task title and description, then provide a concise high-level summary and suggest a checklist of 3-5 concrete subtasks.
Task Title: "${title}"
Description: "${description || 'No description provided.'}"

Please return a valid JSON object strictly matching this schema:
{
  "summary": "Clear, professional 2-sentence summary.",
  "subtasks": ["Subtask Title 1", "Subtask Title 2", "Subtask Title 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error('Gemini summarize-task error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate task summary.' });
    }
  });

  // AI Endpoint: Suggest Fiverr Client Reply
  app.post('/api/gemini/suggest-reply', async (req: express.Request, res: express.Response) => {
    try {
      const { buyerName, gigTitle, requirements, currentStatus, lastMessages, replyTone } = req.body;
      if (!buyerName || !gigTitle) {
        res.status(400).json({ error: 'Buyer name and gig title are required.' });
        return;
      }

      const ai = getGeminiClient();
      const prompt = `You are an elite Fiverr digital agency communication manager. Write a professional, friendly, and highly polished message to our buyer "${buyerName}" regarding their order: "${gigTitle}".
Tone requested: "${replyTone || 'Professional & Reassuring'}"
Buyer Requirements: "${requirements || 'No special requirements detailed.'}"
Current Order Status / Progress: "${currentStatus || 'In Progress'}"
Last Messages exchanged: "${lastMessages || 'None'}"

Ensure the message addresses the details, sets clear expectations, mentions that we provide unlimited revisions, and outlines what is coming next. Keep the length concise, encouraging, and natural.

Return a valid JSON object matching this schema:
{
  "subject": "Brief subject/header of the update",
  "message": "The full body of the response message, including paragraph breaks. (Do not include mock placeholder emails, write as a direct Fiverr chat reply)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error('Gemini suggest-reply error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate client reply suggest.' });
    }
  });

  // AI Endpoint: Analyze Project Health & Workload Prediction
  app.post('/api/gemini/project-health-report', async (req: express.Request, res: express.Response) => {
    try {
      const { projects, companyName, companyFocus } = req.body;
      if (!projects || !Array.isArray(projects)) {
        res.status(400).json({ error: 'Projects list is required.' });
        return;
      }

      const ai = getGeminiClient();
      const prompt = `You are a high-level digital agency operational consultant. Analyze the following portfolio of projects for "${companyName || 'Our Agency'}" (${companyFocus || 'Digital Services'}):

${JSON.stringify(projects, null, 2)}

Provide an operational intelligence report containing:
1. Overall project health assessment
2. Main bottlenecks identified
3. Dynamic workload prediction (next 14 days)
4. Key recommendations for the Team Leads

Please return a valid JSON object strictly matching this schema:
{
  "overallAssessment": "Professional synthesis of the active project status.",
  "bottlenecks": ["Bottleneck item 1", "Bottleneck item 2"],
  "workloadForecast": "Description of resource allocation over the next 2 weeks.",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error('Gemini project-health-report error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate health report.' });
    }
  });

  // AI Endpoint: Chat Assistant / Helper
  app.post('/api/gemini/chat-helper', async (req: express.Request, res: express.Response) => {
    try {
      const { channelName, lastMessages, senderName } = req.body;
      const ai = getGeminiClient();

      const prompt = `You are the OfficeFlow virtual AI operational assistant. A team member named "${senderName || 'someone'}" is asking for help or needs a suggestion in our agency chat channel "#${channelName || 'general'}".
Here are the recent messages in this channel:
${JSON.stringify(lastMessages || [], null, 2)}

Draft an elegant, highly helpful, operational response that can be posted to the channel to help the team. Ensure it is insightful, references the project challenges appropriately, and provides quick, helpful directions.

Return a valid JSON object matching this schema:
{
  "suggestedResponse": "The text to post to the channel. Keep it under 4 sentences, professional, friendly, and practical."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error('Gemini chat-helper error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI suggestion.' });
    }
  });

  // Serve static assets in production, otherwise mount Vite in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OfficeFlow server is running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start OfficeFlow server:', err);
});
