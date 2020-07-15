import { watchman } from '@osl-slack-bolt';
import logger from '@shared/Logger';

const listenMessageWithQuestions = () => {
  watchman.message('hello', async data => {
    logger.info(data);
  });
};

export default listenMessageWithQuestions;
