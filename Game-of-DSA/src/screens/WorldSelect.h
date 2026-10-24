#pragma once
#include "Screen.h"
#include <vector>
#include <cmath>

struct WorldCard {
    Screen      target;
    std::string id;
    std::string name;
    std::string description;
    std::string dsaConcept;
    Color       color;
    Color       dimColor;
    bool        unlocked;
    float       hoverAnim = 0.0f;
    float       completionRate = 0.0f;
    int         stars = 0;
    // Icon segments (drawn procedurally)
    int         iconType; // 0-9 for different icons
};

class WorldSelectScreen : public IScreen {
public:
    std::vector<WorldCard> worlds;
    BackgroundParticles*   bgParts = nullptr;
    ParticleSystem         fxParts;
    float anim     = 0.0f;
    float scrollY  = 0.0f;
    float targetScrollY = 0.0f;
    int   hoveredIdx = -1;
    float headerAnim = 0.0f;

    WorldSelectScreen() : fxParts(200) {}

    void Init(GameContext& ctx) override {
        anim = 0; scrollY = 0; targetScrollY = 0;
        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();
        if (!bgParts) bgParts = new BackgroundParticles(sw, sh, 100);

        worlds = {
            { Screen::WORLD_ARRAY_FOREST,    "array",     "ARRAY FOREST",
              "Navigate the living forest of elements",  "Arrays & Searching",
              DSAColors::ARRAY_COLOR, DSAColors::DIM_GREEN, true,  0, 0.6f, 2, 0 },
            { Screen::WORLD_STACK_VOLCANO,   "stack",     "STACK VOLCANO",
              "Master the ancient volcano of operations", "Stacks & LIFO",
              DSAColors::STACK_COLOR, { 120,40,10,180 }, true,  0, 0.3f, 1, 1 },
            { Screen::WORLD_QUEUE_RAILWAY,   "queue",     "QUEUE RAILWAY",
              "Operate the great algorithm railway",      "Queues & FIFO",
              DSAColors::QUEUE_COLOR, DSAColors::DIM_CYAN, true,  0, 0.0f, 0, 2 },
            { Screen::WORLD_TREE_KINGDOM,    "tree",      "TREE KINGDOM",
              "Rule the binary search tree kingdom",      "BST & Tree Traversal",
              DSAColors::TREE_COLOR,  DSAColors::DIM_PURPLE, false, 0, 0.0f, 0, 3 },
            { Screen::WORLD_GRAPH_CITY,      "graph",     "GRAPH CITY",
              "Explore the connected metropolitan graph", "Graphs & Pathfinding",
              DSAColors::GRAPH_COLOR, { 120,100,0,180 }, false, 0, 0.0f, 0, 4 },
            { Screen::WORLD_SORTING_ARENA,   "sort",      "SORTING ARENA",
              "Battle in the legendary sorting colosseum","Sorting Algorithms",
              DSAColors::SORT_COLOR,  { 0,100,100,180 }, false, 0, 0.0f, 0, 5 },
            { Screen::WORLD_RECURSION_TEMPLE,"recursion", "RECURSION TEMPLE",
              "Unravel the infinite recursion mysteries", "Recursion & Backtracking",
              DSAColors::RECUR_COLOR, { 120,25,100,180 }, false, 0, 0.0f, 0, 6 },
            { Screen::WORLD_HASH_ARENA,      "hash",      "HASH CYBER ARENA",
              "Compete in the cyber hashing tournament",  "Hash Maps & Collision",
              DSAColors::HASH_COLOR,  { 50,120,25,180 }, false, 0, 0.0f, 0, 7 },
            { Screen::WORLD_HEAP_MOUNTAIN,   "heap",      "HEAP MOUNTAIN",
              "Conquer the priority queue summit",        "Heaps & Priority Queues",
              DSAColors::HEAP_COLOR,  { 120,75,0,180 }, false, 0, 0.0f, 0, 8 },
            { Screen::WORLD_DP_REALM,        "dp",        "DP TIME REALM",
              "Master optimal substructure & memoization","Dynamic Programming",
              DSAColors::DP_COLOR,    { 40,100,120,180 }, false, 0, 0.0f, 0, 9 },
        };

        // Sync with player progress
        for (auto& w : worlds) {
            if (ctx.player.worlds.count(w.id)) {
                auto& wp = ctx.player.worlds[w.id];
                w.unlocked        = wp.unlocked;
                w.completionRate  = wp.starsEarned / 3.0f;
                w.stars           = wp.starsEarned;
            }
        }
        // Always unlock first 3 for new players
        if (worlds.size() > 2) {
            worlds[0].unlocked = true;
            worlds[1].unlocked = true;
            worlds[2].unlocked = true;
        }
    }

