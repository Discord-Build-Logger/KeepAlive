console.log("Beginning KeepAlive!");

const {
	API_URL,
	API_ACCESS_KEY,
	SCRAPE_CANARY_EVERY = "15",
	SCRAPE_PTB_EVERY = "15",
	SCRAPE_STABLE_EVERY = "15",
} = process.env as {
	API_URL: string;
	API_ACCESS_KEY: string;
	SCRAPE_CANARY_EVERY: string;
	SCRAPE_PTB_EVERY: string;
	SCRAPE_STABLE_EVERY: string;
};

if (!API_URL || !API_ACCESS_KEY) {
	throw new Error("API_URL and API_KEY must be provided");
}

async function scrape(releaseChannel: string) {
	const url = new URL(API_URL);
	url.searchParams.set("authorization", API_ACCESS_KEY);
	url.searchParams.set("release_channel", releaseChannel);

	const response = await fetch(url.toString());

	// consume the body
	await response.text().catch(() => {});

	return response.ok;
}

const channels = [
	{
		channel: "stable",
		every: Number.parseInt(SCRAPE_STABLE_EVERY) * 1000,
	},
	{
		channel: "ptb",
		every: Number.parseInt(SCRAPE_PTB_EVERY) * 1000,
	},
	{
		channel: "canary",
		every: Number.parseInt(SCRAPE_CANARY_EVERY) * 1000,
	},
];

for (const { channel, every } of channels) {
	setInterval(async () => {
		const success = await scrape(channel);

		console.log(`Scraped ${channel} with success: ${success}`);
	}, every);
}
