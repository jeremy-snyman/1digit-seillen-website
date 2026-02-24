export interface NavItem {
  label: string;
  href: string;
}

export const mainNavigation: NavItem[] = [
  { label: 'What We Do', href: '/what-we-do' },
  { label: 'How We Work', href: '/how-we-work' },
  { label: 'How We Price', href: '/how-we-price' },
  { label: 'Our Platforms', href: '/data-platforms' },
  { label: 'Trust & Security', href: '/trust-security' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
];

export const ctaNavItem: NavItem = {
  label: 'Contact',
  href: '/contact',
};
