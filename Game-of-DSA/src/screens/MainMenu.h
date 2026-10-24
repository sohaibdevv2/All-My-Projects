#pragma once
#include "Screen.h"
#include <vector>
#include <cmath>

class MainMenuScreen : public IScreen {
public:
    struct MenuEntry {
        std::string label;
        std::string sub;
        Screen      target;
        Color       accent;
        CyberButton btn;
    };

    std::vector<MenuEntry> entries;
    BackgroundParticles*   bgParts = nullptr;
    ParticleSystem         fxParticles;
    float                  anim = 0.0f;
    float                  titleBob = 0.0f;

    // Animated header letters
    std::vector<float> letterAnims;
    const char* TITLE = "GAME OF DSA";

    MainMenuScreen() : fxParticles(300) {}

    void Init(GameContext& ctx) override {
        anim = 0;
        float sw = (float)GetScreenWidth();
        float sh = (float)GetScreenHeight();

        if (!bgParts) bgParts = new BackgroundParticles(sw, sh, 120);

        float btnW = 320, btnH = 52;
        float bx   = sw/2 - btnW/2;
        float by   = sh/2 - 60;
        float gap  = 62;

        entries = {
            { "STORY MODE",          "Epic DSA adventure campaign",          Screen::WORLD_SELECT,    DSAColors::NEON_CYAN },
            { "PRACTICE ARENA",      "Drill individual concepts",            Screen::PRACTICE_ARENA,  DSAColors::NEON_GREEN },
            { "ALGORITHM VISUALIZER","Interactive algorithm animations",     Screen::ALGO_VISUALIZER, DSAColors::NEON_PURPLE },
            { "DAILY CHALLENGE",     "New challenge every 24 hours",         Screen::DAILY_CHALLENGE, DSAColors::NEON_GOLD },
            { "LEADERBOARD",         "Global rankings",                      Screen::LEADERBOARD,     DSAColors::NEON_PINK },
            { "PROFILE",             ctx.player.isLoggedIn ? ctx.player.username : "Sign In", Screen::LOGIN, DSAColors::NEON_BLUE },
            { "SETTINGS",            "Audio, graphics, controls",            Screen::SETTINGS,        DSAColors::TEXT_SECONDARY },
        };

        // Adjust "Profile" entry for logged-in user
        if (ctx.player.isLoggedIn) entries[5].target = Screen::PROFILE;

        for (int i = 0; i < (int)entries.size(); i++) {
            entries[i].btn = CyberButton(
                { bx, by + i * gap, btnW, btnH },
                entries[i].label,
                entries[i].accent, 18
            );
        }

        letterAnims.assign(strlen(TITLE), 0.0f);
    }

    void Update(GameContext& ctx, float dt) override {
        anim += dt;
        titleBob = sinf(anim * 1.2f) * 4.0f;

        // Animate title letters
        for (int i = 0; i < (int)letterAnims.size(); i++) {
            float target = Ease::OutElastic(Clamp((anim - i * 0.06f) / 0.5f, 0.0f, 1.0f));
            letterAnims[i] += (target - letterAnims[i]) * 8.0f * dt;
        }

        if (bgParts) bgParts->Update(dt);
        fxParticles.Update(dt);

        for (auto& e : entries) {
            if (e.btn.Update(dt)) {
                // Emit burst at button
                Vector2 bCenter = { e.btn.rect.x + e.btn.rect.width/2,
                                    e.btn.rect.y + e.btn.rect.height/2 };
                fxParticles.Emit(bCenter, e.accent, 20, 150.0f, 0.8f, 5.0f);
                ctx.currentScreen = e.target;
                return;
            }
        }

        // Exit key
        if (IsKeyPressed(KEY_ESCAPE)) ctx.currentScreen = Screen::EXIT;
    }

    void Draw(GameContext& ctx, Font font) override {
        float sw = (float)GetScreenWidth();
        float sh = (float)GetScreenHeight();

        ClearBackground(DSAColors::BG_DARK);

        // Animated background grid
        DrawGrid(sw, sh);

        if (bgParts) bgParts->Draw();
        fxParticles.Draw();

        // Left panel decoration
        DrawLeftPanel(font, sw, sh, ctx);

        // === Animated Title ===
        float titleY  = 55.0f + titleBob;
        float charSize = 52.0f;
        float spacing  = 4.0f;

        // Measure total width
        float totalW = 0;
        for (int i = 0; i < (int)strlen(TITLE); i++) {
            char ch[2] = { TITLE[i], 0 };
            totalW += MeasureTextEx(font, ch, charSize, spacing).x + spacing;
        }
        float startX = sw/2 - totalW/2;
        float cx = startX;

        for (int i = 0; i < (int)strlen(TITLE); i++) {
            char ch[2] = { TITLE[i], 0 };
            if (TITLE[i] == ' ') { cx += 18; continue; }

            float drop = (1.0f - letterAnims[i]) * 60.0f;
            float alpha = letterAnims[i];

            // Alternate colors
            Color col = (i % 5 == 0) ? DSAColors::NEON_CYAN
                      : (i % 5 == 1) ? DSAColors::NEON_PINK
                      : (i % 5 == 2) ? DSAColors::NEON_GREEN
                      : (i % 5 == 3) ? DSAColors::NEON_PURPLE
                      : DSAColors::NEON_GOLD;
            col = ColorAlpha(col, alpha);

            Vector2 chSz = MeasureTextEx(font, ch, charSize, spacing);
            DrawGlowText(font, ch, { cx, titleY + drop }, charSize, spacing, col, 0.3f * alpha);
            cx += chSz.x + spacing;
        }

        // Subtitle
        float subAlpha = Ease::OutCubic(Clamp((anim - 0.8f) / 0.5f, 0.0f, 1.0f));
        const char* sub = "— Interactive Algorithm Adventure Engine —";
        Vector2 subSz = MeasureTextEx(font, sub, 14, 2);
        DrawTextEx(font, sub, { sw/2 - subSz.x/2, 115 }, 14, 2,
                   ColorAlpha(DSAColors::TEXT_SECONDARY, subAlpha));

        // Horizontal divider
        float divAlpha = Ease::OutCubic(Clamp((anim - 1.0f) / 0.4f, 0.0f, 1.0f));
        float divY = 138;
        DrawLineEx({ sw/2 - 200*divAlpha, divY }, { sw/2 + 200*divAlpha, divY }, 1,
                   ColorAlpha(DSAColors::NEON_CYAN, divAlpha * 0.5f));

        // Player status badge (top-right)
        DrawPlayerBadge(font, ctx, sw);

        // Menu buttons
        for (int i = 0; i < (int)entries.size(); i++) {
            float delay = 1.2f + i * 0.08f;
            float btnAlpha = Ease::OutCubic(Clamp((anim - delay) / 0.4f, 0.0f, 1.0f));
            // Fade-in + slide-in from right
            float origX = entries[i].btn.rect.x;
            entries[i].btn.rect.x = origX + (1.0f - btnAlpha) * 80;
            entries[i].btn.Draw(font);
            entries[i].btn.rect.x = origX;
        }

        // Version
        DrawTextEx(font, "v1.0.0  |  C++ + Raylib  |  github.com/sohaibdevv/Game-of-DSA",
                   { 10, sh - 22 }, 11, 1, DSAColors::TEXT_DIM);

        DrawScanlines({ 0, 0, sw, sh }, 0.02f);
    }

