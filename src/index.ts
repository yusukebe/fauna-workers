import { Hono } from 'hono';
import { Client, fql, ServiceError } from 'fauna';

type Bindings = {
	FAUNA_SECRET: string;
};

type Variables = {
	faunaClient: Client;
};

type Product = {
	id: string;
	serialNumber: number;
	title: string;
	weightLbs: number;
	quantity: number;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', async (c, next) => {
	const faunaClient = new Client({
		secret: c.env.FAUNA_SECRET,
	});
	c.set('faunaClient', faunaClient);
	await next();
});

app.post('/products', async (c) => {
	const { serialNumber, title, weightLbs } = await c.req.json<Product>();
	const query = fql`Products.create({
		serialNumber: ${serialNumber},
		title: ${title},
		weightLbs: ${weightLbs},
		quantity: 0
	})`;
	const result = await c.get('faunaClient').query<Product>(query);
	return c.json(result.data);
});

app.get('/products/:productId', async (c) => {
	const productId = c.req.param('productId');
	const query = fql`Products.byId(${productId})`;
	const result = await c.get('faunaClient').query<Product>(query);
	return c.json(result.data);
});

app.delete('/products/:productId', async (c) => {
	const productId = c.req.param('productId');
	const query = fql`Products.byId(${productId})!.delete()`;
	const result = await c.get('faunaClient').query<Product>(query);
	return c.json(result.data);
});

app.patch('/products/:productId/add-quantity', async (c) => {
	const productId = c.req.param('productId');
	const { quantity } = await c.req.json<{ quantity: number }>();
	const query = fql`Products.byId(${productId}){ quantity : .quantity + ${quantity}}`;
	const result = await c.get('faunaClient').query<Product>(query);
	return c.json(result.data);
});

app.onError((e, c) => {
	if (e instanceof ServiceError) {
		return c.json(
			{
				status: e.httpStatus,
				code: e.code,
				message: e.message,
			},
			e.httpStatus
		);
	}
	console.trace(e);
	return c.text('Internal Server Error', 500);
});

export default app;
