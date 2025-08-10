import { z } from 'zod';

export const dockerHubSchema = z.object({
  username: z.string().min(1, 'Please enter a valid Docker Hub username').describe('Docker Hub Username (DOCKERHUB_USERNAME)'),
  password: z.string().min(1, 'Please enter a valid Docker Hub password/token').describe('Docker Hub Password/Token (DOCKERHUB_PASSWORD)'),
}).meta({
  type: 'dockerhub-config',
  title: 'Docker Hub Credentials',
  description: 'Credentials for publishing images from CI and for local docker run.',
  envMapping: {
    username: 'DOCKERHUB_USERNAME',
    password: 'DOCKERHUB_PASSWORD'
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
  descriptionTemplate: (data: any) => data?.username || 'no username'
});




