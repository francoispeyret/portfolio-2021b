if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

import '../styles/index.scss';
import './loading';
import './navigation';
import './homepage';
import './blog';
import './swiper';