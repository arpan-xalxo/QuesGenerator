import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import pdf from 'pdf-parse';

//sk-proj-YXWUAi8aDCoo2FLhAfJvT3BlbkFJtIGijPF8qPOgrWoomUsb
//nousresearch/nous-capybara-7b:free
//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

const OPENROUTER_API_KEY = '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';
const MAX_TOKENS = 4096;
const COMPLETION_TOKENS = 500;

function truncateText(text: string, maxTokens: number) {

  const words = text.split(' ');
  let truncatedText = '';
  let tokenCount = 0;

  for (const word of words) {
    // Estimate tokens (1 word ~ 1 token)
    const wordTokens = word.length / 4;
    if (tokenCount + wordTokens > maxTokens) break;
    truncatedText += word + ' ';
    tokenCount += wordTokens;
  }

  return truncatedText.trim();
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = `./uploads/${file.name}`;

    await writeFile(path, buffer);
    console.log(`Uploaded file saved at: ${path}`);

   
    const pdfData = await pdf(buffer);
    const fileContents = pdfData.text;

    

    if (!fileContents) {
      throw new Error('No text extracted from PDF');
    }

   
    const sections = fileContents.split('\n\n').filter(section => section.trim() !== '');
    const questions = [];


    for (let i = 0; i < 4; i++) {

      const section = sections[i % sections.length]; 
      const truncatedSection = truncateText(section, MAX_TOKENS - COMPLETION_TOKENS);

      const prompt = `Based on the following section, generate a concise question (no more than two lines):\n\n${truncatedSection}`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "nousresearch/nous-capybara-7b:free",
          messages: [{ role: 'user', content: prompt }],

        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API request failed with status ${response.status}: ${errorText}`);
        return NextResponse.json({ success: false, error: `API request failed: ${errorText}` });
      }

      const jsonResponse = await response.json();
     
      console.log('API Response:', jsonResponse);

      if (!jsonResponse.choices || jsonResponse.choices.length === 0) {
        console.error('No choices found in API response:', jsonResponse);
        return NextResponse.json({ success: false, error: 'No choices found in API response' });
      }

      const question = jsonResponse.choices[0].message.content?.trim();

      if (!question) {
        console.error('Question content is missing in API response:', jsonResponse);
        return NextResponse.json({ 
          success: false, 
          error: 'Question content is missing in API response' });
      }
      questions.push(question);

      console.log(`Generated question ${i + 1}:\n${question}\n`);
    }
    return NextResponse.json({ 
      success: true,
      
      questions });
  }
  catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ 
      success: false, 
      
      error: 'Failed to generate questions' });
  }

}

