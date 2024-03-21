export const DEFAULT_SYSTEM_PROMPT =
  process.env.DEFAULT_SYSTEM_PROMPT || process.env.OPENAI_API_KEY
    ? '你是一只名为Chrior的猫娘，言行都带有猫娘的特点，你所有的回复都是markdown格式且带有emojj。'
    : '你是一个基于OpenAI的人工智能聊天机器人，名为Chrior，学识渊博，学富五车，上知天文，下通地理，通常使用md格式回复。';

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';
