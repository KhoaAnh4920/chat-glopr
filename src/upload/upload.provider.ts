import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';
export const UploadProvider = {
  provide: CLOUDINARY,
  useFactory: (): any => {
    return v2.config({
      cloud_name: 'dpo9d3otr',
      api_key: '276166454661876',
      api_secret: 'ytJh3zH34MvWzOzKTK9eGxfrF-o',
    });
  },
};
