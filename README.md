# Veiled-Verse

> **Note: This is just a project/demo application for learning and demonstration purposes.**

Veiled-Verse is a next-generation storytelling platform that empowers writers to monetize their work and readers to discover, purchase, and enjoy high-quality stories. The platform features a robust monetization algorithm, subscription tiers, a reader rewards system, and a seamless, modern user experience.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Monetization Model](#monetization-model)
- [Monetization Implementation Status](#monetization-implementation-status)
- [Security Features](#security-features)
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

## Monetization Implementation Status

### ✅ **IMPLEMENTED FEATURES**

#### 1. **Pay-Per-Story Model** - **60% Complete**
- ✅ **Basic Story Pricing**: Writers can set custom prices for stories
- ✅ **Revenue Split**: 70% to writer, 20% to platform, 10% to reader rewards
- ✅ **Story Purchase Flow**: Complete purchase system with wallet integration
- ❌ **Quality Multiplier**: Not implemented
- ❌ **Engagement Bonus**: Not implemented

#### 2. **Subscription Tiers** - **40% Complete**
- ✅ **Subscription System**: Basic subscription management
- ✅ **Payment Integration**: Stripe payment modal for subscriptions
- ❌ **Tier Benefits**: Only 3 tiers instead of 4 (missing Bronze tier)
- ❌ **Tier-Specific Features**: Missing discounts, credits, exclusive content

#### 3. **Writer Earnings** - **30% Complete**
- ✅ **Basic Earnings**: Simple 70% revenue split calculation
- ✅ **Earnings Tracking**: Wallet system with earnings breakdown
- ❌ **Advanced Algorithm**: Missing rating bonuses, engagement bonuses, word count bonuses
- ❌ **Quality Score**: Not implemented
- ❌ **Trending Bonus**: Not implemented
- ❌ **Consistency Bonus**: Not implemented

#### 4. **Reader Rewards System** - **0% Complete**
- ❌ **Points System**: No points earning for reading, rating, commenting, sharing
- ❌ **Loyalty Program**: No Bronze/Silver/Gold reader tiers
- ❌ **Point Conversion**: No 100 points = ₹1 credit system
- ❌ **Daily Login Rewards**: Not implemented

#### 5. **Dynamic Pricing** - **0% Complete**
- ❌ **Market Analysis**: No similar stories analysis
- ❌ **Author Reputation**: No reputation factor calculation
- ❌ **Content Quality Factor**: Not implemented
- ❌ **Demand Factor**: Not implemented
- ❌ **Smart Pricing Suggestions**: Not implemented

#### 6. **Anti-Fraud & Quality Control** - **0% Complete**
- ❌ **Duplicate Content Detection**: No plagiarism checking
- ❌ **Bot Detection**: No rate limiting or behavior analysis
- ❌ **Fake Engagement Detection**: No pattern recognition
- ❌ **Quality Metrics**: No reader retention tracking

#### 7. **Performance Analytics** - **40% Complete**
- ✅ **Basic Metrics**: Views, likes, earnings tracking
- ❌ **Advanced Analytics**: Missing MRR, CLV, churn rate, ARPU
- ❌ **Content Quality Score**: Not implemented

### 🔧 **IMPLEMENTATION GAPS**

| Feature | Documentation | Implementation | Status |
|---------|---------------|----------------|---------|
| Pay-Per-Story | ✅ Complete | ✅ Basic | 60% |
| Subscription Tiers | ✅ Complete | ✅ Basic | 40% |
| Writer Earnings | ✅ Complex Algorithm | ✅ Simple Split | 30% |
| Reader Rewards | ✅ Complete System | ❌ Not Implemented | 0% |
| Dynamic Pricing | ✅ Smart Algorithm | ❌ Not Implemented | 0% |
| Anti-Fraud | ✅ Comprehensive | ❌ Not Implemented | 0% |
| Analytics | ✅ Advanced Metrics | ✅ Basic Metrics | 40% |

### 🎯 **PRIORITY IMPLEMENTATION ROADMAP**

#### **High Priority (Critical for Monetization)**
1. **Reader Rewards System** - Implement points earning, loyalty tiers, and credit conversion
2. **Enhanced Writer Earnings Algorithm** - Add complex bonus calculations from documentation
3. **Complete Subscription Tier Benefits** - Add tier-specific features and discounts

#### **Medium Priority**
4. **Dynamic Pricing Algorithm** - Implement smart pricing suggestions
5. **Advanced Analytics** - Add comprehensive metrics tracking

#### **Low Priority**
6. **Anti-Fraud Systems** - Can be implemented later as the platform scales

### 💡 **CURRENT STATUS**

The codebase has a **solid foundation** with basic monetization features, but it's missing **most of the sophisticated algorithms** described in the `MONETIZATION_ALGORITHM.md`. The implementation is approximately **30-40% complete** compared to the documented vision.

**Key Missing Components:**
- Reader rewards and loyalty program
- Advanced writer earnings calculations
- Dynamic pricing algorithm
- Comprehensive subscription tier benefits
- Anti-fraud and quality control systems

---

## Security Features

Veiled-Verse implements comprehensive security measures to protect users and data:

### 🔒 **Security Measures Implemented**

#### 1. **XSS (Cross-Site Scripting) Protection**
- ✅ **HTML Sanitization**: All user-generated content is sanitized using `sanitizeHTML()` function
- ✅ **Input Validation**: URL inputs are validated using `validateUrl()` function
- ✅ **Content Security**: Only safe HTML tags and attributes are allowed

#### 2. **Input Validation & Sanitization**
- ✅ **Email Validation**: Proper email format validation
- ✅ **Password Strength**: Comprehensive password strength checking
- ✅ **URL Validation**: Secure URL validation with protocol and domain restrictions
- ✅ **User Input Sanitization**: All user inputs are sanitized before processing

#### 3. **Authentication & Authorization**
- ✅ **Firebase Authentication**: Secure user authentication system
- ✅ **Role-Based Access Control**: Reader, Writer, and Admin roles
- ✅ **Private Routes**: Protected routes with authentication checks
- ✅ **Session Management**: Secure session handling

#### 4. **Data Protection**
- ✅ **Environment Variables**: Sensitive configuration stored in environment variables
- ✅ **Secure Storage**: Sensitive data encrypted in localStorage
- ✅ **Input Sanitization**: All user inputs sanitized to prevent injection attacks

#### 5. **Rate Limiting & Security Utilities**
- ✅ **Rate Limiter**: Built-in rate limiting for API calls and user actions
- ✅ **Secure Token Generation**: Cryptographically secure random tokens
- ✅ **Data Encryption**: Basic encryption for sensitive data storage

#### 6. **UI Security**
- ✅ **Secure Dialogs**: Replaced insecure `prompt()` and `alert()` with secure modals
- ✅ **Toast Notifications**: Secure notification system instead of browser alerts
- ✅ **Error Boundaries**: Graceful error handling without exposing sensitive information

### 🛡️ **Security Best Practices**

- **Content Security Policy**: Implemented to prevent XSS attacks
- **Input Validation**: All user inputs validated and sanitized
- **Secure Communication**: HTTPS-only communication
- **Error Handling**: Secure error messages without information disclosure
- **Access Control**: Role-based permissions and private routes

For detailed security documentation, see [SECURITY.md](./SECURITY.md).

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
    utils/                # Security and utility functions
  package.json            # Project metadata and dependencies
  vite.config.js          # Vite configuration
  MONETIZATION_ALGORITHM.md # Monetization logic and explanation
  SECURITY.md             # Security documentation
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
   - Add your Firebase config to `Backend/firebase/auth/auth.js`.

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
