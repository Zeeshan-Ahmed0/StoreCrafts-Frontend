import React from 'react'

export default function ProductPage({ params }: { params: { category: string; product: string } }) {
	const { product } = params || { product: 'Product' };
	return (
		<div>
			<h1 className="text-3xl font-bold mb-4">Product: {product}</h1>
			<p>Product detail page for {product}</p>
		</div>
	);
}

