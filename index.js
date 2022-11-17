const puppeteer = require("puppeteer");
const { Wallet } = require("ethers");

const generate_wallet = () => {
	const newWallet = Wallet.createRandom();
	return newWallet._mnemonic().phrase;
};

const toAddress = "gitopia13afylm67lml25xau3musz8sdpp08sgkk6s78wg";
const value = "9.999828";
(async () => {
	const browser = await puppeteer.launch({
		headless: true,
		timeout: 999999,
		args: [
			"--proxy-server=socks5://127.0.0.1:9050",
			// Use proxy for localhost URLs
			"--proxy-bypass-list=<-loopback>",
		],
	});
	const page = await browser.newPage();
	await page.goto("https://gitopia.com/login", { waitUntil: "networkidle2" });
	const selector = ".flex .flex-col .gap-2";

	await page.waitForSelector(selector);
	await page.evaluate((resultSelector) => {
		const btns = [
			...document
				.querySelector(resultSelector)
				.querySelectorAll("button"),
		];
		btns.forEach((item) => {
			if (item.children[1].textContent === "Recover exisiting wallet") {
				item.click();
			}
		});
	}, selector);

	await page.type('[name="mnemonic"]', generate_wallet());
	await page.evaluate(() => {
		const btns = [...document.querySelectorAll("button")];

		btns.forEach((item) => {
			if (item.textContent === "Recover") item.click();
		});
	});

	await page.waitForSelector('[name="wallet_password"]');
	await page.type('[name="wallet_password"]', "fuckforme");
	await page.type('[name="wallet_confirm_password"]', "fuckforme");
	await page.evaluate(() => {
		const btns = [...document.querySelectorAll("button")];

		btns.forEach((item) => {
			if (item.textContent === "Recover") item.click();
		});
	});

	await page.waitForSelector(
		'[class="sm:flex bg-box-grad-tl bg-base-200 px-4 py-8 justify-between items-center rounded-md mb-8"]'
	);
	setTimeout(async () => {
		await page.evaluate(() => {
			const btns = [...document.querySelectorAll("button")];

			btns.forEach((item) => {
				if (item.textContent === "Get TLORE") item.click();
			});
		});
		setTimeout(async () => {
			await page.evaluate(() => {
				const btns = [
					...document.querySelectorAll('button[tabIndex="0"]'),
				];
				btns.forEach((item) => {
					item.click();
				});

				const li = [...document.querySelectorAll("li")];
				li.forEach((item) => {
					if (item.children[0].textContent === "Send TLORE")
						item.children[0].click();
				});
			});
			await page.waitForSelector('[name="toAddress"]');
			await page.type('[name="toAddress"]', toAddress);
			await page.type('[name="amount"]', value);

			await page.evaluate(() => {
				const btns = [...document.querySelectorAll("button")];

				btns.forEach((item) => {
					if (item.textContent === "Send") item.click();
				});
			});
		}, 30000);
	}, 5000);
})();