    void Update(GameContext& ctx, float dt) override {
        anim += dt;
        headerAnim += (1.0f - headerAnim) * 3.0f * dt;

        if (bgParts) bgParts->Update(dt);
        fxParts.Update(dt);

        // Scroll
        float wheel = GetMouseWheelMove();
        targetScrollY -= wheel * 60.0f;
        float maxScroll = fmaxf(0.0f, worlds.size() / 2.5f * 180.0f - 300.0f);
        targetScrollY = Clamp(targetScrollY, 0.0f, maxScroll);
        scrollY += (targetScrollY - scrollY) * 8.0f * dt;

        float sw = (float)GetScreenWidth();
        float sh = (float)GetScreenHeight();

        // Card layout: 2 columns
        int cols = 2;
        float cardW = 380, cardH = 160;
        float padX = (sw - cols * cardW - 20) / 2.0f;
        float startY = 150 - scrollY;

        hoveredIdx = -1;
        for (int i = 0; i < (int)worlds.size(); i++) {
            int row = i / cols, col = i % cols;
            float cx = padX + col * (cardW + 20);
            float cy = startY + row * (cardH + 16);
            Rectangle r = { cx, cy, cardW, cardH };

            bool hovered = CheckCollisionPointRec(GetMousePosition(), r);
            worlds[i].hoverAnim += (hovered ? 5.0f : -5.0f) * dt;
            worlds[i].hoverAnim = Clamp(worlds[i].hoverAnim, 0.0f, 1.0f);

            if (hovered) hoveredIdx = i;

            if (hovered && IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) {
                if (worlds[i].unlocked) {
                    fxParts.Emit({ cx + cardW/2, cy + cardH/2 }, worlds[i].color, 25, 200, 1.0f, 6.0f);
                    ctx.activeWorldId   = worlds[i].id;
                    ctx.currentScreen   = worlds[i].target;
                    return;
                }
            }
        }

        if (IsKeyPressed(KEY_ESCAPE)) ctx.currentScreen = Screen::MAIN_MENU;
    }

