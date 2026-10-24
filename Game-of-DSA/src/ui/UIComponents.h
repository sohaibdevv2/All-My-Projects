#pragma once
#include "raylib.h"
#include "raymath.h"
#include "../core/Colors.h"
#include <string>
#include <functional>
#include <cmath>

// Easing functions
namespace Ease {
    inline float InOutQuad(float t) {
        return t < 0.5f ? 2*t*t : -1+(4-2*t)*t;
    }
    inline float OutCubic(float t) {
        float f = t - 1.0f;
        return f*f*f + 1.0f;
    }
    inline float InCubic(float t) {
        return t*t*t;
    }
    inline float OutElastic(float t) {
        if (t == 0 || t == 1) return t;
        float p = 0.3f;
        return powf(2, -10*t) * sinf((t - p/4) * (2*PI) / p) + 1.0f;
    }
    inline float OutBounce(float t) {
        if (t < 1/2.75f) return 7.5625f*t*t;
        if (t < 2/2.75f) { t -= 1.5f/2.75f; return 7.5625f*t*t + 0.75f; }
        if (t < 2.5f/2.75f) { t -= 2.25f/2.75f; return 7.5625f*t*t + 0.9375f; }
        t -= 2.625f/2.75f;
        return 7.5625f*t*t + 0.984375f;
    }
    inline float OutQuart(float t) {
        float f = t - 1.0f;
        return 1.0f - f*f*f*f;
    }
    inline float Pulse(float t, float freq = 1.0f) {
        return 0.5f + 0.5f * sinf(t * freq * 2.0f * PI);
    }
}

// Cyberpunk-styled animated button
class CyberButton {
public:
    Rectangle rect;
    std::string label;
    Color       accentColor;
    bool        hovered    = false;
    bool        pressed    = false;
    float       hoverAnim  = 0.0f; // 0..1
    float       pressAnim  = 0.0f;
    bool        enabled    = true;
    int         fontSize   = 20;
    std::function<void()> onClick;

    CyberButton() = default;
    CyberButton(Rectangle r, const std::string& lbl, Color accent = DSAColors::NEON_CYAN,
                int fs = 20)
        : rect(r), label(lbl), accentColor(accent), fontSize(fs) {}

    bool Update(float dt) {
        if (!enabled) return false;
        Vector2 mouse = GetMousePosition();
        hovered = CheckCollisionPointRec(mouse, rect);

        hoverAnim += (hovered ? 5.0f : -5.0f) * dt;
        hoverAnim = Clamp(hoverAnim, 0.0f, 1.0f);

        pressAnim -= 5.0f * dt;
        pressAnim = Clamp(pressAnim, 0.0f, 1.0f);

        if (hovered && IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) {
            pressAnim = 1.0f;
            pressed = true;
            if (onClick) onClick();
            return true;
        }
        pressed = false;
        return false;
    }

    void Draw(Font font) const {
        float scale  = 1.0f + hoverAnim * 0.04f - pressAnim * 0.02f;
        float ex     = rect.width  * (1.0f - scale) / 2.0f;
        float ey     = rect.height * (1.0f - scale) / 2.0f;
        Rectangle r  = { rect.x + ex, rect.y + ey, rect.width * scale, rect.height * scale };

        // Shadow / glow
        if (hoverAnim > 0.01f) {
            float gSize = hoverAnim * 12.0f;
            Color gc = ColorAlpha(accentColor, hoverAnim * 0.25f);
            DrawRectangleLinesEx({ r.x - gSize, r.y - gSize,
                                   r.width + gSize*2, r.height + gSize*2 }, 2, gc);
        }

        // Background
        Color bgColor = enabled
            ? ColorLerp(DSAColors::BG_PANEL, ColorAlpha(accentColor, 0.15f), hoverAnim)
            : ColorAlpha(DSAColors::BG_PANEL, 0.5f);
        DrawRectangleRec(r, bgColor);

        // Border
        Color borderColor = enabled
            ? ColorLerp(DSAColors::DIM_CYAN, accentColor, hoverAnim)
            : DSAColors::TEXT_DIM;
        DrawRectangleLinesEx(r, 2, borderColor);

        // Corner accents
        float cs = 8.0f;
        DrawLineEx({ r.x, r.y }, { r.x + cs, r.y }, 2, accentColor);
        DrawLineEx({ r.x, r.y }, { r.x, r.y + cs }, 2, accentColor);
        DrawLineEx({ r.x + r.width, r.y }, { r.x + r.width - cs, r.y }, 2, accentColor);
        DrawLineEx({ r.x + r.width, r.y + cs }, { r.x + r.width, r.y }, 2, accentColor);
        DrawLineEx({ r.x, r.y + r.height }, { r.x + cs, r.y + r.height }, 2, accentColor);
        DrawLineEx({ r.x, r.y + r.height - cs }, { r.x, r.y + r.height }, 2, accentColor);
        DrawLineEx({ r.x + r.width, r.y + r.height }, { r.x + r.width - cs, r.y + r.height }, 2, accentColor);
        DrawLineEx({ r.x + r.width, r.y + r.height - cs }, { r.x + r.width, r.y + r.height }, 2, accentColor);

        // Text
        Color textColor = enabled
            ? ColorLerp(DSAColors::TEXT_SECONDARY, DSAColors::TEXT_WHITE, hoverAnim)
            : DSAColors::TEXT_DIM;

        Vector2 textSz = MeasureTextEx(font, label.c_str(), (float)fontSize, 1);
        Vector2 textPos = {
            r.x + r.width/2 - textSz.x/2,
            r.y + r.height/2 - textSz.y/2
        };
        DrawTextEx(font, label.c_str(), textPos, (float)fontSize, 1, textColor);
    }
};

