import { z } from 'zod';

export const dockerHubSchema = z.object({
  username: z.string().min(1, 'Please enter a valid Docker Hub username').describe('Docker Hub Username (DOCKERHUB_USERNAME)'),
  password: z.string().min(1, 'Please enter a valid Docker Hub password/token').describe('Docker Hub Password/Token (DOCKERHUB_PASSWORD)'),
  image: z.string().min(1, 'Please enter a valid Docker image name (e.g., username/app)').describe('Docker Image name to publish and run (DOCKER_IMAGE_NAME)'),
}).meta({
  type: 'dockerhub-config',
  title: 'Docker Hub Credentials',
  description: 'Credentials and target image for publishing images from CI and for docker-compose app service.',
  envMapping: {
    username: 'DOCKERHUB_USERNAME',
    password: 'DOCKERHUB_PASSWORD',
    image: 'DOCKER_IMAGE_NAME'
  }
});

export const dockerHubs = z.record(
  z.string(),
  dockerHubSchema,
).meta({
  data: 'dockerhub',
  type: 'keys',
  default: ['default'],
  add: dockerHubSchema,
  descriptionTemplate: (data: any) => data?.image || data?.username || 'no username'
});




