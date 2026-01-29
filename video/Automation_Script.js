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
            console.log(`Could not find element for movement: ${targetSelector}`);
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

// --- Overlay Helper (Robust) ---
async function showOverlay(page, text) {
    await page.evaluate((text) => {
        // 1. Ensure Styles Exist (re-inject if lost after navigation)
        if (!document.getElementById('marketing-overlay-styles')) {
            const style = document.createElement('style');
            style.id = 'marketing-overlay-styles';
            style.textContent = `
                .marketing-overlay {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(20, 20, 25, 0.85);
                    backdrop-filter: blur(20px);
                    border: 3px solid #FFB800;
                    color: #FFB800;
                    font-family: sans-serif;
                    font-size: 5rem;
                    font-weight: 900;
                    padding: 3rem 6rem;
                    border-radius: 30px;
                    z-index: 2147483647;
                    text-transform: uppercase;
                    box-shadow: 0 0 100px rgba(255, 184, 0, 0.5);
                    text-shadow: 0 0 30px rgba(255, 184, 0, 0.8);
                    animation: popIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                    pointer-events: none;
                    text-align: center;
                    white-space: nowrap;
                    opacity: 0;
                }
                @keyframes popIn { 
                    0% { opacity: 0; transform: translate(-50%, -40%) scale(0.9); } 
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 
                }
            `;
            document.head.appendChild(style);
        }

        // 2. Create and Append Overlay
        const div = document.createElement('div');
        div.className = 'marketing-overlay';
        div.textContent = text;
        document.body.appendChild(div);

        // Remove after 4 seconds
        setTimeout(() => {
            div.style.transition = 'opacity 1s ease';
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

    // Set viewport to 1080p for high quality
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: {
            dir: path.join(__dirname, 'recordings'),
            size: { width: 1920, height: 1080 }
        }
    });

    const page = await context.newPage();

    try {
        // ----------------------------------------------------------------
        // 0. SCENE: PRE-ROLL - LOGIN
        // ----------------------------------------------------------------
        console.log("Scene 0: Login (Setting up state)");
        await page.goto('http://localhost:3000/auth/agent');
        await page.waitForTimeout(1000);

        await page.fill('input[type="email"]', 'sarah.jenkins@elite-travels.com');
        await page.fill('input[type="password"]', 'Password123!');
        await page.click('button:has-text("Sign In")');

        // Wait for redirect to dashboard to confirm login
        await page.waitForURL('**/agent-portal**', { timeout: 10000 }).catch(() => console.log("Login redirect timeout or already logged in"));
        await page.waitForTimeout(1000);

        // ----------------------------------------------------------------
        // 1. SCENE: HERO & LOGO (0:00 - 0:10)
        // ----------------------------------------------------------------
        console.log("Scene 1: Hero & Language");
        await page.goto('http://localhost:3000');
        await page.waitForTimeout(1000);

        await showOverlay(page, "GLOBAL B2B CONNECTIVITY");
        await page.waitForTimeout(2000);

        // Language Toggle
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

                // REVERT TO ENGLISH
                // Find the button (now likely displaying JA or similar)
                const jpBtn = page.locator('button:has(span:text-is("JA")), button:has(span:text-is("JP")), button:has(img[alt*="日本語"])').first();
                if (await jpBtn.isVisible()) {
                    await jpBtn.click();
                } else {
                    // Fallback
                    await langBtn.click();
                }
                await page.waitForTimeout(500);
                await page.click('text=English');
                await page.waitForTimeout(1000);
            }
        } catch (e) { console.log("Language toggle skipped", e); }

        // SCENE 2
        console.log("Scene 2: Dashboard");
        await page.goto('http://localhost:3000/agent-portal');
        await page.waitForLoadState('networkidle');

        await page.mouse.move(960, 540, { steps: 50 });

        await showOverlay(page, "0% COMMISSION");
        await page.waitForTimeout(2000);

        // SCENE 3
        console.log("Scene 3: Search");
        await showOverlay(page, "100% PROFIT RETENTION");

        const searchInputSelector = 'input[placeholder*="Search destinations"]';

        // Wait for search input
        const searchInput = page.locator(searchInputSelector).first();
        try {
            await searchInput.waitFor({ state: 'visible', timeout: 10000 });

            await smoothMove(page, searchInputSelector);
            await searchInput.click();

            // "hotel in bangkok"
            await page.keyboard.type('hotel in bangkok', { delay: 100 });
            await page.waitForTimeout(2000);

            // Select result
            const specificResult = page.locator('text=Grand Bangkok Hotel').first();
            if (await specificResult.isVisible()) {
                await specificResult.click();
            } else {
                console.log("Specific hotel not found, pushing Enter");
                await page.keyboard.press('ArrowDown');
                await page.waitForTimeout(200);
                await page.keyboard.press('Enter');
            }
        } catch (e) {
            console.log("Search input not found, attempting generic input");
            const genericInput = page.locator('input').first();
            if (await genericInput.isVisible()) {
                await genericInput.click();
                await page.keyboard.type('hotel in bangkok', { delay: 100 });
                await page.keyboard.press('Enter');
            }
        }

        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // SCENE 4: CONNECT (FAILSAFE ADDED)
        console.log("Scene 4: Connect");

        // Failsafe
        const isProductPage = page.url().includes('/product/');
        if (!isProductPage) {
            console.log("Not on product page, forcing navigation to suppliers...");
            await page.goto('http://localhost:3000/agent-portal/suppliers', { timeout: 60000 }); // INCREASED TIMEOUT
            // Relaxed wait state in case networkidle is too strict for slow assets
            await page.waitForLoadState('domcontentloaded');

            const firstCard = page.locator('.group').first();
            if (await firstCard.isVisible()) {
                await smoothMove(page, '.group');
                await firstCard.click();
                await page.waitForTimeout(2000);
            }
        }

        await showOverlay(page, "DIRECT PARTNER ACCESS");

        // "Connect with Supplier"
        const connectBtn = page.locator('button').filter({ hasText: /Connect with Supplier|Contact Supplier|CONNECT WITH SUPPLIER/i }).first();

        try {
            await connectBtn.waitFor({ state: 'visible', timeout: 5000 });
            if (await connectBtn.isVisible()) {
                const box = await connectBtn.boundingBox();
                if (box) {
                    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 30 });
                    await connectBtn.click();
                } else {
                    await connectBtn.click();
                }
            }
        } catch (e) { console.log("Connect button not interactable"); }

        await page.waitForTimeout(2000);

        // SCENE 5
        console.log("Scene 5: Close");
        await showOverlay(page, "70% OFF + 30-DAY TRIAL");

        await page.mouse.wheel(0, 400);
        await page.waitForTimeout(5000);

    } catch (e) {
        console.error("Error during recording:", e);
    } finally {
        await context.close();
        await browser.close();

        // Rename latest video
        const recordingsDir = path.join(__dirname, 'recordings');
        try {
            const files = fs.readdirSync(recordingsDir)
                .filter(f => f.endsWith('.webm'))
                .map(f => ({ name: f, time: fs.statSync(path.join(recordingsDir, f)).mtime.getTime() }))
                .sort((a, b) => b.time - a.time);

            if (files.length > 0) {
                const latest = files[0].name;
                const newName = 'Ark_Alliance_Marketing_60s.webm';
                if (fs.existsSync(path.join(recordingsDir, newName))) {
                    fs.unlinkSync(path.join(recordingsDir, newName));
                }
                fs.renameSync(path.join(recordingsDir, latest), path.join(recordingsDir, newName));
                console.log(`Success! Video saved as: ${path.join(recordingsDir, newName)}`);
            }
        } catch (e) {
            console.log("Error renaming file:", e);
        }
    }
})();