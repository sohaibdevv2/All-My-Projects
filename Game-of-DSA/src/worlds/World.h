#pragma once
#include "raylib.h"
#include "raymath.h"
#include "../core/GameState.h"
#include "../screens/Screen.h"
#include "../ui/UIComponents.h"
#include "../ui/Particle.h"
#include <string>
#include <vector>
#include <functional>

// Base class for all DSA worlds — also implements IScreen interface
class World : public IScreen {
public:
    float       anim      = 0.0f;
    float       score     = 0.0f;
    int         ops       = 0;       // operation count
    bool        showHelp  = false;
    bool        paused    = false;

    std::string worldName;
    Color       themeColor;

    ParticleSystem particles;
    NotificationSystem notifications;

    World() : particles(400), notifications(6) {}
    virtual ~World() = default;

    virtual void Init(GameContext& ctx)              = 0;
    virtual void Update(GameContext& ctx, float dt)  = 0;
    virtual void Draw(GameContext& ctx, Font font)   = 0;
    virtual void Cleanup()                           = 0;
    virtual Screen GetID() const                     = 0;

protected:
    // Common HUD elements
    void DrawHUD(Font font, GameContext& ctx, float sw, float sh) {
        // Top bar
        DrawRectangle(0, 0, (int)sw, 52, DSAColors::BG_PANEL);
        DrawLineEx({ 0, 52 }, { sw, 52 }, 1, ColorAlpha(themeColor, 0.5f));

        // World name
        DrawGlowText(font, worldName.c_str(), { 16, 10 }, 24, 1, themeColor, 0.3f);

        // Score
        std::string sc = "SCORE: " + std::to_string((int)score);
        DrawTextEx(font, sc.c_str(), { sw/2 - 60, 16 }, 16, 1, DSAColors::NEON_GOLD);

        // Ops counter
        std::string op = "OPS: " + std::to_string(ops);
        DrawTextEx(font, op.c_str(), { sw - 160, 16 }, 14, 1, DSAColors::TEXT_SECONDARY);

        // Player level
        std::string lv = "LVL " + std::to_string(ctx.player.level);
        DrawTextEx(font, lv.c_str(), { sw - 80, 16 }, 14, 1, DSAColors::NEON_GOLD);

        notifications.Draw(font, sw);
    }

    void DrawBackButton(Font font, GameContext& ctx, Screen backTo = Screen::WORLD_SELECT) {
        CyberButton back({ 16, 60, 90, 30 }, "< EXIT", themeColor, 12);
        if (back.Update(0.016f)) {
            ctx.currentScreen = backTo;
        }
        back.Draw(font);
    }

    void DrawComplexityInfo(Font font, const std::string& timeC, const std::string& spaceC,
                            float x, float y) {
        GlassPanel panel({ x, y, 200, 70 }, "COMPLEXITY", themeColor);
        panel.Draw(font);
        DrawTextEx(font, ("Time:  " + timeC).c_str(), { x + 12, y + 44 }, 13, 1, DSAColors::NEON_GREEN);
        DrawTextEx(font, ("Space: " + spaceC).c_str(), { x + 12, y + 60 }, 13, 1, DSAColors::NEON_CYAN);
    }

    void GainScore(float amount) {
        score += amount;
        ops++;
    }
};
