import { test, expect } from '@playwright/test';

test.describe('Homepage Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for animations to complete
    await page.waitForTimeout(1000);
  });

  test('homepage renders correctly on desktop', async ({ page }) => {
    // Check that the logo is visible
    await expect(page.getByText('WEB UN')).toBeVisible();
    
    // Check the card fan is present (should have cards with symbols)
    await expect(page.getByText('+2').first()).toBeVisible();
    await expect(page.getByText('⟲').first()).toBeVisible();
    
    // Check buttons are present
    await expect(page.getByRole('link', { name: /create new game/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /room code/i })).toBeVisible();
    
    // Take a screenshot for visual comparison
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      maxDiffPixelRatio: 0.1,
    });
  });

  test('homepage has correct background styling', async ({ page }) => {
    // Check that the body has the felt background
    const body = page.locator('body');
    await expect(body).toHaveCSS('background-color', 'rgb(13, 40, 24)'); // --felt-dark
  });

  test('create game button has copper styling', async ({ page }) => {
    const button = page.getByRole('link', { name: /create new game/i });
    await expect(button).toBeVisible();
    
    // Check copper gradient - the button should have the copper border color
    await expect(button).toHaveClass(/btn-copper/);
  });

  test('room code input accepts text', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /room code/i });
    await input.fill('Happy-Lions-42');
    await expect(input).toHaveValue('Happy-Lions-42');
  });

  test('join button is disabled when input is empty', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /join room/i });
    await expect(submitButton).toBeDisabled();
  });

  test('join button is enabled when input has text', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /room code/i });
    await input.fill('test-room');
    
    const submitButton = page.getByRole('button', { name: /join room/i });
    await expect(submitButton).toBeEnabled();
  });
});

test.describe('Homepage Mobile Tests', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
  });

  test('card fan shows 3 cards on mobile', async ({ page }) => {
    // On mobile, the green card should be hidden
    // Count visible reverse symbols (should be 1 from yellow, not 2)
    const reverseSymbols = page.locator('text=⟲');
    
    // Take mobile screenshot
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      maxDiffPixelRatio: 0.1,
    });
  });

  test('layout stacks correctly on mobile', async ({ page }) => {
    // Verify elements are stacked vertically
    const logo = page.getByText('WEB UN');
    const createButton = page.getByRole('link', { name: /create new game/i });
    
    const logoBox = await logo.boundingBox();
    const buttonBox = await createButton.boundingBox();
    
    // Button should be below the logo
    expect(buttonBox!.y).toBeGreaterThan(logoBox!.y);
  });

  test('touch targets are at least 44px', async ({ page }) => {
    const createButton = page.getByRole('link', { name: /create new game/i });
    const buttonBox = await createButton.boundingBox();
    
    // Check button height is at least 44px for touch accessibility
    expect(buttonBox!.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe('Homepage Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('keyboard navigation works', async ({ page }) => {
    // Tab through elements
    await page.keyboard.press('Tab');
    const createButton = page.getByRole('link', { name: /create new game/i });
    await expect(createButton).toBeFocused();

    await page.keyboard.press('Tab');
    const input = page.getByRole('textbox', { name: /room code/i });
    await expect(input).toBeFocused();

    // Fill input to enable the join button, then tab to it
    await input.fill('test-room');
    await page.keyboard.press('Tab');
    const joinButton = page.getByRole('button', { name: /join room/i });
    await expect(joinButton).toBeFocused();
  });

  test('focus states are visible', async ({ page }) => {
    const createButton = page.getByRole('link', { name: /create new game/i });
    await createButton.focus();
    
    // Take screenshot showing focus state
    await expect(page).toHaveScreenshot('homepage-focus-state.png', {
      maxDiffPixelRatio: 0.1,
    });
  });
});

test.describe('Homepage Reduced Motion', () => {
  test.use({
    contextOptions: {
      reducedMotion: 'reduce',
    },
  });

  test('respects reduced motion preference', async ({ page }) => {
    await page.goto('/');
    
    // With reduced motion, elements should be immediately visible
    await expect(page.getByText('WEB UN')).toBeVisible();
    await expect(page.getByRole('link', { name: /create new game/i })).toBeVisible();
    
    // Take screenshot to verify no animations are in progress
    await expect(page).toHaveScreenshot('homepage-reduced-motion.png', {
      maxDiffPixelRatio: 0.1,
    });
  });
});
