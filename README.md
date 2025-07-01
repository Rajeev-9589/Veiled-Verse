# Veiled-Verse

Veiled-Verse is a next-generation storytelling platform that empowers writers to monetize their work and readers to discover, purchase, and enjoy high-quality stories. The platform features a robust monetization algorithm, subscription tiers, a reader rewards system, and a seamless, modern user experience.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Monetization Model](#monetization-model)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contribution](#contribution)
- [License](#license)

---

## Features

- 🔒 **User Authentication** (Firebase)
- ✍️ **Story Writing & Editing** (Rich text editor, enhanced features)
- 🛒 **Story Marketplace** (Buy, sell, and discover stories)
- 💳 **Wallet & Stripe Payments** (Buy stories, manage funds)
- 📚 **Subscription Tiers** (Free, Bronze, Silver, Gold)
- 🏆 **Reader Rewards & Loyalty Program**
- 📈 **Writer Analytics & Earnings**
- 🌐 **Offline Support & Network Awareness**
- 🧑‍🤝‍🧑 **Role Management** (Reader, Writer, etc.)
- 🖼️ **Modern, Responsive UI**

---

## Tech Stack

**Frontend:**
- React (JSX)
- Vite (build tool)
- Tailwind CSS (utility-first styling)
- Radix UI (accessible UI primitives)
- Tiptap (rich text editor)
- Stripe.js (payments)
- Framer Motion (animations)
- React Router

**Backend:**
- Node.js (JavaScript)
- Firebase (Authentication, Firestore)

**Other:**
- Service Worker (offline support)
- ESLint (linting)
- Date-fns (date utilities)
- Recharts (data visualization)

---

## Monetization Model

Veiled-Verse implements a multi-tier monetization system:

- **Pay-Per-Story:** Writers set custom prices; revenue split between writers, platform, and reader rewards.
- **Subscription Tiers:** Free, Bronze, Silver, and Gold, each with increasing benefits and discounts.
- **Writer Earnings:** Calculated based on price, quality, engagement, word count, and bonuses.
- **Reader Rewards:** Earn points for reading, rating, commenting, sharing, and daily logins; points convert to credits.
- **Dynamic Pricing:** Smart suggestions based on market data, author reputation, and demand.

For full details, see [MONETIZATION_ALGORITHM.md](./MONETIZATION_ALGORITHM.md).

---

## Folder Structure

```
Veiled-Verse/
  Backend/                # Server-side logic, Firebase, Firestore, utilities
    constants/
    firebase/
    firestore/
    utils/
  public/                 # Static assets, service worker
  src/                    # Main frontend source
    assets/               # Images and static assets
    components/           # UI components (modals, editors, dashboards, etc.)
    contexts/             # React context providers
    hooks/                # Custom React hooks
    lib/                  # Utility functions
    pages/                # Main app pages/routes
    Routes/               # Route protection
  package.json            # Project metadata and dependencies
  vite.config.js          # Vite configuration
  MONETIZATION_ALGORITHM.md # Monetization logic and explanation
  README.md               # Project documentation
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Firebase project (for authentication and Firestore)
- Stripe account (for payments)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/veiled-verse.git
   cd veiled-verse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Set up your Firebase project.
   - Add your Firebase config to `Backend/firebase/firebase.js`.

4. **Configure Stripe:**
   - Add your Stripe public key to the relevant environment/config file.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   - Visit `http://localhost:5173` (or as indicated in the terminal).

---

## Usage

- **Sign up** as a reader or writer.
- **Browse** and **purchase** stories from the marketplace.
- **Write and publish** your own stories as a writer.
- **Subscribe** to tiers for enhanced features and discounts.
- **Earn rewards** by reading, rating, and sharing stories.
- **Manage your wallet** and view analytics on your dashboard.

---

## Contribution

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

[MIT](LICENSE) (or specify your license here)

---

## Acknowledgements

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [Stripe](https://stripe.com/)
- [Tiptap](https://tiptap.dev/)
- [Radix UI](https://www.radix-ui.com/)

---

Feel free to further customize this README for your needs!
