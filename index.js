const puppeteer = require("puppeteer");
const { Wallet } = require("ethers");
const { exec } = require("child_process");
const fs = require("fs/promises");
const generate_wallet = () => {
	const newWallet = Wallet.createRandom();
	return newWallet._mnemonic().phrase;
};

const toAddress = "gitopia13afylm67lml25xau3musz8sdpp08sgkk6s78wg";
const value = "9.999828";

const start = () => {
	exec("service tor reload");
	return new Promise(async (resolve, reject) => {
		setTimeout(async () => {
			const browser = await puppeteer.launch({
				headless: true,
				timeout: 999999,
				args: [
					"--no-sandbox",
					"--proxy-server=socks5://127.0.0.1:9050",
					// Use proxy for localhost URLs
					"--proxy-bypass-list=<-loopback>",
				],
			});
			try {
				const page = await browser.newPage();
				await page.goto("https://api.ipify.org/");
				const original_ip = await page.evaluate(() => {
					return document.querySelector("body").children[0].innerHTML;
				});
				console.log("Original IP: " + original_ip);
				await page.goto("https://gitopia.com/login", {
					waitUntil: "networkidle2",
				});
				const selector = ".flex .flex-col .gap-2";

				await page.waitForSelector(selector);
				await page.evaluate((resultSelector) => {
					const btns = [
						...document
							.querySelector(resultSelector)
							.querySelectorAll("button"),
					];
					btns.forEach((item) => {
						if (
							item.children[1].textContent ===
							"Recover exisiting wallet"
						) {
							item.click();
						}
					});
				}, selector);
				const mnemonic = generate_wallet();
				await page.type('[name="mnemonic"]', mnemonic);
				const mnelast = await fs.readFile("mnemonic.txt", {
					encoding: "utf-8",
				});
				console.log(JSON.parse(mnelast).length);
				await fs.writeFile(
					"mnemonic.txt",
					JSON.stringify([...JSON.parse(mnelast), mnemonic]),
					{
						encoding: "utf-8",
					}
				);
				await page.evaluate(() => {
					const btns = [...document.querySelectorAll("button")];

					btns.forEach((item) => {
						if (item.textContent === "Recover") item.click();
					});
				});

				await page.waitForSelector('[name="wallet_password"]');
				await page.type('[name="wallet_password"]', "fuckforme");
				await page.type(
					'[name="wallet_confirm_password"]',
					"fuckforme"
				);
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
				}, 5000);
				setTimeout(async () => {
					await browser.close();
					resolve("ok");
				}, 15000);
			} catch (error) {
				console.log(error.message);
				await browser.close();
				reject("done");
			}
		}, 10000);
	});
};

var loopContinue = true;
var n = 0;

async function Managework() {
	while (loopContinue) {
		await start().catch();
		n++;
		const mnelast = await fs.readFile("mnemonic.txt", {
			encoding: "utf-8",
		});
	}
}

Managework();
