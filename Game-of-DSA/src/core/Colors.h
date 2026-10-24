#pragma once
#include "raylib.h"

// Cyber-futuristic color palette for Game of DSA
namespace DSAColors {
    // Backgrounds
    constexpr Color BG_DARK        = { 8,   10,  20,  255 };
    constexpr Color BG_MID         = { 12,  16,  32,  255 };
    constexpr Color BG_PANEL       = { 15,  20,  40,  200 };
    constexpr Color BG_PANEL_SOLID = { 18,  24,  48,  255 };

    // Neon accents
    constexpr Color NEON_CYAN      = { 0,   255, 255, 255 };
    constexpr Color NEON_PINK      = { 255, 0,   128, 255 };
    constexpr Color NEON_GREEN     = { 0,   255, 128, 255 };
    constexpr Color NEON_PURPLE    = { 160, 0,   255, 255 };
    constexpr Color NEON_GOLD      = { 255, 200, 0,   255 };
    constexpr Color NEON_ORANGE    = { 255, 120, 0,   255 };
    constexpr Color NEON_RED       = { 255, 50,  50,  255 };
    constexpr Color NEON_BLUE      = { 50,  120, 255, 255 };

    // Dimmed variants (for inactive/disabled)
    constexpr Color DIM_CYAN       = { 0,   120, 140, 180 };
    constexpr Color DIM_PINK       = { 140, 0,   80,  180 };
    constexpr Color DIM_GREEN      = { 0,   140, 80,  180 };
    constexpr Color DIM_PURPLE     = { 80,  0,   140, 180 };

    // World theme colors
    constexpr Color ARRAY_COLOR    = { 0,   200, 100, 255 }; // Green forest
    constexpr Color STACK_COLOR    = { 255, 80,  20,  255 }; // Volcano orange
    constexpr Color QUEUE_COLOR    = { 50,  150, 255, 255 }; // Railway blue
    constexpr Color TREE_COLOR     = { 180, 100, 255, 255 }; // Kingdom purple
    constexpr Color GRAPH_COLOR    = { 255, 200, 0,   255 }; // City gold
    constexpr Color SORT_COLOR     = { 0,   220, 220, 255 }; // Arena cyan
    constexpr Color RECUR_COLOR    = { 255, 50,  200, 255 }; // Temple pink
    constexpr Color HASH_COLOR     = { 100, 255, 50,  255 }; // Cyber arena green
    constexpr Color HEAP_COLOR     = { 255, 150, 0,   255 }; // Heap amber
    constexpr Color DP_COLOR       = { 80,  200, 255, 255 }; // Time realm teal

    // Text
    constexpr Color TEXT_PRIMARY   = { 220, 230, 255, 255 };
    constexpr Color TEXT_SECONDARY = { 140, 160, 200, 200 };
    constexpr Color TEXT_DIM       = { 80,  90,  120, 180 };
    constexpr Color TEXT_WHITE     = { 255, 255, 255, 255 };

    // Utility
    constexpr Color TRANSPARENT    = { 0,   0,   0,   0   };
    constexpr Color GLOW_CYAN      = { 0,   255, 255, 60  };
    constexpr Color GLOW_PINK      = { 255, 0,   128, 60  };
    constexpr Color GLOW_GREEN     = { 0,   255, 128, 60  };

    // XP / Rarity
    constexpr Color COMMON         = { 180, 180, 180, 255 };
    constexpr Color RARE           = { 50,  120, 255, 255 };
    constexpr Color EPIC           = { 160, 0,   255, 255 };
    constexpr Color LEGENDARY      = { 255, 180, 0,   255 };
}

// Helper: color with alpha
inline Color ColorAlpha(Color c, float alpha) {
    return { c.r, c.g, c.b, (unsigned char)(alpha * 255) };
}

// Helper: lerp between two colors
inline Color ColorLerp(Color a, Color b, float t) {
    return {
        (unsigned char)(a.r + (b.r - a.r) * t),
        (unsigned char)(a.g + (b.g - a.g) * t),
        (unsigned char)(a.b + (b.b - a.b) * t),
        (unsigned char)(a.a + (b.a - a.a) * t)
    };
}
