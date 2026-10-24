#pragma once
#include "World.h"
#include <vector>
#include <string>

struct StackBlock {
    int   value;
    float y;
    float targetY;
    float alpha;
    Color color;
    float glow;
    float shake; // for pop animation
};

class StackVolcanoWorld : public World {
public:
    std::vector<StackBlock> stack;
    static constexpr int MAX_STACK = 10;
    static constexpr float BLOCK_W = 120.0f;
    static constexpr float BLOCK_H = 48.0f;
    static constexpr float STACK_X = 0; // computed in draw

    float volcanoFlare  = 0.0f;
    float lavaRise      = 0.0f;
    float popAnim       = 0.0f;  // 0..1 flying element
    bool  popping       = false;
    StackBlock poppedBlock;

    std::string inputBuf;
    bool showInput = false;

    float challengeTimer = 30.0f;
    std::vector<int> challengeSeq;
    int    challengeStep  = 0;
    bool   challengeMode  = false;

    // Quiz
    struct Question {
        std::string prompt;
        std::vector<std::string> choices;
        int correct;
        bool answered = false;
    };
    std::vector<Question> quizzes;
    int quizIdx = -1;

    void Init(GameContext&) override {
        worldName  = "STACK VOLCANO";
        themeColor = DSAColors::STACK_COLOR;
        stack.clear();
        inputBuf.clear();
        showInput    = false;
        popping      = false;
        popAnim      = 0.0f;
        volcanoFlare = 0.0f;
        score        = 0;
        ops          = 0;
        challengeMode = false;

        // Sample initial stack
        PushVal(42, true);
        PushVal(17, true);
        PushVal(88, true);

        // Setup challenges
        challengeSeq = { 10, 20, 30, 40 };

        quizzes = {
            { "What operation removes the TOP element?",
              { "ENQUEUE", "POP", "INSERT", "DELETE" }, 1 },
            { "Stack follows which principle?",
              { "FIFO", "FILO", "LILO", "LIFO" }, 3 },
            { "PUSH time complexity is?",
              { "O(n)", "O(log n)", "O(1)", "O(n²)" }, 2 },
            { "What does PEEK do?",
              { "Removes top", "Returns top without removing", "Clears stack", "Sorts stack" }, 1 },
        };
    }

    void Update(GameContext& ctx, float dt) override {
        anim        += dt;
        particles.Update(dt);
        notifications.Update(dt);
        volcanoFlare = fmaxf(0.0f, volcanoFlare - dt * 1.5f);
        lavaRise    = sinf(anim * 1.2f) * 0.5f + 0.5f;

        // Animate stack blocks
        float sw   = (float)GetScreenWidth();
        float sh   = (float)GetScreenHeight();
        float sx   = sw / 2.0f - BLOCK_W / 2.0f;
        float baseY = sh - 200.0f;

        for (int i = 0; i < (int)stack.size(); i++) {
            stack[i].targetY = baseY - i * (BLOCK_H + 4);
            stack[i].y += (stack[i].targetY - stack[i].y) * 7.0f * dt;
            stack[i].glow = fmaxf(0.0f, stack[i].glow - dt * 1.5f);
            stack[i].shake *= (1.0f - dt * 5.0f);
        }

        // Pop animation
        if (popping) {
            popAnim += dt * 2.5f;
            poppedBlock.y -= 200.0f * dt;
            poppedBlock.alpha = 1.0f - popAnim;
            if (popAnim >= 1.0f) {
                popping = false;
                particles.EmitBurst({ sx + BLOCK_W/2, (float)sh/2 - 100 },
                                    poppedBlock.color, -PI/2, PI, 20, 200, 0.8f);
            }
        }

        // Input
        if (showInput) {
            int key = GetCharPressed();
            while (key > 0) {
                if ((key >= '0' && key <= '9') && inputBuf.size() < 4) inputBuf += (char)key;
                key = GetCharPressed();
            }
            if (IsKeyPressed(KEY_BACKSPACE) && !inputBuf.empty()) inputBuf.pop_back();
            if (IsKeyPressed(KEY_ENTER)) {
                if (!inputBuf.empty()) {
                    PushVal(std::stoi(inputBuf));
                    inputBuf.clear();
                }
                showInput = false;
            }
            if (IsKeyPressed(KEY_ESCAPE)) { showInput = false; inputBuf.clear(); }
        }

        if (IsKeyPressed(KEY_ESCAPE) && !showInput) ctx.currentScreen = Screen::WORLD_SELECT;
    }

