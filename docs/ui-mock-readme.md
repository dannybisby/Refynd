# Refynd UI Mock-ups

A comprehensive Vue 3 application demonstrating power-user workflows for a resale business management platform.

## Overview

Refynd is a **power-user tool** designed for resellers who need efficient, keyboard-driven workflows to manage their business across platforms like Vinted, eBay, and other marketplaces. This implementation provides realistic UI mock-ups with placeholder data for all core business functions.

## Features

### 🏠 Dashboard
- **KPI Cards**: Revenue, profit, sell-through rates, active listings
- **Activity Feed**: Recent sales, dispatches, repricing actions
- **Quick Actions**: Add items, open deal feed, print labels
- **Queue Management**: Orders to pick, labels pending, messages

### 🛒 Buy (Deal Discovery)
- **Deal Feed**: Cards and table view with scoring system
- **Scoring Panel**: Photos, seller info, profit analysis, comps
- **Deep Links**: "Open in Vinted" compliance-friendly purchasing
- **Rules Engine**: Automated deal filtering and alerts
- **Saved Searches**: Quick access to common queries

### 🏷️ Sell (Listing Composer)
- **5-Step Composer**: Details → Photos → Pricing → Cross-post → Review
- **AI Description**: Mock AI-powered description generation
- **Fee Calculator**: Real-time NET profit calculations
- **Cross-posting**: Multi-platform listing support
- **Draft Management**: Save and resume listings

### 📦 Inventory Management
- **Advanced DataTable**: Sorting, filtering, column management
- **Batch Operations**: Assign locations, print labels, bulk repricing
- **Item Details Drawer**: Full item information and actions
- **CSV Import**: Bulk inventory management
- **Location Tracking**: Physical inventory organization

### 🚚 Shipping & Fulfillment
- **Pick & Pack Flow**: Step-by-step order fulfillment
- **Label Management**: Print queue, retry failed prints
- **Manifest Creation**: Drop-off documentation
- **Sunmi-Friendly**: Touch-optimized for tablet pick/pack stations
- **Carrier Integration**: Multiple shipping provider support

### 📊 Analytics & Insights
- **Revenue Charts**: Trend analysis and profit tracking
- **Sell-Through Rates**: Category performance analysis
- **Stock Aging**: Inventory turnover insights
- **Channel Performance**: Platform comparison
- **Slow Movers**: Items needing attention

## Technology Stack

- **Vue 3** with Composition API
- **Vuex** for state management
- **Vue Router** for navigation
- **Tailwind CSS** for styling
- **Vite** for build tooling

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Navigation & Shortcuts

### Global Shortcuts
- `⌘K / Ctrl+K` - Open command palette
- `/` - Focus global search
- `?` - Show help overlay

### Navigation Shortcuts
- `g d` - Dashboard
- `g b` - Buy
- `g s` - Sell  
- `g i` - Inventory
- `g h` - Shipping
- `g a` - Analytics

### Power User Features
- **Command Palette**: Quick actions via keyboard
- **Batch Operations**: Multi-select and bulk actions
- **Saved Views**: Custom filters and layouts
- **Keyboard Navigation**: Full keyboard accessibility
- **Dark Mode**: System preference detection

## Data Models

### Items
```javascript
{
  id: string,
  sku: string,
  title: string,
  brand: string,
  model: string,
  condition: 'new'|'like_new'|'good'|'fair'|'for_parts',
  source: 'vinted'|'facebook'|'gumtree'|'carboot'|'charity',
  buyPrice: number,
  askPrice: number,
  estResale: number,
  channels: string[],
  location: string,
  status: 'in_stock'|'listed'|'allocated'|'sold'|'archived'
}
```

### Deals
```javascript
{
  id: string,
  source: 'vinted',
  title: string,
  price: number,
  url: string,
  sellerRating: number,
  estResale: number,
  marginPct: number,
  score: 'A'|'B'|'C'|'D',
  ageMinutes: number
}
```

### Orders
```javascript
{
  id: string,
  platform: 'vinted'|'ebay',
  itemId: string,
  buyer: string,
  salePrice: number,
  shippingPaid: number,
  feesEst: number,
  status: 'pending_pick'|'label_pending'|'label_ready'|'dispatched'
}
```

## Design Principles

### Power User Focused
- **Keyboard First**: Every action accessible via keyboard
- **Bulk Operations**: Efficient multi-item workflows
- **Quick Access**: Command palette and shortcuts
- **Information Dense**: Maximum data in minimal space

### Compliance & Ethics
- **No Automation**: Human-in-the-loop for all purchases
- **Deep Links**: External navigation for actual transactions
- **TOS Compliant**: Respects platform terms of service

### Accessibility
- **WCAG 2.1 AA**: Screen reader and keyboard navigation support
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: High contrast in both light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile

## Mock Data

The application includes realistic mock data for:
- **Sample Items**: Electronics, accessories, and other resale goods
- **Deal Feed**: Scored opportunities from various sources
- **Order History**: Past and current fulfillment pipeline
- **Analytics Data**: Revenue, profit, and performance metrics

## State Management

Vuex modules organize application state:
- `items` - Inventory management
- `listings` - Sell workflow and drafts
- `orders` - Order fulfillment
- `shipments` - Shipping and labels
- `deals` - Buy opportunities
- `settings` - User preferences
- `toasts` - Notifications

## Component Architecture

### Core Components
- **AppShell**: Main layout with navigation
- **DataTable**: Advanced table with sorting/filtering
- **KPICard**: Metric display with trends
- **CommandPalette**: Quick action interface
- **ToastContainer**: Notification system

### Page Components
- **Dashboard**: Business overview
- **Buy**: Deal discovery and scoring
- **Sell**: Listing creation workflow
- **Inventory**: Item management
- **Shipping**: Order fulfillment
- **Analytics**: Business insights

## Development Notes

This is a **UI mock-up** implementation focused on:
- Realistic user interfaces and workflows
- Comprehensive state management
- Responsive design and accessibility
- Power-user efficiency features

**Not included:**
- Real API integrations
- Actual payment processing
- Live marketplace connections
- Production authentication

## Screenshots

*Screenshots would be included showing each major page in both light and dark mode.*

## Contributing

This project serves as a comprehensive example of modern Vue.js application architecture for business management tools. Contributions to improve accessibility, performance, or user experience are welcome.