    void Cleanup() override {
        delete bgParts; bgParts = nullptr;
        fxParticles.Clear();
    }

    Screen GetID() const override { return Screen::MAIN_MENU; }

private:
    void DrawGrid(float sw, float sh) {
        float t = GetTime() * 0.3f;
        Color gc = ColorAlpha(DSAColors::NEON_CYAN, 0.04f);
        for (float x = 0; x < sw; x += 80) DrawLine((int)x, 0, (int)x, (int)sh, gc);
        for (float y = 0; y < sh; y += 80) DrawLine(0, (int)y, (int)sw, (int)y, gc);
        // Moving horizontal scan line
        float scanY = fmodf(t * 120.0f, sh);
        DrawLineEx({ 0, scanY }, { sw, scanY }, 1, ColorAlpha(DSAColors::NEON_CYAN, 0.08f));
    }

    void DrawLeftPanel(Font font, float sw, float sh, const GameContext& ctx) {
        // Stats panel
        float px = 40, py = 160, pw = 200, ph = 280;
        if (ctx.player.isLoggedIn) {
            GlassPanel panel({ px, py, pw, ph }, "PLAYER STATS", DSAColors::NEON_GREEN);
            panel.Draw(font);

            float fy = py + 48;
            auto statRow = [&](const char* label, const std::string& val, Color col) {
                DrawTextEx(font, label, { px+16, fy }, 11, 1, DSAColors::TEXT_SECONDARY);
                DrawTextEx(font, val.c_str(), { px+pw-16 - MeasureTextEx(font, val.c_str(), 14, 1).x, fy }, 14, 1, col);
                fy += 28;
            };

            statRow("LEVEL",    std::to_string(ctx.player.level),          DSAColors::NEON_GOLD);
            statRow("XP",       std::to_string(ctx.player.xp),             DSAColors::NEON_CYAN);
            statRow("SOLVED",   std::to_string(ctx.player.totalSolved),    DSAColors::NEON_GREEN);
            statRow("STREAK",   std::to_string(ctx.player.streak) + " days", DSAColors::NEON_ORANGE);
            statRow("COINS",    std::to_string(ctx.player.coins),          DSAColors::NEON_GOLD);
            statRow("RANK",     ctx.player.rankName(),                     DSAColors::NEON_PURPLE);

            fy += 8;
            ProgressBar xpBar({ px+16, fy, pw-32, 16 }, DSAColors::NEON_CYAN, true, "XP");
            xpBar.SetValue(ctx.player.xpProgress());
            xpBar.displayValue = ctx.player.xpProgress();
            xpBar.Draw(font);
        }
    }

    void DrawPlayerBadge(Font font, const GameContext& ctx, float sw) {
        float px = sw - 210, py = 14, pw = 200, ph = 50;
        DrawRectangle((int)px, (int)py, (int)pw, (int)ph, DSAColors::BG_PANEL);
        DrawRectangleLinesEx({ px, py, pw, ph }, 1, ColorAlpha(DSAColors::NEON_CYAN, 0.3f));

        if (ctx.player.isLoggedIn) {
            DrawTextEx(font, ctx.player.username.c_str(), { px+12, py+8 }, 14, 1, DSAColors::TEXT_PRIMARY);
            std::string lv = "Level " + std::to_string(ctx.player.level) + " • " + ctx.player.rankName();
            DrawTextEx(font, lv.c_str(), { px+12, py+26 }, 11, 1, DSAColors::NEON_GOLD);
        } else {
            DrawTextEx(font, "GUEST PLAYER", { px+12, py+8 }, 14, 1, DSAColors::TEXT_SECONDARY);
            DrawTextEx(font, "Sign in to save progress", { px+12, py+26 }, 10, 1, DSAColors::TEXT_DIM);
        }
    }
};