// Glass panel with optional title bar
class GlassPanel {
public:
    Rectangle rect;
    std::string title;
    Color       accentColor;
    float       cornerSize;

    GlassPanel(Rectangle r, const std::string& t = "", Color accent = DSAColors::NEON_CYAN,
               float cs = 12.0f)
        : rect(r), title(t), accentColor(accent), cornerSize(cs) {}

    void Draw(Font font) const {
        // Main panel
        DrawRectangleRec(rect, DSAColors::BG_PANEL);
        // Border
        DrawRectangleLinesEx(rect, 1, ColorAlpha(accentColor, 0.5f));

        // Corner accents
        float cs = cornerSize;
        Color ac = accentColor;
        // TL
        DrawLineEx({ rect.x, rect.y }, { rect.x + cs, rect.y }, 2, ac);
        DrawLineEx({ rect.x, rect.y }, { rect.x, rect.y + cs }, 2, ac);
        // TR
        DrawLineEx({ rect.x + rect.width, rect.y }, { rect.x + rect.width - cs, rect.y }, 2, ac);
        DrawLineEx({ rect.x + rect.width, rect.y + cs }, { rect.x + rect.width, rect.y }, 2, ac);
        // BL
        DrawLineEx({ rect.x, rect.y + rect.height }, { rect.x + cs, rect.y + rect.height }, 2, ac);
        DrawLineEx({ rect.x, rect.y + rect.height - cs }, { rect.x, rect.y + rect.height }, 2, ac);
        // BR
        DrawLineEx({ rect.x + rect.width, rect.y + rect.height }, { rect.x + rect.width - cs, rect.y + rect.height }, 2, ac);
        DrawLineEx({ rect.x + rect.width, rect.y + rect.height - cs }, { rect.x + rect.width, rect.y + rect.height }, 2, ac);

        // Title bar
        if (!title.empty()) {
            DrawRectangle((int)rect.x, (int)rect.y, (int)rect.width, 36,
                          ColorAlpha(accentColor, 0.15f));
            DrawLineEx({ rect.x, rect.y + 36 }, { rect.x + rect.width, rect.y + 36 }, 1,
                       ColorAlpha(accentColor, 0.5f));
            Vector2 tSz = MeasureTextEx(font, title.c_str(), 16, 1);
            DrawTextEx(font, title.c_str(),
                       { rect.x + rect.width/2 - tSz.x/2, rect.y + 10 },
                       16, 1, DSAColors::TEXT_PRIMARY);
        }
    }
};

// Animated progress bar
class ProgressBar {
public:
    Rectangle rect;
    float     value;    // 0..1
    float     displayValue = 0.0f;
    Color     fillColor;
    Color     bgColor;
    bool      showPercent;
    std::string label;

    ProgressBar(Rectangle r, Color fill = DSAColors::NEON_CYAN,
                bool pct = false, const std::string& lbl = "")
        : rect(r), value(0), fillColor(fill), bgColor(DSAColors::BG_PANEL_SOLID),
          showPercent(pct), label(lbl) {}

    void SetValue(float v) { value = Clamp(v, 0.0f, 1.0f); }

    void Update(float dt) {
        displayValue += (value - displayValue) * 5.0f * dt;
    }

