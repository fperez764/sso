'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function NoAuthPage() {
	const router = useRouter();
	useEffect(() => {
		router.push('/sube/pagos');
	  })
	return (
		<div>
			<h1>Loading...</h1>
		</div>
	);
};

