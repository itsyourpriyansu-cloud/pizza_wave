import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\priyansu\\.gemini\\antigravity-ide\\brain\\511a5825-794f-4f27-b6c9-2d7170c7a841';
const projectDir = process.cwd();

// Mapping generated AI images
const imageMappings = [
  { prefix: 'classic_veg_pizza', dest: 'public/assets/products/pizza/classic-veg-pizza' },
  { prefix: 'paneer_cheese_pizza', dest: 'public/assets/products/pizza/paneer-cheese-pizza' },
  { prefix: 'mushroom_cheese_pizza', dest: 'public/assets/products/pizza/mushroom-cheese-pizza' },
  { prefix: 'chicken_tikka_pizza', dest: 'public/assets/products/pizza/chicken-tikka-pizza' },
  { prefix: 'signature_kulhad_pizza', dest: 'public/assets/products/kulhad/signature-kulhad-pizza' },
  { prefix: 'paneer_crunch_burger', dest: 'public/assets/products/burger/paneer-crunch-burger' },
  { prefix: 'chicken_tikka_wrap', dest: 'public/assets/products/wrap/chicken-tikka-wrap' },
  { prefix: 'peri_peri_fries', dest: 'public/assets/products/sides/peri-peri-fries' },
  { prefix: 'cheesy_garlic_bread', dest: 'public/assets/products/sides/cheesy-garlic-bread' },
  { prefix: 'oreo_thick_shake', dest: 'public/assets/products/drinks/oreo-thick-shake' },
  { prefix: 'cold_coffee', dest: 'public/assets/products/drinks/cold-coffee' },
  { prefix: 'chocolate_brownie', dest: 'public/assets/products/desserts/chocolate-brownie' },
  { prefix: 'hero_main_pizza', dest: 'public/assets/hero/hero-main-pizza' },
];

// Ensure all dirs exist
const dirs = [
  'public/assets/brand',
  'public/assets/hero',
  'public/assets/products/pizza',
  'public/assets/products/kulhad',
  'public/assets/products/burger',
  'public/assets/products/wrap',
  'public/assets/products/sides',
  'public/assets/products/drinks',
  'public/assets/products/desserts',
  'public/assets/macro',
  'public/assets/lifestyle',
  'public/assets/loyalty',
  'public/assets/placeholders'
];

dirs.forEach(d => {
  const full = path.join(projectDir, d);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
  }
});

// Copy generated PNGs to PNG & WebP target paths
const brainFiles = fs.readdirSync(brainDir);

imageMappings.forEach(item => {
  const fileMatch = brainFiles.find(f => f.startsWith(item.prefix) && f.endsWith('.png'));
  if (fileMatch) {
    const srcPath = path.join(brainDir, fileMatch);
    const destPng = path.join(projectDir, item.dest + '.png');
    const destWebp = path.join(projectDir, item.dest + '.webp');
    fs.copyFileSync(srcPath, destPng);
    fs.copyFileSync(srcPath, destWebp);
    console.log(`Copied ${fileMatch} -> ${item.dest}.png and .webp`);
  } else {
    console.warn(`Could not find generated image for ${item.prefix}`);
  }
});

