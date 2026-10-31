import carts from '../data/carts.json';

// Single place the site reads inventory from. When the CMS decision lands
// (Sanity vs headless WooCommerce, PRD §14 Q1), swap this for a fetch.
export function getCarts() {
  return carts.filter((c) => c.status !== 'hidden');
}

export function getCart(slug) {
  return getCarts().find((c) => c.slug === slug);
}

/** A cart's race number: its position in the inventory list, 1-based. */
export function cartNumber(slug) {
  return getCarts().findIndex((c) => c.slug === slug) + 1;
}

export function priceOf(cart) {
  return cart.salePrice ?? cart.price;
}

export const money = (n) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

// Filter definitions. Options are derived from stock, so a filter value
// only appears if at least one cart has it (fixes "filters don't match stock").
export const FILTERS = [
  { key: 'condition', label: 'Condition', get: (c) => c.condition, fmt: (v) => (v === 'new' ? 'New' : 'Pre-owned') },
  { key: 'brand', label: 'Brand', get: (c) => c.brand },
  { key: 'colour', label: 'Colour', get: (c) => c.colour },
  { key: 'passengers', label: 'Seats', get: (c) => String(c.passengers), fmt: (v) => `${v} passenger` },
  { key: 'power', label: 'Power', get: (c) => c.power, fmt: (v) => (v === 'gas' ? 'Gas' : 'Electric') },
  { key: 'lifted', label: 'Height', get: (c) => (c.lifted ? 'yes' : 'no'), fmt: (v) => (v === 'yes' ? 'Lifted' : 'Stock height') },
];

export const SORTS = {
  featured: { label: 'Featured', fn: (a, b) => Number(b.featured) - Number(a.featured) },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => priceOf(a) - priceOf(b) },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => priceOf(b) - priceOf(a) },
  newest: { label: 'Newest year', fn: (a, b) => b.year - a.year },
};

export function filterOptions(list) {
  return FILTERS.map((f) => {
    const counts = new Map();
    for (const c of list) counts.set(f.get(c), (counts.get(f.get(c)) ?? 0) + 1);
    const options = [...counts.entries()]
      .sort(([a], [b]) => String(a).localeCompare(String(b), 'en', { numeric: true }))
      .map(([value, count]) => ({ value, count, label: f.fmt ? f.fmt(value) : value }));
    return { ...f, options };
  }).filter((f) => f.options.length > 1);
}

export function applyFilters(list, params) {
  let out = list;
  for (const f of FILTERS) {
    const wanted = params.getAll(f.key);
    if (wanted.length) out = out.filter((c) => wanted.includes(f.get(c)));
  }
  const sort = SORTS[params.get('sort')] ?? SORTS.featured;
  return [...out].sort(sort.fn);
}

export function similarCarts(cart, n = 3) {
  return getCarts()
    .filter((c) => c.slug !== cart.slug)
    .map((c) => ({
      c,
      score:
        (c.passengers === cart.passengers ? 2 : 0) +
        (c.lifted === cart.lifted ? 1 : 0) +
        (Math.abs(priceOf(c) - priceOf(cart)) < 2500 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map(({ c }) => c);
}