    void Draw(GameContext& ctx, Font font) override {
        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();

        // Dark volcanic background
        for (int y = 0; y < (int)sh; y += 2) {
            float t = (float)y / sh;
            Color c = ColorLerp({ 20, 5, 3, 255 }, { 8, 2, 1, 255 }, t);
            DrawLine(0, y, (int)sw, y, c);
        }

        DrawVolcano(sw, sh);
        DrawHUD(font, ctx, sw, sh);
        DrawBackButton(font, ctx);

        DrawStackVisualization(font, sw, sh);
        DrawControlPanel(font, sw, sh);
        DrawInfoPanel(font, sw, sh);
        DrawComplexityInfo(font, "O(1)", "O(n)", sw - 220, 60);

        // Popped element fly animation
        if (popping) {
            DrawRectangle((int)(sw/2 - BLOCK_W/2), (int)(poppedBlock.y),
                          (int)BLOCK_W, (int)BLOCK_H,
                          ColorAlpha(poppedBlock.color, poppedBlock.alpha * 0.4f));
            DrawRectangleLinesEx({ sw/2 - BLOCK_W/2, poppedBlock.y, BLOCK_W, BLOCK_H },
                                 2, ColorAlpha(poppedBlock.color, poppedBlock.alpha));
            std::string vs = std::to_string(poppedBlock.value);
            Vector2 vSz = MeasureTextEx(font, vs.c_str(), 22, 1);
            DrawTextEx(font, vs.c_str(),
                       { sw/2 - vSz.x/2, poppedBlock.y + BLOCK_H/2 - vSz.y/2 },
                       22, 1, ColorAlpha(poppedBlock.color, poppedBlock.alpha));
        }

        particles.Draw();
        DrawScanlines({ 0, 0, sw, sh }, 0.015f);
    }

    void Cleanup() override { particles.Clear(); }
    Screen GetID() const override { return Screen::WORLD_STACK_VOLCANO; }

private:
    void PushVal(int v, bool instant = false) {
        if ((int)stack.size() >= MAX_STACK) {
            notifications.Push("Stack OVERFLOW! Max size " + std::to_string(MAX_STACK),
                               DSAColors::NEON_RED);
            volcanoFlare = 1.0f;
            particles.Emit({ (float)GetScreenWidth()/2, 200 }, DSAColors::NEON_RED, 30, 200, 1.0f);
            return;
        }
        StackBlock b;
        b.value   = v;
        b.targetY = 0;
        b.y       = instant ? 0 : -100.0f;
        b.alpha   = 1.0f;
        b.color   = ColorLerp(DSAColors::STACK_COLOR, DSAColors::NEON_RED,
                              (float)stack.size() / MAX_STACK);
        b.glow    = 1.0f;
        b.shake   = 0.0f;
        stack.push_back(b);

        if (!instant) {
            volcanoFlare = 0.5f;
            notifications.Push("PUSH " + std::to_string(v) + " → top of stack",
                               DSAColors::STACK_COLOR);
            GainScore(10.0f);
            ops++;
        }
    }

    void PopVal() {
        if (stack.empty()) {
            notifications.Push("Stack UNDERFLOW! Cannot pop from empty stack.", DSAColors::NEON_RED);
            return;
        }
        poppedBlock = stack.back();
        poppedBlock.y = stack.back().y;
        stack.pop_back();
        popping = true;
        popAnim = 0.0f;
        volcanoFlare = 0.8f;
        notifications.Push("POP → " + std::to_string(poppedBlock.value) + " removed from top",
                           DSAColors::NEON_ORANGE);
        GainScore(10.0f);
        ops++;
    }

