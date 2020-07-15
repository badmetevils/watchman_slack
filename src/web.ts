import { WebClient } from '@slack/web-api';

const token = process.env.LEGACY_SLACK_BOT_TOKEN;

// Initialize
const web = new WebClient(token);

export { web as watchmanWEB };
