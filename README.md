# OnyxUi

> Beautiful code snippets, icons, and color palettes with stunning OKLCH themes

A modern web application for creating and exporting beautiful code snippets, custom icons, and dynamic color systems. Built with React, TypeScript, and Tailwind CSS.

## Features

### 📝 Code Snippets
- Live code editor with syntax highlighting
- 6 beautiful themes (AMOLED, Dracula, GitHub Light, Monokai, One Dark, Tokyo Night)
- Custom gradient backgrounds
- Multiple language support (JavaScript, TypeScript, Python, Java, C++, HTML, CSS, JSON, XML, Bash)
- macOS-style window controls
- Adjustable padding and font size
- Export as PNG or copy to clipboard

### 🎨 Icon Maker
- 800+ icons from Lucide React
- Searchable and categorized
- Customizable size, stroke width, and colors
- Background options (none, solid, gradient)
- Export as PNG or copy to clipboard

### 🌈 Color System Generator
- Real-time dynamic color palette generation
- OKLCH color space for perceptually uniform colors
- Interactive sliders for saturation and hue control
- Live preview of all color tokens
- Export CSS variables
- Alert component previews

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📦 Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **OKLCH** - Perceptually uniform color space

## 🎨 Color System

The app uses OKLCH color space for better perceptual uniformity:

```css
--bg-dark: oklch(0.1 0.065 240);
--bg: oklch(0.15 0.065 240);
--primary: oklch(0.76 0.13 240);
--secondary: oklch(0.76 0.13 60);
```

## 📁 Project Structure

```
/src
├── features/          # Feature modules
│   ├── snippet-maker/ # Code snippet generator
│   ├── icon-maker/    # Icon customization tool
│   └── color-system/  # Color palette generator
├── ui/                # Shared UI components
├── logic/             # Utility functions
└── types/             # TypeScript types
```

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

---

Made with ❤️ using modern web technologies
