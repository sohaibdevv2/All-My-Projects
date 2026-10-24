#pragma once
#include "Screen.h"
#include <cmath>

class SplashScreen : public IScreen {
public:
    float timer    = 0.0f;
    float fadeOut  = 0.0f;
    bool  done     = false;
    ParticleSystem particles;
    float logoScale = 0.0f;
    float glowPulse = 0.0f;

    SplashScreen() : particles(200) {}

    void Init(GameContext&) override {
        timer    = 0;
        fadeOut  = 0;
        done     = false;
        logoScale = 0;
    }

    void Update(GameContext& ctx, float dt) override {
        timer += dt;
        glowPulse = sinf(timer * 3.0f) * 0.5f + 0.5f;
        logoScale = Ease::OutElastic(Clamp(timer / 0.8f, 0.0f, 1.0f));

        // Emit ambient particles
        if (timer < 3.0f) {
            float sw = (float)GetScreenWidth();
            float sh = (float)GetScreenHeight();
            if (rand() % 3 == 0) {
                particles.EmitSparkle(
                    { (float)(rand() % (int)sw), sh },
                    rand() % 2 == 0 ? DSAColors::NEON_CYAN : DSAColors::NEON_PINK
                );
            }
        }
        particles.Update(dt);

        // After 0.5s, start fading if key/click pressed OR after 3.5s auto-skip
        if (timer > 3.5f || (timer > 0.5f && (IsKeyPressed(KEY_SPACE) || IsMouseButtonPressed(MOUSE_LEFT_BUTTON)))) {
            fadeOut += dt * 2.5f;
            if (fadeOut >= 1.0f) {
                ctx.currentScreen = Screen::MAIN_MENU;
            }
        }
    }

    void Draw(GameContext&, Font font) override {
        float sw = (float)GetScreenWidth();
        float sh = (float)GetScreenHeight();
        ClearBackground(DSAColors::BG_DARK);

        // Starfield grid
        for (int x = 0; x < (int)sw; x += 60)
            for (int y = 0; y < (int)sh; y += 60)
                DrawCircle(x, y, 1, ColorAlpha(DSAColors::NEON_CYAN, 0.08f));

        particles.Draw();

        // Central logo
        float cx = sw / 2.0f, cy = sh / 2.0f;

        // Outer ring glow
        float ringR = 120.0f * logoScale;
        DrawCircleLines((int)cx, (int)cy, ringR + 2,
                        ColorAlpha(DSAColors::NEON_CYAN, glowPulse * 0.5f * logoScale));
        DrawCircleLines((int)cx, (int)cy, ringR,
                        ColorAlpha(DSAColors::NEON_CYAN, 0.7f * logoScale));
        DrawCircleLines((int)cx, (int)cy, ringR - 10,
                        ColorAlpha(DSAColors::NEON_PINK, 0.4f * logoScale));

        // Inner fill
        DrawCircle((int)cx, (int)cy, ringR - 12,
                   ColorAlpha(DSAColors::BG_MID, 0.9f));

        // Logo text - "DSA"
        float bigSize = 64.0f * logoScale;
        const char* dsaText = "DSA";
        Vector2 dsaSz = MeasureTextEx(font, dsaText, bigSize, 2);
        DrawGlowText(font, dsaText,
                     { cx - dsaSz.x/2, cy - dsaSz.y/2 - 10 },
                     bigSize, 2, DSAColors::NEON_CYAN, glowPulse * 0.6f);

        // Subtitle
        float subSize = 18.0f * logoScale;
        const char* sub = "GAME OF";
        Vector2 subSz = MeasureTextEx(font, sub, subSize, 1);
        DrawTextEx(font, sub, { cx - subSz.x/2, cy - dsaSz.y/2 - 34 },
                   subSize, 1, ColorAlpha(DSAColors::NEON_PINK, logoScale));

        // Tagline
        if (timer > 1.0f) {
            float ta = Ease::OutCubic(Clamp((timer - 1.0f) / 0.6f, 0.0f, 1.0f));
            const char* tag = "ALGORITHM ADVENTURE ENGINE";
            Vector2 tagSz = MeasureTextEx(font, tag, 14, 2);
            DrawTextEx(font, tag, { cx - tagSz.x/2, cy + 90 * logoScale },
                       14, 2, ColorAlpha(DSAColors::TEXT_SECONDARY, ta));
        }

        // Skip hint
        if (timer > 1.5f) {
            float ha = sinf((timer - 1.5f) * 2.0f) * 0.4f + 0.4f;
            const char* hint = "Press SPACE or Click to Continue";
            Vector2 hSz = MeasureTextEx(font, hint, 12, 1);
            DrawTextEx(font, hint, { cx - hSz.x/2, sh - 50 },
                       12, 1, ColorAlpha(DSAColors::TEXT_DIM, ha));
        }

        // Fade overlay
        if (fadeOut > 0.0f) {
            DrawRectangle(0, 0, (int)sw, (int)sh, ColorAlpha(BLACK, fadeOut));
        }
    }

    void Cleanup() override { particles.Clear(); }
    Screen GetID() const override { return Screen::SPLASH; }
};
