# Witchfire Randomizer

A web application for players of the game Witchfire to create and randomize loadouts with element preferences and detailed item information.

## Features

### Loadout Randomizer
- Generate balanced loadouts with optional element preferences
- Exclude specific items from randomization
- Real-time display of elements present in the current loadout
- One-click re-randomization

### Loadout Manager
- Manual selection of items for each loadout slot
- Visual representation of the complete loadout
- Real-time display of currently equipped element types
- Visual indicators for empty slots

### Item Wiki
- Browsable catalog of all game items
- Categorized view with tabs for each item type
- Search functionality by item name
- Filtering by element
- Detailed view of individual items showing all properties
- Visual indication of mysterium progression and unlocks

## Technology Stack

- **Framework**: Next.js with React 18+
- **Styling**: Tailwind CSS
- **State Management**: React Context API with hooks
- **Data Storage**: JSON files for item database

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Data Structure

The application uses a structured data model for game items:

- **Base Item**: Common properties for all items (id, name, category, element, etc.)
- **Weapon**: Extended properties specific to weapons (damage, range, etc.)
- **Mysterium Levels**: Each item has 3 mysterium levels with effects and requirements

## Disclaimer

This is an unofficial fan project and is not affiliated with The Astronauts or Witchfire.