    void Draw(GameContext& ctx, Font font) override {
        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();
        ClearBackground(DSAColors::BG_DARK);
        DrawGrid(sw, sh);
        if (bgParts) bgParts->Draw();
        fxParts.Draw();

        // Header
        DrawRectangle(0, 0, (int)sw, 130, DSAColors::BG_PANEL);
        DrawLineEx({ 0, 130 }, { sw, 130 }, 1, ColorAlpha(DSAColors::NEON_CYAN, 0.4f));
        DrawGlowText(font, "CHOOSE YOUR WORLD", { sw/2 - 195, 20 }, 40, 2,
                     DSAColors::NEON_CYAN, 0.3f);
        DrawTextEx(font, "Select a DSA Kingdom to enter and master its challenges",
                   { sw/2 - 235, 72 }, 14, 1, DSAColors::TEXT_SECONDARY);

        // Player XP bar at top right
        DrawTextEx(font, ("LVL " + std::to_string(ctx.player.level)).c_str(),
                   { sw - 200, 20 }, 16, 1, DSAColors::NEON_GOLD);
        ProgressBar xpBar({ sw - 200, 42, 190, 14 }, DSAColors::NEON_GOLD);
        xpBar.SetValue(ctx.player.xpProgress());
        xpBar.displayValue = ctx.player.xpProgress();
        xpBar.Draw(font);

        // Back button
        CyberButton backBtn({ 20, 20, 100, 36 }, "< BACK", DSAColors::NEON_CYAN, 14);
        if (backBtn.Update(0.016f)) ctx.currentScreen = Screen::MAIN_MENU;
        backBtn.Draw(font);

        // World cards
        int cols = 2;
        float cardW = 380, cardH = 160;
        float padX = (sw - cols * cardW - 20) / 2.0f;
        float startY = 150 - scrollY;

        for (int i = 0; i < (int)worlds.size(); i++) {
            int row = i / cols, col = i % cols;
            float cx = padX + col * (cardW + 20);
            float cy = startY + row * (cardH + 16);
            if (cy < 130 - cardH || cy > sh + 10) continue;

            float delay = 0.05f * i;
            float fadeIn = Ease::OutCubic(Clamp((anim - delay) / 0.4f, 0.0f, 1.0f));

            DrawWorldCard(font, worlds[i], cx, cy + (1.0f - fadeIn) * 30,
                          cardW, cardH, fadeIn);
        }

        // Scroll indicator
        if (worlds.size() > 5) {
            float maxScroll = worlds.size() / 2.5f * 180.0f - 300.0f;
            float pct = scrollY / maxScroll;
            float barH = 80;
            float barY = 160 + pct * (sh - 200 - barH);
            DrawRectangle((int)sw - 6, (int)barY, 4, (int)barH,
                          ColorAlpha(DSAColors::NEON_CYAN, 0.4f));
        }

        DrawScanlines({ 0, 0, sw, sh }, 0.015f);
    }

    void Cleanup() override {
        delete bgParts; bgParts = nullptr;
        fxParts.Clear();
    }

    Screen GetID() const override { return Screen::WORLD_SELECT; }

private:
    void DrawGrid(float sw, float sh) {
        Color gc = ColorAlpha(DSAColors::NEON_PURPLE, 0.04f);
        for (float x = 0; x < sw; x += 60) DrawLine((int)x, 0, (int)x, (int)sh, gc);
        for (float y = 0; y < sh; y += 60) DrawLine(0, (int)y, (int)sw, (int)y, gc);
    }

