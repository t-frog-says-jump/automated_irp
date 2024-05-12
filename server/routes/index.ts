import { IRouter } from '../../../../src/core/server';
import { SERVER_SEARCH_ROUTE_PATH } from '../../common';
import { schema } from '@osd/config-schema';


export function defineRoutes(router: IRouter) {
  const validate = {
      params: schema.object({
      password: schema.string(),
    }),
  };

  router.get(
    {
      path: SERVER_SEARCH_ROUTE_PATH,
      validate
    },
    async (context, request, response) => {
      try {
        const object = await context.core.savedObjects.client.create(
          'shuffle_auth',
          {
            title: 'data to shuffle auth',
            indexPattern: 'shuffle_auth',
            password: request.params.password
          },
          { references: [
              { id: '...', type: 'index_pattern', name: 'shuffle_auth' },
            ]
          }
        )
        return response.ok({
          body: JSON.stringify(object),
          headers: {
            'content-type': 'application/json'
          }
        });
      }
      catch {
        return response.internalError();
      }
    }
  );
}
