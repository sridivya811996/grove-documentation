# Grove App Icon Design Specification

## Brand Identity
- **App Name**: Grove
- **Tagline**: "Beyond the group chat"
- **Primary Color**: Forest Green `#2D6A4F`
- **Secondary Color**: Sage Green `#52B788`
- **Accent Color**: Warm Coral `#E07A5F`

## Icon Concept
The Grove icon represents a **stylized tree** formed by connected circles, symbolizing:
- Community (connected nodes/people)
- Growth (tree shape)
- Nature (fits the "Grove" name and forest green branding)

## Icon Design Elements

### Main Icon (1024x1024 base)
```
Visual Description:
- Background: Solid Forest Green (#2D6A4F) with subtle rounded corners
- Foreground: White/cream stylized tree made of circles

Tree Structure:
- One large circle at top (trunk crown) - represents the community
- Three medium circles below, connected to crown
- Two smaller circles at the bottom (roots)
- Thin connecting lines between circles

Alternative concept:
- Three overlapping circles forming a trefoil/trinity shape
- Represents multiple communities coming together
- Simple, modern, memorable
```

### Color Variants
1. **Primary** (for light backgrounds): White tree on Forest Green
2. **Monochrome Light**: Forest Green tree on white
3. **Monochrome Dark**: White tree on dark background

## Required Sizes

### iOS
- `icon.png`: 1024x1024 (App Store)
- 180x180 (iPhone @3x)
- 120x120 (iPhone @2x)
- 167x167 (iPad Pro @2x)
- 152x152 (iPad @2x)

### Android
- `adaptive-icon.png` (foreground): 432x432 (centered on 1024x1024 canvas)
- `ic_launcher.png`: 512x512
- `ic_launcher_round.png`: 512x512 (circular)

### Notification Icon (Android)
- `notification-icon.png`: 96x96
- Must be white silhouette on transparent background

## Splash Screen Design

### Layout
```
+---------------------------+
|                           |
|                           |
|     [Grove Icon]          |
|        64x64              |
|                           |
|        Grove              |
|     (Forest Green text)   |
|                           |
|                           |
+---------------------------+

Background: White (#FFFFFF)
Icon: Forest Green tree icon (simplified)
Text: "Grove" in semibold, Forest Green (#2D6A4F)
```

### Splash Sizes
- `splash-icon.png`: 200x200 (Expo default)
- Background color: `#2D6A4F` (set in app.json)

## Implementation Notes

### For Expo
The current app.json references:
- `./assets/icon.png` - Main app icon
- `./assets/adaptive-icon.png` - Android adaptive icon foreground
- `./assets/splash-icon.png` - Splash screen icon
- `./assets/notification-icon.png` - Android notification icon
- `./assets/favicon.png` - Web favicon

### Generating Icons
Use one of these tools:
1. **Figma** - Design and export at multiple sizes
2. **Icon Kitchen** (icon.kitchen) - Android adaptive icon generator
3. **App Icon Generator** (appicon.co) - All sizes for iOS/Android
4. **Expo Icon Builder** - expo.github.io/expo-cli/icon-builder/

### SVG Source (for vector editing)
Create a master SVG file that can be exported to all sizes.

## Quick Placeholder Generation

For development, you can use these placeholder colors:
- Background: #2D6A4F (Forest Green)
- Foreground elements: #FFFFFF (White)

The current assets folder should contain placeholder images.
Run `npx expo install expo-asset` and regenerate icons when ready.