    void DrawWorldCard(Font font, const WorldCard& w, float x, float y,
                       float W, float H, float alpha) {
        float ha = w.hoverAnim;
        float sx = x - ha * 3, sy = y - ha * 4;
        float sW = W + ha * 6, sH = H + ha * 8;

        // Glow shadow
        if (ha > 0.01f && w.unlocked) {
            DrawRectangle((int)sx - 4, (int)sy - 4, (int)sW + 8, (int)sH + 8,
                          ColorAlpha(w.color, ha * 0.15f * alpha));
        }

        // Background
        Color bg = w.unlocked
            ? ColorLerp(DSAColors::BG_PANEL_SOLID, ColorAlpha(w.color, 0.08f), ha)
            : ColorAlpha(DSAColors::BG_PANEL_SOLID, 0.5f);
        DrawRectangle((int)sx, (int)sy, (int)sW, (int)sH, ColorAlpha(bg, alpha));

        // Border
        Color border = w.unlocked
            ? ColorLerp(ColorAlpha(w.color, 0.3f), w.color, ha)
            : ColorAlpha(DSAColors::TEXT_DIM, 0.3f);
        DrawRectangleLinesEx({ sx, sy, sW, sH }, w.unlocked ? 2 : 1, ColorAlpha(border, alpha));

        // Color stripe on left
        if (w.unlocked) {
            DrawRectangle((int)sx, (int)sy, 5, (int)sH,
                          ColorAlpha(w.color, alpha * 0.9f));
        }

        // Icon area
        float ix = sx + 20, iy = sy + 20;
        DrawWorldIcon(w.iconType, ix, iy, 60, 60, w.unlocked ? w.color : DSAColors::TEXT_DIM, alpha);

        // Info area
        float tx = ix + 80, ty = sy + 18;

        // Name
        Color nameCol = w.unlocked
            ? ColorLerp(DSAColors::TEXT_PRIMARY, w.color, ha * 0.6f)
            : DSAColors::TEXT_DIM;
        DrawTextEx(font, w.name.c_str(), { tx, ty }, 20, 1, ColorAlpha(nameCol, alpha));

        // DSA concept badge
        ty += 28;
        Vector2 badgeSz = MeasureTextEx(font, w.dsaConcept.c_str(), 11, 1);
        DrawRectangle((int)tx, (int)ty, (int)badgeSz.x + 12, 18,
                      ColorAlpha(w.color, 0.15f * alpha));
        DrawTextEx(font, w.dsaConcept.c_str(), { tx + 6, ty + 3 }, 11, 1,
                   ColorAlpha(w.color, alpha));
        ty += 24;

        // Description
        DrawTextEx(font, w.description.c_str(), { tx, ty }, 12, 1,
                   ColorAlpha(DSAColors::TEXT_SECONDARY, alpha * 0.85f));

        // Progress / stars
        if (w.unlocked) {
            ty = sy + H - 32;
            // Stars
            for (int s = 0; s < 3; s++) {
                Color sc = s < w.stars ? DSAColors::NEON_GOLD : ColorAlpha(DSAColors::TEXT_DIM, 0.4f);
                DrawTextEx(font, "★", { tx + s * 20.0f, ty }, 16, 1, ColorAlpha(sc, alpha));
            }
            // Progress bar
            Rectangle pb = { tx + 70, ty + 3, 180, 10 };
            DrawRectangleRec(pb, ColorAlpha(DSAColors::BG_DARK, alpha));
            DrawRectangle((int)pb.x, (int)pb.y, (int)(pb.width * w.completionRate), (int)pb.height,
                          ColorAlpha(w.color, alpha * 0.8f));
            DrawRectangleLinesEx(pb, 1, ColorAlpha(w.color, alpha * 0.4f));
        } else {
            // Locked overlay
            float lx = sx + sW/2 - 15, ly = sy + 10;
            DrawTextEx(font, "🔒", { lx, ly }, 24, 1, ColorAlpha(DSAColors::TEXT_DIM, alpha * 0.6f));
            DrawTextEx(font, "LOCKED", { lx - 10, ly + 30 }, 11, 2,
                       ColorAlpha(DSAColors::TEXT_DIM, alpha * 0.5f));
        }

        // "ENTER" hint on hover
        if (ha > 0.5f && w.unlocked) {
            const char* hint = "PRESS TO ENTER >";
            Vector2 hSz = MeasureTextEx(font, hint, 12, 1);
            DrawTextEx(font, hint, { sx + sW - hSz.x - 14, sy + sH - 22 },
                       12, 1, ColorAlpha(w.color, (ha - 0.5f) * 2.0f * alpha));
        }
    }

