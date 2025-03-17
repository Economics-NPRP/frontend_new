'use client';

import { useState } from 'react';

import classes from './styles.module.css';

export default function Testing() {
	const [color, setColor] = useState('pink');

	return (
		<>
			<h1 className={classes.title}>Hello world</h1>
			<p className={classes.description}>ets description</p>
			<p className="text-red tracking-widest">Tailwind</p>
			<p style={{ color: color }}>Dynamic Text</p>

			<button onClick={() => setColor('purple')}>Change Color</button>
		</>
	);
}