    void Draw(Font font) const {
        // Background
        DrawRectangleRec(rect, bgColor);
        DrawRectangleLinesEx(rect, 1, ColorAlpha(fillColor, 0.3f));

        // Fill
        if (displayValue > 0.001f) {
            Rectangle fill = { rect.x, rect.y, rect.width * displayValue, rect.height };
            DrawRectangleRec(fill, ColorAlpha(fillColor, 0.8f));
            // Shine
            DrawRectangle((int)fill.x, (int)fill.y, (int)(fill.width), (int)(fill.height / 3),
                          ColorAlpha(WHITE, 0.1f));
        }

        // Glow edge
        if (displayValue > 0.01f) {
            float ex = rect.x + rect.width * displayValue;
            DrawLineEx({ ex, rect.y }, { ex, rect.y + rect.height }, 2,
                       ColorAlpha(fillColor, 0.9f));
        }

        // Label + percent
        if (!label.empty() || showPercent) {
            std::string txt = label;
            if (showPercent) txt += (label.empty() ? "" : " ") + std::to_string((int)(displayValue * 100)) + "%";
            Vector2 sz = MeasureTextEx(font, txt.c_str(), 13, 1);
            DrawTextEx(font, txt.c_str(),
                       { rect.x + rect.width/2 - sz.x/2, rect.y + rect.height/2 - sz.y/2 },
                       13, 1, DSAColors::TEXT_WHITE);
        }
    }
};

// Floating notification
struct Notification {
    std::string message;
    Color       color;
    float       life;       // time remaining
    float       totalLife;
    Vector2     pos;
    bool        active = false;
};

class NotificationSystem {
public:
    std::vector<Notification> notes;

    NotificationSystem(int max = 5) { notes.resize(max); }

    void Push(const std::string& msg, Color color = DSAColors::NEON_GREEN, float life = 3.0f) {
        for (auto& n : notes) {
            if (!n.active) {
                n.message   = msg;
                n.color     = color;
                n.life      = life;
                n.totalLife = life;
                n.active    = true;
                return;
            }
        }
        // Overwrite oldest
        notes[0].message   = msg;
        notes[0].color     = color;
        notes[0].life      = life;
        notes[0].totalLife = life;
        notes[0].active    = true;
    }

    void Update(float dt) {
        for (auto& n : notes) {
            if (n.active) {
                n.life -= dt;
                if (n.life <= 0) n.active = false;
            }
        }
    }

    void Draw(Font font, float screenW) const {
        float y = 80.0f;
        for (const auto& n : notes) {
            if (!n.active) continue;
            float alpha = Clamp(n.life / 0.5f, 0.0f, 1.0f); // fade out last 0.5s
            float slideIn = Ease::OutCubic(Clamp((n.totalLife - n.life) / 0.3f, 0.0f, 1.0f));

            Vector2 sz = MeasureTextEx(font, n.message.c_str(), 16, 1);
            float pw = sz.x + 30;
            float px = screenW - pw - 20 + (1.0f - slideIn) * 200;

            DrawRectangle((int)px, (int)y - 8, (int)pw, 36, ColorAlpha(DSAColors::BG_PANEL_SOLID, alpha * 0.95f));
            DrawRectangleLinesEx({ px, y - 8, pw, 36 }, 1, ColorAlpha(n.color, alpha * 0.8f));
            DrawTextEx(font, n.message.c_str(), { px + 15, y }, 16, 1, ColorAlpha(n.color, alpha));

            y += 46;
        }
    }
};

// Animated number counter
struct AnimCounter {
    float displayed = 0;
    float target    = 0;
    float speed     = 5.0f;

    void SetTarget(float v, bool instant = false) {
        target = v;
        if (instant) displayed = v;
    }
    void Update(float dt) {
        displayed += (target - displayed) * speed * dt;
        if (fabsf(displayed - target) < 0.5f) displayed = target;
    }
    int Value() const { return (int)displayed; }
};

// Glowing text draw helper
inline void DrawGlowText(Font font, const char* text, Vector2 pos, float size,
                         float spacing, Color color, float glowIntensity = 0.4f) {
    Color glow = ColorAlpha(color, glowIntensity);
    for (int dx = -2; dx <= 2; dx++)
        for (int dy = -2; dy <= 2; dy++)
            if (dx != 0 || dy != 0)
                DrawTextEx(font, text, { pos.x + dx, pos.y + dy }, size, spacing, glow);
    DrawTextEx(font, text, pos, size, spacing, color);
}

// Scan-line effect rectangle
inline void DrawScanlines(Rectangle r, float alpha = 0.04f) {
    for (int y = (int)r.y; y < (int)(r.y + r.height); y += 4) {
        DrawLine((int)r.x, y, (int)(r.x + r.width), y, ColorAlpha(BLACK, alpha));
    }
}
