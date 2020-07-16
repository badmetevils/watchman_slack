import './LoadEnv'; // Must be the first import
import Init from '@bin/init';

(async () => {
  const app = new Init();
  await app.connect();
  await app.start();
})();
