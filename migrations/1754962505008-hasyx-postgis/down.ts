import dotenv from 'dotenv';
import { down } from '@/lib/postgis/down-postgis';

dotenv.config();

down();


