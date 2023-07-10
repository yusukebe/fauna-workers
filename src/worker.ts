import { Hono } from 'hono';
import faunadb from 'faunadb';
import { getFaunaError } from './utils';

const { Create, Collection, Get, Ref, Delete, Add, Select, Let, Var, Update } = faunadb.query;

type Bindings = {
	FAUNA_SECRET: string;
};

type Variables = {
	faunaClient: faunadb.Client;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', async (c, next) => {
	const faunaClient = new faunadb.Client({
		secret: c.env.FAUNA_SECRET,
	});
	c.set('faunaClient', faunaClient);
	await next();
});

app.onError((e, c) => {
	const faunaError = getFaunaError(e);
	if (faunaError) {
		return c.json(faunaError, faunaError?.status);
	}
	return c.text('Internal Server Error', 500);
});

app.post('/products', async (c) => {
	const { serialNumber, title, weightLbs } = await c.req.json();
	const result = await c.get('faunaClient').query<{
		ref: {
			id: string;
		};
	}>(
		Create(Collection('Products'), {
			data: {
				serialNumber,
				title,
				weightLbs,
				quantity: 0,
			},
		})
	);
	return c.json({
		productId: result.ref.id,
	});
});

app.get('/products/:productId', async (c) => {
	const productId = c.req.param('productId');
	const result = await c.get('faunaClient').query(Get(Ref(Collection('Products'), productId)));
	return c.json(result);
});

app.delete('/products/:productId', async (c) => {
	const productId = c.req.param('productId');
	const result = await c.get('faunaClient').query(Delete(Ref(Collection('Products'), productId)));
	return c.json(result);
});

app.patch('/products/:productId/add-quantity', async (c) => {
	const productId = c.req.param('productId');
	const { quantity } = await c.req.json();
	const result = await c.get('faunaClient').query(
		Let(
			{
				productRef: Ref(Collection('Products'), productId),
				productDocument: Get(Var('productRef')),
				currentQuantity: Select(['data', 'quantity'], Var('productDocument')),
			},
			Update(Var('productRef'), {
				data: {
					quantity: Add(Var('currentQuantity'), quantity),
				},
			})
		)
	);
	return c.json(result);
});

export default app;