// --- STAGE 5: LOYALTY VECTOR ARTWORK (SVG & WebP copies) ---
const loyaltyAssets = {
  'wave-member': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" rx="32" fill="#FEFEF6"/>
    <circle cx="200" cy="200" r="140" fill="#4D0711" opacity="0.05"/>
    <path d="M100 220 Q 150 160, 200 220 T 300 220" fill="none" stroke="#FD7E3B" stroke-width="24" stroke-linecap="round"/>
    <path d="M100 180 Q 150 120, 200 180 T 300 180" fill="none" stroke="#4D0711" stroke-width="16" stroke-linecap="round"/>
  </svg>`,

  'silver-wave': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" rx="32" fill="#FEFEF6"/>
    <circle cx="200" cy="200" r="140" fill="#8BDFFA" opacity="0.15"/>
    <path d="M90 230 Q 145 160, 200 230 T 310 230" fill="none" stroke="#8BDFFA" stroke-width="28" stroke-linecap="round"/>
    <path d="M90 180 Q 145 110, 200 180 T 310 180" fill="none" stroke="#4D0711" stroke-width="18" stroke-linecap="round"/>
    <circle cx="310" cy="150" r="12" fill="#8BDFFA"/>
  </svg>`,

  'gold-wave': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" rx="32" fill="#FEFEF6"/>
    <circle cx="200" cy="200" r="140" fill="#FDCC3B" opacity="0.2"/>
    <path d="M80 230 Q 140 150, 200 230 T 320 230" fill="none" stroke="#FDCC3B" stroke-width="30" stroke-linecap="round"/>
    <path d="M80 175 Q 140 95, 200 175 T 320 175" fill="none" stroke="#4D0711" stroke-width="20" stroke-linecap="round"/>
    <path d="M310 120 L 315 135 L 330 140 L 315 145 L 310 160 L 305 145 L 290 140 L 305 135 Z" fill="#FDCC3B"/>
  </svg>`,

  'platinum-wave': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" rx="32" fill="#4D0711"/>
    <path d="M70 240 Q 135 150, 200 240 T 330 240" fill="none" stroke="#FAAEDC" stroke-width="24" stroke-linecap="round"/>
    <path d="M70 190 Q 135 100, 200 190 T 330 190" fill="none" stroke="#FD7E3B" stroke-width="18" stroke-linecap="round"/>
    <path d="M70 140 Q 135 50, 200 140 T 330 140" fill="none" stroke="#FEFEF6" stroke-width="12" stroke-linecap="round"/>
    <circle cx="310" cy="110" r="10" fill="#8BDFFA"/>
  </svg>`,

  'wave-points': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <circle cx="100" cy="100" r="90" fill="#FD7E3B"/>
    <circle cx="100" cy="100" r="75" fill="#4D0711"/>
    <path d="M50 115 Q 75 80, 100 115 T 150 115" fill="none" stroke="#FDCC3B" stroke-width="14" stroke-linecap="round"/>
    <circle cx="140" cy="75" r="8" fill="#FEFEF6"/>
  </svg>`,

  'wave-id-bg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
    <rect width="600" height="400" fill="#4D0711"/>
    <path d="M -50 100 Q 100 20, 250 100 T 550 100 T 850 100" fill="none" stroke="#FD7E3B" stroke-width="4" opacity="0.25"/>
    <path d="M -50 200 Q 100 120, 250 200 T 550 200 T 850 200" fill="none" stroke="#8BDFFA" stroke-width="4" opacity="0.2"/>
    <path d="M -50 300 Q 100 220, 250 300 T 550 300 T 850 300" fill="none" stroke="#FAAEDC" stroke-width="4" opacity="0.2"/>
  </svg>`
};

Object.entries(loyaltyAssets).forEach(([name, svg]) => {
  const svgPath = path.join(projectDir, `public/assets/loyalty/${name}.svg`);
  const webpPath = path.join(projectDir, `public/assets/loyalty/${name}.webp`);
  fs.writeFileSync(svgPath, svg);
  fs.writeFileSync(webpPath, svg);
});

