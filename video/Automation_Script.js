// Ark Alliance Marketing Reel Automation
// Goal: 60-second high-impact recording

const { chromium } = require('playwright');
const path = require('path');

// --- Bezier Curve Helper ---
function generateBezierPath(startX, startY, endX, endY, cp1X, cp1Y, cp2X, cp2Y, steps) {
    const path = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = Math.pow(1 - t, 3) * startX + 3 * Math.pow(1 - t, 2) * t * cp1X + 3 * (1 - t) * t * t * cp2X + Math.pow(t, 3) * endX;
        const y = Math.pow(1 - t, 3) * startY + 3 * Math.pow(1 - t, 2) * t * cp1Y + 3 * (1 - t) * t * t * cp2Y + Math.pow(t, 3) * endY;
        path.push({ x, y });
    }
    return path;
}

// Reuseable smooth mouse move
async function smoothMove(page, targetSelector, steps = 60) {
    try {
        const element = page.locator(targetSelector).first();
        const box = await element.boundingBox();
        if (!box) {
            console.log(`Could not find element: ${targetSelector}`);
            return;
        }
        const endX = box.x + box.width / 2;
        const endY = box.y + box.height / 2;

        const startX = 1920 / 2;
        const startY = 1080 / 2;

        const cp1X = startX + (endX - startX) * 0.2;
        const cp1Y = startY + (endY - startY) * 0.8;
        const cp2X = startX + (endX - startX) * 0.8;
        const cp2Y = startY + (endY - startY) * 0.2;

        const path = generateBezierPath(startX, startY, endX, endY, cp1X, cp1Y, cp2X, cp2Y, steps);

        await page.mouse.move(path[0].x, path[0].y);

        for (const point of path) {
            await page.mouse.move(point.x, point.y);
            await page.waitForTimeout(10);
        }
    } catch (e) {
        console.log(`Error moving to ${targetSelector}:`, e);
    }
}

// --- Overlay Helper ---
async function showOverlay(page, text) {
    await page.evaluate((text) => {
        const div = document.createElement('div');
        div.className = 'marketing-overlay';
        div.textContent = text;
        document.body.appendChild(div);

        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 1000);
        }, 4000);
    }, text);
}

(async () => {
    console.log("Starting Recording Session...");

    const fs = require('fs');
    if (!fs.existsSync(path.join(__dirname, 'recordings'))) {
        fs.mkdirSync(path.join(__dirname, 'recordings'));
    }

    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized']
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: {
            dir: path.join(__dirname, 'recordings'),
            size: { width: 1920, height: 1080 }
        }
    });

    const page = await context.newPage();

    await page.addStyleTag({
        content: `
            .marketing-overlay {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(20, 20, 25, 0.6);
                backdrop-filter: blur(20px);
                border: 2px solid rgba(255, 184, 0, 0.5);
                color: #FFB800;
                font-family: 'Inter', sans-serif;
                font-size: 5rem;
                font-weight: 900;
                padding: 3rem 6rem;
                border-radius: 30px;
                z-index: 99999;
                text-transform: uppercase;
                box-shadow: 0 0 100px rgba(255, 184, 0, 0.3);
                text-shadow: 0 0 30px rgba(255, 184, 0, 0.8);
                animation: popIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                pointer-events: none;
                text-align: center;
                white-space: nowrap;
            }
            @keyframes popIn { 
                0% { opacity: 0; transform: translate(-50%, -40%) scale(0.9); } 
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 
            }
        `
    });

    try {
        // SCENE 1
        console.log("Scene 1: Hero");
        await page.goto('http://localhost:3000');
        await page.waitForTimeout(1000);
        await showOverlay(page, "STOP PAYING COMMISSIONS");
        await page.waitForTimeout(4000);

        // SCENE 2
        console.log("Scene 2: Language");
        const langBtnSelector = 'button:has(span:text-is("EN"))';
        try {
            const langBtn = page.locator(langBtnSelector).first();
            await langBtn.waitFor({ state: 'visible', timeout: 5000 });

            if (await langBtn.isVisible()) {
                await smoothMove(page, langBtnSelector);
                await langBtn.click();
                await page.waitForTimeout(500);

                await page.click('text=日本語');
                await page.waitForTimeout(2000);

                await showOverlay(page, "0% COMMISSION");

                // Reset
                // Check for JA for Japanese
                const closeBtnSelector = 'button:has(span:text-is("JA"))';
                // If not found, try generic close or just reload
                const closeBtn = page.locator(closeBtnSelector).first();
                if (await closeBtn.isVisible()) {
                    await closeBtn.click();
                } else {
                    // Try EN again if it didn't change?
                    const enBtn = page.locator(langBtnSelector).first();
                    if (await enBtn.isVisible()) await enBtn.click();
                }

                await page.waitForTimeout(500);
                const engOption = page.locator('text=English');
                if (await engOption.isVisible()) {
                    await engOption.click();
                }
                await page.waitForTimeout(1000);
            }
        } catch (e) {
            console.log("Language toggle issue:", e.message);
        }

        // SCENE 3
        console.log("Scene 3: Dashboard");
        await page.goto('http://localhost:3000/agent-portal');
        await page.waitForLoadState('networkidle');

        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(1000);
        await page.mouse.wheel(0, -500);

        await showOverlay(page, "100% PROFIT RETENTION");
        await page.waitForTimeout(3000);

        // SCENE 4
        console.log("Scene 4: Search");
        const searchInputSelector = 'input[placeholder*="Search destinations"]';
        const searchInput = page.locator(searchInputSelector).first();

        if (await searchInput.isVisible()) {
            await smoothMove(page, searchInputSelector);
            await searchInput.click();
            await page.keyboard.type('Bangkok', { delay: 100 });
            await page.waitForTimeout(1500);

            await page.keyboard.press('ArrowDown');
            await page.waitForTimeout(200);
            await page.keyboard.press('Enter');
        }

        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        const firstCard = page.locator('.group').first();
        if (await firstCard.isVisible()) {
            await smoothMove(page, '.group');
            await firstCard.click();
            await page.waitForTimeout(2000);
        }

        await showOverlay(page, "DIRECT CONNECTIVITY");
        await page.waitForTimeout(3000);

        // SCENE 5
        console.log("Scene 5: CTA");
        const connectBtnSelector = 'button:has-text("Connect with Supplier")';
        const connectBtn = page.locator(connectBtnSelector);

        // Wait for it
        try {
            await connectBtn.waitFor({ state: 'visible', timeout: 5000 });
            if (await connectBtn.isVisible()) {
                await smoothMove(page, connectBtnSelector);
                await connectBtn.hover();
                await page.waitForTimeout(1000);
                await connectBtn.click();
            }
        } catch (e) {
            console.log("CTA not found");
        }

        await showOverlay(page, "70% OFF + 30-DAY TRIAL");
        await page.waitForTimeout(5000);

    } catch (e) {
        console.error("Error during recording:", e);
    } finally {
        await context.close();
        await browser.close();
        console.log(`Recording Complete. Check ${path.join(__dirname, 'recordings')}`);
    }
})();