    void DrawVolcano(float sw, float sh) {
        // Volcano mountain shape
        float cx = sw / 2.0f;
        float base = sh - 60.0f;
        float mw = sw * 0.65f;

        // Mountain body
        DrawTriangle(
            { cx, base - 200 },
            { cx - mw/2, base },
            { cx + mw/2, base },
            ColorAlpha({ 35, 15, 8, 255 }, 0.9f)
        );
        // Crater rim
        DrawEllipse((int)cx, (int)(base - 200), (int)(50 + volcanoFlare * 20), 20,
                    { 50, 20, 10, 255 });

        // Lava glow in crater
        float lavaA = 0.4f + volcanoFlare * 0.5f + lavaRise * 0.2f;
        DrawEllipse((int)cx, (int)(base - 200), 40, 15,
                    ColorAlpha(DSAColors::NEON_RED, lavaA));
        DrawEllipse((int)cx, (int)(base - 200), 25, 10,
                    ColorAlpha(DSAColors::NEON_ORANGE, lavaA + 0.1f));

        // Lava particles
        if (volcanoFlare > 0.2f && rand() % 3 == 0) {
            particles.EmitBurst({ cx, base - 200 }, DSAColors::NEON_ORANGE,
                                -PI/2, PI/3, 3, 150.0f * volcanoFlare, 0.6f);
        }

        // Lava river on sides
        for (int s = -1; s <= 1; s += 2) {
            float rx = cx + s * 30;
            for (int i = 0; i < 6; i++) {
                float ry = base - 195 + i * 30;
                float ra = 0.3f - i * 0.04f;
                DrawCircle((int)(rx + s * i * 5), (int)ry, 8, ColorAlpha(DSAColors::NEON_RED, ra));
            }
        }

        // Ground lava pool
        DrawEllipse((int)cx, (int)(sh - 60), (int)(mw/2 * 0.4f), 20,
                    ColorAlpha(DSAColors::NEON_RED, 0.15f + lavaRise * 0.1f));
    }

    void DrawStackVisualization(Font font, float sw, float sh) {
        float sx = sw / 2.0f - BLOCK_W / 2.0f;

        // Stack label
        DrawTextEx(font, "STACK (top → bottom):", { sx - 120, sh - 200 - MAX_STACK * 52 - 30 },
                   12, 1, DSAColors::TEXT_SECONDARY);

        // Empty indicator
        if (stack.empty()) {
            DrawRectangleLinesEx({ sx, sh - 200 - BLOCK_H, BLOCK_W, BLOCK_H }, 1,
                                 ColorAlpha(themeColor, 0.2f));
            Vector2 eSz = MeasureTextEx(font, "EMPTY", 14, 1);
            DrawTextEx(font, "EMPTY", { sx + BLOCK_W/2 - eSz.x/2, sh - 200 - BLOCK_H + 15 },
                       14, 1, ColorAlpha(DSAColors::TEXT_DIM, 0.5f));
        }

        for (int i = (int)stack.size() - 1; i >= 0; i--) {
            auto& b = stack[i];
            float bx = sx + b.shake * 3.0f;
            bool isTop = (i == (int)stack.size() - 1);

            // Glow for top
            if (isTop && b.glow > 0.01f)
                DrawRectangle((int)(bx - 6), (int)(b.y - 4), (int)(BLOCK_W + 12), (int)(BLOCK_H + 8),
                              ColorAlpha(b.color, b.glow * 0.3f));

            DrawRectangle((int)bx, (int)b.y, (int)BLOCK_W, (int)BLOCK_H,
                          ColorAlpha(b.color, 0.25f));
            DrawRectangleLinesEx({ bx, b.y, BLOCK_W, BLOCK_H }, isTop ? 3 : 1,
                                 isTop ? b.color : ColorAlpha(b.color, 0.5f));

            // Lava gradient inside block
            DrawRectangleGradientV((int)bx + 2, (int)b.y + 2, (int)BLOCK_W - 4, 10,
                                   ColorAlpha(b.color, 0.4f), ColorAlpha(b.color, 0.0f));

            // Value
            std::string vs = std::to_string(b.value);
            Vector2 vSz = MeasureTextEx(font, vs.c_str(), 22, 1);
            DrawTextEx(font, vs.c_str(),
                       { bx + BLOCK_W/2 - vSz.x/2, b.y + BLOCK_H/2 - vSz.y/2 },
                       22, 1, b.color);

            // TOP label
            if (isTop) {
                DrawTextEx(font, "◄ TOP", { bx + BLOCK_W + 8, b.y + BLOCK_H/2 - 8 },
                           13, 1, themeColor);
            }
        }

        // Stack depth indicator
        std::string depth = "Depth: " + std::to_string(stack.size()) + "/" + std::to_string(MAX_STACK);
        DrawTextEx(font, depth.c_str(), { sx - 120, sh - 180 }, 12, 1, DSAColors::TEXT_DIM);
    }

