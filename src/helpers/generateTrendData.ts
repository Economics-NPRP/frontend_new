export const generateTrendData = ({
	points = 30,
	trend = 'linear', // Options: 'linear' or 'exponential'
	noise = 0.1, // Noise level: 0 (no noise) to 1 (high noise)
	base = 10, // Starting Y value
	growth = 1.05, // Growth factor for exponential trend
	slope = 1, // Slope for linear trend
	label = 'Series 1',
}) => {
	const data = [];

	for (let i = 0; i < points; i++) {
		let y;

		if (trend === 'linear') {
			y = base + slope * i;
		} else if (trend === 'exponential') {
			y = base * Math.pow(growth, i);
		} else {
			throw new Error("Trend must be 'linear' or 'exponential'");
		}

		// Apply random noise
		const noiseFactor = 1 + (Math.random() * 2 - 1) * noise;
		y *= noiseFactor;

		data.push({
			x: i,
			[label]: parseFloat(y.toFixed(2)),
		});
	}

	return data;
};