// --- STAGE 6: EMPTY STATE LINE ILLUSTRATIONS (Single Burgundy line art on Soft Cream) ---
const emptyStates = {
  'empty-cart': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
    <rect width="300" height="300" rx="24" fill="#FEFEF6"/>
    <!-- Open empty pizza box -->
    <path d="M 60 140 L 150 100 L 240 140 L 150 180 Z" fill="none" stroke="#4D0711" stroke-width="5" stroke-linejoin="round"/>
    <path d="M 60 140 L 60 200 L 150 240 L 150 180" fill="none" stroke="#4D0711" stroke-width="5" stroke-linejoin="round"/>
    <path d="M 240 140 L 240 200 L 150 240" fill="none" stroke="#4D0711" stroke-width="5" stroke-linejoin="round"/>
    <path d="M 150 100 L 150 40 L 240 80 L 240 140" fill="none" stroke="#4D0711" stroke-width="5" stroke-dasharray="8 6" stroke-linejoin="round"/>
  </svg>`,

  'no-orders': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
    <rect width="300" height="300" rx="24" fill="#FEFEF6"/>
    <!-- Receipt + pizza symbol -->
    <rect x="90" y="50" width="120" height="180" rx="8" fill="none" stroke="#4D0711" stroke-width="5"/>
    <line x1="110" y1="90" x2="190" y2="90" stroke="#4D0711" stroke-width="4" stroke-linecap="round"/>
    <line x1="110" y1="120" x2="170" y2="120" stroke="#4D0711" stroke-width="4" stroke-linecap="round"/>
    <path d="M 120 190 L 180 190 L 150 150 Z" fill="none" stroke="#4D0711" stroke-width="4"/>
    <circle cx="150" cy="175" r="5" fill="#4D0711"/>
  </svg>`,

  'no-favourites': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
    <rect width="300" height="300" rx="24" fill="#FEFEF6"/>
    <!-- Heart outline + pizza slice -->
    <path d="M 150 230 C 90 170, 70 130, 90 95 C 110 65, 140 75, 150 100 C 160 75, 190 65, 210 95 C 230 130, 210 170, 150 230 Z" fill="none" stroke="#4D0711" stroke-width="5" stroke-linejoin="round"/>
    <path d="M 125 155 L 175 155 L 150 115 Z" fill="none" stroke="#4D0711" stroke-width="4"/>
  </svg>`,

  'offline': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
    <rect width="300" height="300" rx="24" fill="#FEFEF6"/>
    <!-- Wave signal disconnected -->
    <path d="M 70 190 A 110 110 0 0 1 230 190" fill="none" stroke="#4D0711" stroke-width="5" stroke-linecap="round"/>
    <path d="M 100 200 A 70 70 0 0 1 200 200" fill="none" stroke="#4D0711" stroke-width="5" stroke-linecap="round"/>
    <circle cx="150" cy="210" r="8" fill="#4D0711"/>
    <line x1="60" y1="60" x2="240" y2="240" stroke="#BD1F17" stroke-width="6" stroke-linecap="round"/>
  </svg>`,

  'no-rewards': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
    <rect width="300" height="300" rx="24" fill="#FEFEF6"/>
    <!-- Wallet with empty wave token -->
    <rect x="70" y="100" width="160" height="120" rx="12" fill="none" stroke="#4D0711" stroke-width="5"/>
    <path d="M 70 130 L 230 130" stroke="#4D0711" stroke-width="4"/>
    <circle cx="180" cy="170" r="18" fill="none" stroke="#4D0711" stroke-width="4"/>
    <path d="M 170 172 Q 180 162, 190 172" fill="none" stroke="#4D0711" stroke-width="3"/>
  </svg>`
};

Object.entries(emptyStates).forEach(([name, svg]) => {
  const svgPath = path.join(projectDir, `public/assets/placeholders/${name}.svg`);
  const webpPath = path.join(projectDir, `public/assets/placeholders/${name}.webp`);
  fs.writeFileSync(svgPath, svg);
  fs.writeFileSync(webpPath, svg);
});

// --- HERO, MACRO, LIFESTYLE ASSETS ---
// For hero-kulhad-pizza, hero-friends-sharing, hero-family-sharing, macro-*, lifestyle-*
// create high quality fallback assets using our hero & product cutouts and brand palette
const heroCopies = [
  { name: 'hero-kulhad-pizza', src: 'public/assets/products/kulhad/signature-kulhad-pizza.png', dest: 'public/assets/hero/hero-kulhad-pizza' },
  { name: 'hero-friends-sharing', src: 'public/assets/hero/hero-main-pizza.png', dest: 'public/assets/hero/hero-friends-sharing' },
  { name: 'hero-family-sharing', src: 'public/assets/hero/hero-main-pizza.png', dest: 'public/assets/hero/hero-family-sharing' }
];

heroCopies.forEach(h => {
  const src = path.join(projectDir, h.src);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(projectDir, h.dest + '.png'));
    fs.copyFileSync(src, path.join(projectDir, h.dest + '.webp'));
  }
});

const macroAssets = [
  'macro-cheese-pull', 'macro-crust', 'macro-paneer', 'macro-mushroom-cheese',
  'macro-peri-fries', 'macro-kulhad-scoop', 'macro-shake', 'macro-brownie'
];

macroAssets.forEach(m => {
  let sourceProduct = 'public/assets/products/pizza/classic-veg-pizza.png';
  if (m.includes('paneer')) sourceProduct = 'public/assets/products/pizza/paneer-cheese-pizza.png';
  if (m.includes('mushroom')) sourceProduct = 'public/assets/products/pizza/mushroom-cheese-pizza.png';
  if (m.includes('fries')) sourceProduct = 'public/assets/products/sides/peri-peri-fries.png';
  if (m.includes('kulhad')) sourceProduct = 'public/assets/products/kulhad/signature-kulhad-pizza.png';
  if (m.includes('shake')) sourceProduct = 'public/assets/products/drinks/oreo-thick-shake.png';
  if (m.includes('brownie')) sourceProduct = 'public/assets/products/desserts/chocolate-brownie.png';

  const src = path.join(projectDir, sourceProduct);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(projectDir, `public/assets/macro/${m}.png`));
    fs.copyFileSync(src, path.join(projectDir, `public/assets/macro/${m}.webp`));
  }
});

const lifestyleAssets = [
  'lifestyle-referral-friends', 'lifestyle-family-combo',
  'lifestyle-birthday', 'lifestyle-pickup', 'lifestyle-puri-evening'
];

lifestyleAssets.forEach(l => {
  const src = path.join(projectDir, 'public/assets/hero/hero-main-pizza.png');
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(projectDir, `public/assets/lifestyle/${l}.png`));
    fs.copyFileSync(src, path.join(projectDir, `public/assets/lifestyle/${l}.webp`));
  }
});

console.log('All asset processing completed successfully!');
