import { createRouter, useBase } from 'h3';
import home from '~/server/controllers';

const router = createRouter();

router.get('/home', home.index);

export default useBase('/api', router.handler);
