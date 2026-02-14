import React from 'react'

export default function CategoryPage({ params }: { params: { category: string } }) {
	const { category } = params || { category: 'Category' };
	return (
		<div>
			<h1 className="text-3xl font-bold mb-4">Shop: {category}</h1>
			<p>Category listing for {category}</p>
		</div>
	);
}

