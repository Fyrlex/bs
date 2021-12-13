import { FastifyReply, FastifyRequest } from 'fastify';

export function notFound(req: FastifyRequest, res: FastifyReply): unknown {
  return res.status(404).send({
    error: true,
    message: `The requested endpoint '${req.url}' was not found.`
  });
}