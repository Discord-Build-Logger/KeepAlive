console.log("Beginning KeepAlive!");

const { API_URL, API_ACCESS_KEY } = process.env as {
	API_URL: string;
	API_ACCESS_KEY: string;
};

if (!API_URL || !API_ACCESS_KEY) {
	throw new Error("API_URL and API_KEY must be provided");
}

async function scrape(releaseChannel: string) {
	const url = new URL(API_URL);
	url.searchParams.set("authorization", API_ACCESS_KEY);
	url.searchParams.set("release_channel", releaseChannel);
	url.searchParams.set("wait", "false");

	const response = await fetch(url.toString());

	return response.ok;
}

const channels = [
	{
		channel: "stable",
		every: 30_000, // 30 seconds
	},
	{
		channel: "ptb",
		every: 15_000, // 15 seconds
	},
	{
		channel: "canary",
		every: 15_000, // 15 seconds
	},
];

for (const { channel, every } of channels) {
	setInterval(async () => {
		const success = await scrape(channel);

		console.log(`Scraped ${channel} with success: ${success}`);
	}, every);
}