    void DrawWorldIcon(int type, float x, float y, float w, float h, Color col, float alpha) {
        Color c = ColorAlpha(col, alpha * 0.9f);
        Color cd = ColorAlpha(col, alpha * 0.4f);
        float cx = x + w/2, cy = y + h/2;

        switch (type) {
        case 0: // Array: horizontal bars
            for (int i = 0; i < 5; i++) {
                float bw = (0.4f + 0.12f * i) * w;
                DrawRectangle((int)(x + w/2 - bw/2), (int)(y + 8 + i*11), (int)bw, 8, i < 3 ? c : cd);
            }
            break;
        case 1: // Stack: stacked blocks
            for (int i = 0; i < 4; i++) {
                float by = y + h - 12 - i * 14;
                DrawRectangle((int)(x+10), (int)by, (int)(w-20), 11, i == 3 ? c : cd);
                DrawRectangleLinesEx({ x+10, by, w-20, 11 }, 1, c);
            }
            break;
        case 2: // Queue: horizontal boxes in a row
            for (int i = 0; i < 4; i++) {
                float bx = x + 4 + i * 14;
                DrawRectangle((int)bx, (int)(cy-8), 11, 16, i == 0 ? c : cd);
                DrawRectangleLinesEx({ bx, cy-8, 11, 16 }, 1, c);
            }
            DrawLineEx({ x + 60, cy }, { x + w - 4, cy }, 2, c);
            break;
        case 3: // Tree: binary tree
            DrawCircle((int)cx, (int)(y+10), 7, c);
            DrawCircle((int)(cx-18), (int)(y+32), 6, cd);
            DrawCircle((int)(cx+18), (int)(y+32), 6, cd);
            DrawLineEx({ cx, y+17 }, { cx-18, y+26 }, 1, c);
            DrawLineEx({ cx, y+17 }, { cx+18, y+26 }, 1, c);
            DrawCircle((int)(cx-28), (int)(y+52), 5, cd);
            DrawCircle((int)(cx-8),  (int)(y+52), 5, cd);
            DrawLineEx({ cx-18, y+38 }, { cx-28, y+47 }, 1, cd);
            DrawLineEx({ cx-18, y+38 }, { cx-8,  y+47 }, 1, cd);
            break;
        case 4: // Graph: nodes connected
            DrawCircle((int)(cx-20), (int)(cy-15), 7, c);
            DrawCircle((int)(cx+20), (int)(cy-15), 7, cd);
            DrawCircle((int)(cx),    (int)(cy+20), 7, cd);
            DrawLineEx({ cx-13, cy-15 }, { cx+13, cy-15 }, 1, c);
            DrawLineEx({ cx-17, cy-8 },  { cx-3, cy+13 }, 1, c);
            DrawLineEx({ cx+17, cy-8 },  { cx+3, cy+13 }, 1, cd);
            break;
        case 5: // Sort: bars of different heights
            for (int i = 0; i < 5; i++) {
                float heights[] = { 30, 50, 20, 45, 35 };
                float bx = x + 6 + i * 12;
                float bh = heights[i] * 0.9f;
                DrawRectangle((int)bx, (int)(y + h - 8 - bh), 9, (int)bh,
                              i == 2 ? c : cd);
            }
            break;
        case 6: // Recursion: nested circles
            for (int i = 0; i < 4; i++) {
                float r = (4 - i) * 12.0f;
                DrawCircleLines((int)cx, (int)cy, r, ColorAlpha(col, alpha * (0.3f + 0.2f * i)));
            }
            DrawCircle((int)cx, (int)cy, 4, c);
            break;
        case 7: // Hash: grid
            for (int i = 0; i < 3; i++)
                for (int j = 0; j < 3; j++) {
                    float bx = x + 8 + j * 20, by = y + 8 + i * 20;
                    DrawRectangle((int)bx, (int)by, 14, 14,
                                  (i + j) % 2 == 0 ? c : cd);
                }
            break;
        case 8: // Heap: triangle of circles
            DrawCircle((int)cx, (int)(y+12), 8, c);
            DrawCircle((int)(cx-18), (int)(y+34), 7, cd);
            DrawCircle((int)(cx+18), (int)(y+34), 7, cd);
            DrawLineEx({ cx, y+20 }, { cx-18, y+27 }, 1, c);
            DrawLineEx({ cx, y+20 }, { cx+18, y+27 }, 1, c);
            break;
        case 9: // DP: grid with arrows
            for (int i = 0; i < 3; i++)
                for (int j = 0; j < 3; j++) {
                    DrawRectangleLinesEx({ x + 6 + j*19.0f, y + 6 + i*19.0f, 16, 16 }, 1,
                                        (i == 2 && j == 2) ? c : cd);
                }
            DrawTextEx(GetFontDefault(), "opt", { x + 6, y + 44 }, 10, 1, c);
            break;
        }
    }
};
