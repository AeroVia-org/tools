# AeroVia Tools

A collection of open-source aerospace engineering calculators and tools built with Next.js and TypeScript.

## 🚀 Features

- **ISA Calculator**: Calculate atmospheric properties using the International Standard Atmosphere model
- **Orbital Period & Velocity**: Calculate orbital characteristics for satellites
- **Hohmann Transfer**: Calculate delta-v requirements for orbital transfers
- **Unit Converter**: Convert between common aerospace units
- **Mach Number Calculator**: Calculate Mach number and local speed of sound
- **Reynolds Number Calculator**: Determine Reynolds number for fluid flow
- **Normal Shock Calculator**: Calculate property changes across shock waves
- **Rocket Equation Calculator**: Estimate rocket delta-v performance
- **Isentropic Flow Calculator**: Calculate pressure, temperature, and density ratios
- **Radar Range Equation**: Estimate maximum radar detection range

## 🛠️ Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- React Icons

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/aerovia-tools.git
cd aerovia-tools
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000/tools](http://localhost:3000/tools) in your browser.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── tools/           # All calculator tools
│   │   ├── isa-calculator/
│   │   ├── orbital-calculator/
│   │   ├── hohmann-transfer/
│   │   └── ...
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
└── lib/               # Utility functions and constants
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code structure and naming conventions
- Ensure all new tools are added to the tools page
- Add proper TypeScript types for all functions and components
- Include appropriate error handling and input validation
- Add comments for complex calculations
- Update the README.md if adding new features

## 📧 Contact

For any questions or suggestions, please open an issue in the repository.