    void DrawControlPanel(Font font, float sw, float sh) {
        float py = sh - 140;
        GlassPanel panel({ 20, py, sw - 40, 120 }, "STACK OPERATIONS", themeColor);
        panel.Draw(font);

        float bw = 150, bh = 44, gap = 20;
        float totalBW = 4 * (bw + gap) - gap;
        float bx = sw/2 - totalBW/2;
        float by = py + 44;

        struct Op { std::string lbl; Color col; std::string hint; };
        std::vector<Op> ops2 = {
            { "PUSH",  DSAColors::NEON_GREEN,  "Add to top" },
            { "POP",   DSAColors::NEON_RED,    "Remove top" },
            { "PEEK",  DSAColors::NEON_GOLD,   "View top" },
            { "CLEAR", DSAColors::TEXT_DIM,    "Empty stack" },
        };

        for (int i = 0; i < (int)ops2.size(); i++) {
            CyberButton btn({ bx + i * (bw + gap), by, bw, bh }, ops2[i].lbl, ops2[i].col, 16);
            if (btn.Update(0.016f)) {
                if (ops2[i].lbl == "PUSH") {
                    showInput = true; inputBuf.clear();
                } else if (ops2[i].lbl == "POP") {
                    PopVal();
                } else if (ops2[i].lbl == "PEEK") {
                    if (!stack.empty())
                        notifications.Push("PEEK → Top = " + std::to_string(stack.back().value),
                                           DSAColors::NEON_GOLD);
                    else
                        notifications.Push("Stack is empty!", DSAColors::NEON_RED);
                } else if (ops2[i].lbl == "CLEAR") {
                    stack.clear();
                    notifications.Push("Stack cleared!", DSAColors::NEON_RED);
                }
            }
            btn.Draw(font);

            Vector2 hSz = MeasureTextEx(font, ops2[i].hint.c_str(), 10, 1);
            DrawTextEx(font, ops2[i].hint.c_str(),
                       { bx + i*(bw+gap) + bw/2 - hSz.x/2, by + bh + 4 },
                       10, 1, ColorAlpha(ops2[i].col, 0.6f));
        }

        // Input overlay
        if (showInput) {
            float ix = sw/2 - 160, iy = by - 80;
            DrawRectangle((int)ix - 10, (int)iy - 8, 340, 70, DSAColors::BG_PANEL_SOLID);
            DrawRectangleLinesEx({ ix-10, iy-8, 340, 70 }, 2, themeColor);
            DrawTextEx(font, "Enter value to PUSH:", { ix, iy }, 14, 1, themeColor);
            Rectangle ir = { ix, iy + 22, 320, 34 };
            DrawRectangleRec(ir, DSAColors::BG_DARK);
            DrawRectangleLinesEx(ir, 2, themeColor);
            std::string disp = inputBuf + (fmod(GetTime(), 1.0) < 0.5 ? "|" : "");
            DrawTextEx(font, disp.c_str(), { ix + 8, iy + 30 }, 18, 1, DSAColors::TEXT_WHITE);
        }
    }

    void DrawInfoPanel(Font font, float sw, float) {
        float px = 20, py = 60;
        GlassPanel panel({ px, py, 200, 170 }, "STACK STATE", themeColor);
        panel.Draw(font);

        float fy = py + 44;
        auto row = [&](const char* k, const std::string& v, Color col) {
            DrawTextEx(font, k, { px + 12, fy }, 11, 1, DSAColors::TEXT_SECONDARY);
            DrawTextEx(font, v.c_str(), { px + 12, fy + 14 }, 14, 1, col);
            fy += 32;
        };

        row("SIZE",   std::to_string(stack.size()),                               DSAColors::NEON_CYAN);
        row("TOP",    stack.empty() ? "EMPTY" : std::to_string(stack.back().value), DSAColors::NEON_ORANGE);
        row("BOTTOM", stack.empty() ? "EMPTY" : std::to_string(stack.front().value), DSAColors::TEXT_SECONDARY);
        row("SCORE",  std::to_string((int)score),                                 DSAColors::NEON_GOLD);
    }
};
