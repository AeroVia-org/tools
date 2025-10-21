# AeroVia Tools

An open-source collection of aerospace engineering calculators and visualization tools designed to make aerospace education and research more accessible. This repository contains the tools platform of the AeroVia ecosystem, which remains synchronized with the main AeroVia monorepo (which is closed-source for security reasons).

## 🎯 Mission

Our goal is to create a comprehensive aerospace open-source tool repository that serves:

- **Professors** - Visualize course concepts and enhance teaching materials
- **Researchers** - Accelerate calculations and validate theoretical models
- **Students** - Understand complex aerospace topics through interactive tools
- **Enthusiasts** - Learn aerospace concepts through hands-on exploration

We believe aerospace knowledge should be accessible to everyone, regardless of background or resources.

## 🚀 Featured Tools

Our growing collection includes tools across multiple aerospace disciplines:

- **Atmospheric & Flight**: ISA Calculator, Mach Number Calculator, Aircraft Performance tools
- **Aerodynamics**: Reynolds Number, Normal/Oblique Shock, Isentropic Flow calculators
- **Propulsion**: Rocket Equation, TWR Calculator, Specific Impulse Converter
- **Orbital Mechanics**: Hohmann Transfer, Delta-V Budget, Orbital Period calculators
- **Communications**: Radar Range Equation, RF Link Budget tools
- **General Utilities**: Unit Converter, Coordinate System Converter, Scientific Calculator

_And many more tools across Structures, Mission Planning, Astronomy, Navigation, UAV Operations, and Photography/Imaging categories._

## 🛠️ Tech Stack

- **Next.js** - React framework for the web
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality, accessible component library
- **Vitest** - Unit testing framework
- **React Icons** - Comprehensive icon library

## ⚡ Getting Started

### Prerequisites

- Node.js (v20 or higher)
- bun (v1.3 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AeroVia-org/aerovia-tools
cd aerovia-tools
```

2. Install dependencies:

```bash
bun install
```

3. Run the development server:

```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production

## 🏗️ Project Structure

```
├── app/
│   ├── (tools)/             # Tool folders
│   │   ├── mach-calculator/
│   │   │   ├── page.tsx     # Main tool page
│   │   │   ├── logic.ts     # Calculation logic
│   │   │   ├── logic.test.ts # Unit tests
│   │   │   ├── theory.tsx   # Explanation of underlying theory
│   │   │   └── visualization.tsx # Interactive visualization
│   │   └── ...
│   ├── components/          # Shared components
│   ├── page.tsx             # Home page showing list of tools
│   ├── tools.ts             # Tool registry and metadata
│   └── tools.test.ts        # Tool registry tests
├── packages/                # Shared UI components (shadcn/ui)
│   └── ui/
│       └── components/ui/   # Individual component files
└── lib/                     # Utility functions
```

## Shadcn/ui

We use [shadcn/ui](https://ui.shadcn.com/) as our component library, which provides beautifully designed, accessible components built on top of Radix UI primitives. This ensures our tools have consistent, professional interfaces while maintaining excellent accessibility standards.

**Important**: When importing shadcn/ui components, always use the `@packages/ui` path instead of relative paths. For example:

```tsx
// ✅ Correct
import { Button } from "@packages/ui/components/ui/button";
import { Input } from "@packages/ui/components/ui/input";

// ❌ Avoid
import { Button } from "./components/ui/button";
```

This mapping is configured in `tsconfig.json` to point `@packages/ui` to the root directory. This setup ensures compatibility with the main AeroVia monorepo, where `@packages/ui` maps to a shared UI package.

## 🧪 Testing Philosophy

We use **Vitest** for comprehensive unit testing of our calculation logic. Every tool includes a `logic.test.ts` file that validates our implementations against trusted reference values from textbooks, standards, and academic sources.

This approach ensures our tools provide accurate, reliable results that users can trust for educational and research purposes.

## 🤝 Contributing

We welcome contributions from the aerospace community! Here's how to add a new tool:

### Adding a New Tool

1. **Add tool metadata** to `app/tools.ts`:

   ```typescript
   {
     type: "active",
     key: "your-tool-key",
     title: "Your Tool Name",
     icon: FaYourIcon,
     description: "Brief description of what the tool does",
     category: "Your Category",
     authors: ["your-author-id"],
   }
   ```

2. **Create tool folder** at `app/(tools)/your-tool-key/`

3. **Implement required files**:

   - `page.tsx` - Main tool interface and user interaction
   - `logic.ts` - Core calculation functions with proper TypeScript types
   - `logic.test.ts` - Comprehensive unit tests using Vitest
   - `theory.tsx` - Educational content explaining the underlying physics/math
   - `visualization.tsx` - Interactive charts and visualizations (optional)

4. **Follow our standards**:
   - Use semantic color classes from our design system
   - Include comprehensive error handling and input validation
   - Add detailed comments for complex calculations
   - Ensure all functions are properly typed (no `any` types)
   - Test against known reference values from trusted sources

### Development Guidelines

- Follow existing code structure and naming conventions
- Use shadcn/ui components from `@packages/ui/components/ui/`
- Include proper TypeScript types for all functions and components
- Add comprehensive unit tests with known input/output pairs
- Include educational content in Theory sections
- Update documentation when adding new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions, suggestions, or collaboration opportunities:

- Open an issue in the repository
- Email: contact@aerovia.org

---

_Making aerospace accessible through open-source tools and education._
