#pragma once
#include "World.h"
#include <vector>
#include <algorithm>
#include <sstream>

struct ArrayElement {
    int   value;
    float x, y;
    float targetX, targetY;
    float scale;
    float glow;
    Color color;
    bool  selected;
    bool  highlighted;
    float animOffset;  // for wave effect
};

class ArrayForestWorld : public World {
public:
    std::vector<ArrayElement> elements;
    static constexpr int MAX_SIZE = 12;
    static constexpr float ELEM_W = 60.0f;
    static constexpr float ELEM_H = 60.0f;
    static constexpr float ELEM_GAP = 10.0f;

    // UI state
    int  selectedIdx   = -1;
    int  searchTarget  = -1;
    int  searchIdx     = -1;
    bool searching     = false;
    float searchTimer  = 0.0f;

    // Input
    std::string inputBuf;
    bool showInput = false;
    enum class InputMode { NONE, INSERT, SEARCH, DELETE_IDX } inputMode = InputMode::NONE;

    // Animation
    float waveTime = 0.0f;
    std::vector<float> treeHeights; // visual tree heights

    // Complexity info
    std::string lastOp;
    std::string lastTC = "O(1)";
    std::string lastSC = "O(1)";

    void Init(GameContext&) override {
        worldName  = "ARRAY FOREST";
        themeColor = DSAColors::ARRAY_COLOR;
        elements.clear();
        inputBuf.clear();
        showInput  = false;
        selectedIdx = -1;
        searching   = false;
        score       = 0;
        ops         = 0;

        // Start with a default array
        int defaults[] = { 23, 7, 45, 12, 89, 34 };
        for (int v : defaults) AddElement(v, true);

        treeHeights.assign(MAX_SIZE, 0.0f);
    }

    void Update(GameContext& ctx, float dt) override {
        anim      += dt;
        waveTime  += dt;
        particles.Update(dt);
        notifications.Update(dt);

        // Animate elements to target positions
        float sw = (float)GetScreenWidth();
        float totalW = elements.size() * (ELEM_W + ELEM_GAP) - ELEM_GAP;
        float startX = sw / 2.0f - totalW / 2.0f;

        for (int i = 0; i < (int)elements.size(); i++) {
            auto& e = elements[i];
            e.targetX = startX + i * (ELEM_W + ELEM_GAP);
            e.targetY = 260.0f;
            e.x += (e.targetX - e.x) * 8.0f * dt;
            e.y += (e.targetY - e.y) * 8.0f * dt;
            e.animOffset = sinf(waveTime * 1.5f + i * 0.5f) * 4.0f;

            // Glow decay
            e.glow = fmaxf(0.0f, e.glow - dt * 2.0f);

            // Tree heights animate
            float targetH = 80.0f + elements[i].value * 0.8f;
            treeHeights[i] += (targetH - treeHeights[i]) * 3.0f * dt;
        }
        for (int i = (int)elements.size(); i < MAX_SIZE; i++)
            treeHeights[i] += (0.0f - treeHeights[i]) * 3.0f * dt;

        // Auto linear search step
        if (searching) {
            searchTimer -= dt;
            if (searchTimer <= 0) {
                searchTimer = 0.35f;
                if (searchIdx < (int)elements.size()) {
                    elements[searchIdx].highlighted = true;
                    particles.Emit({ elements[searchIdx].x + ELEM_W/2,
                                     elements[searchIdx].y + ELEM_H/2 },
                                   DSAColors::NEON_GOLD, 5, 60, 0.5f, 3.0f);
                    if (elements[searchIdx].value == searchTarget) {
                        elements[searchIdx].color = DSAColors::NEON_GREEN;
                        elements[searchIdx].glow  = 1.0f;
                        searching = false;
                        selectedIdx = searchIdx;
                        notifications.Push("Found " + std::to_string(searchTarget) +
                                           " at index " + std::to_string(searchIdx) + "!",
                                           DSAColors::NEON_GREEN);
                        GainScore(50.0f);
                    }
                    searchIdx++;
                    if (searchIdx >= (int)elements.size() && searching) {
                        searching = false;
                        notifications.Push(std::to_string(searchTarget) + " not found in array.",
                                           DSAColors::NEON_RED);
                    }
                }
            }
        }

        // Keyboard input for current mode
        if (showInput) {
            int key = GetCharPressed();
            while (key > 0) {
                if ((key >= '0' && key <= '9') && inputBuf.size() < 4) inputBuf += (char)key;
                key = GetCharPressed();
            }
            if (IsKeyPressed(KEY_BACKSPACE) && !inputBuf.empty()) inputBuf.pop_back();
            if (IsKeyPressed(KEY_ENTER)) ConfirmInput(ctx);
            if (IsKeyPressed(KEY_ESCAPE)) { showInput = false; inputMode = InputMode::NONE; }
        }

        // Click to select element
        if (!showInput && IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) {
            for (int i = 0; i < (int)elements.size(); i++) {
                Rectangle r = { elements[i].x, elements[i].y, ELEM_W, ELEM_H };
                if (CheckCollisionPointRec(GetMousePosition(), r)) {
                    selectedIdx = i;
                    elements[i].glow = 1.0f;
                    elements[i].color = DSAColors::NEON_CYAN;
                    notifications.Push("Index " + std::to_string(i) + " = " +
                                       std::to_string(elements[i].value),
                                       DSAColors::NEON_CYAN);
                    break;
                }
            }
        }

        if (IsKeyPressed(KEY_ESCAPE) && !showInput) ctx.currentScreen = Screen::WORLD_SELECT;
    }

    void Draw(GameContext& ctx, Font font) override {
        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();
        ClearBackground({ 5, 15, 8, 255 }); // Dark forest green background

        DrawForestBackground(sw, sh);
        DrawHUD(font, ctx, sw, sh);
        DrawBackButton(font, ctx);

        // Section: Array visualization
        DrawArraySection(font, sw, sh);

        // Control panel
        DrawControls(font, sw, sh);

        // Complexity
        DrawComplexityInfo(font, lastTC, lastSC, sw - 220, 60);

        // Info panel
        DrawInfoPanel(font, sw, sh);

        particles.Draw();
        notifications.Draw(font, sw);
        DrawScanlines({ 0, 0, sw, sh }, 0.015f);
    }

    void Cleanup() override { particles.Clear(); }
    Screen GetID() const override { return Screen::WORLD_ARRAY_FOREST; }

private:
    void AddElement(int v, bool instant = false) {
        if ((int)elements.size() >= MAX_SIZE) {
            notifications.Push("Array is full! (max " + std::to_string(MAX_SIZE) + ")",
                               DSAColors::NEON_RED);
            return;
        }
        ArrayElement e;
        e.value    = v;
        e.scale    = instant ? 1.0f : 0.0f;
        e.glow     = 1.0f;
        e.color    = DSAColors::ARRAY_COLOR;
        e.selected = false;
        e.highlighted = false;
        e.x = e.targetX = 800;
        e.y = e.targetY = 260;
        elements.push_back(e);
    }

    void ConfirmInput(GameContext&) {
        if (inputBuf.empty()) { showInput = false; return; }
        int val = std::stoi(inputBuf);
        inputBuf.clear();
        showInput = false;

        switch (inputMode) {
        case InputMode::INSERT:
            AddElement(val);
            notifications.Push("Pushed " + std::to_string(val) + " to array", DSAColors::NEON_GREEN);
            lastTC = "O(1)"; lastSC = "O(1)"; lastOp = "INSERT";
            GainScore(20.0f);
            particles.Emit({ (float)GetScreenWidth()/2, 260 }, DSAColors::NEON_GREEN, 15);
            break;
        case InputMode::SEARCH:
            // Clear highlights
            for (auto& e : elements) { e.highlighted = false; e.color = DSAColors::ARRAY_COLOR; }
            searchTarget = val;
            searchIdx    = 0;
            searching    = true;
            searchTimer  = 0.35f;
            lastTC = "O(n)"; lastSC = "O(1)"; lastOp = "LINEAR SEARCH";
            notifications.Push("Searching for " + std::to_string(val) + "...", DSAColors::NEON_GOLD);
            break;
        case InputMode::DELETE_IDX:
            if (val >= 0 && val < (int)elements.size()) {
                particles.Emit({ elements[val].x + ELEM_W/2, elements[val].y + ELEM_H/2 },
                               DSAColors::NEON_RED, 20, 120, 0.8f, 4.0f);
                int removed = elements[val].value;
                elements.erase(elements.begin() + val);
                notifications.Push("Deleted index " + std::to_string(val) +
                                   " (value " + std::to_string(removed) + ")", DSAColors::NEON_RED);
                lastTC = "O(n)"; lastSC = "O(1)"; lastOp = "DELETE";
                GainScore(15.0f);
            }
            break;
        default: break;
        }
        inputMode = InputMode::NONE;
    }

    void DrawForestBackground(float sw, float sh) {
        // Sky gradient
        for (int y = 52; y < (int)sh; y += 2) {
            float t = (float)(y - 52) / (sh - 52);
            Color c = ColorLerp({ 5, 20, 10, 255 }, { 3, 10, 6, 255 }, t);
            DrawLine(0, y, (int)sw, y, c);
        }

        // Trees in background using treeHeights
        for (int i = 0; i < MAX_SIZE; i++) {
            float totalW = MAX_SIZE * (ELEM_W + ELEM_GAP) - ELEM_GAP;
            float startX = sw / 2.0f - totalW / 2.0f;
            float tx = startX + i * (ELEM_W + ELEM_GAP) + ELEM_W / 2;
            float th = treeHeights[i];
            if (th < 2.0f) continue;

            // Tree trunk
            DrawRectangle((int)(tx - 5), (int)(260 - th + ELEM_H),
                          10, (int)th, ColorAlpha({ 60, 35, 15, 255 }, 0.7f));

            // Tree crown (triangle-ish using circles)
            Color treeCol = i < (int)elements.size()
                ? ColorAlpha(elements[i].color, 0.25f)
                : ColorAlpha(DSAColors::ARRAY_COLOR, 0.1f);
            DrawCircle((int)tx, (int)(260 - th + ELEM_H - 20), 25, treeCol);
            DrawCircle((int)tx, (int)(260 - th + ELEM_H - 40), 20, ColorAlpha(treeCol.r > 0 ? treeCol : DSAColors::ARRAY_COLOR, 0.3f));
        }

        // Ground line
        DrawLineEx({ 0, 360 }, { sw, 360 }, 2, ColorAlpha(DSAColors::ARRAY_COLOR, 0.2f));
    }

    void DrawArraySection(Font font, float sw, float) {
        // Label
        DrawTextEx(font, "ARRAY [ ]", { 20, 180 }, 13, 2, DSAColors::TEXT_SECONDARY);
        std::string sizeStr = "size=" + std::to_string(elements.size()) +
                              "/" + std::to_string(MAX_SIZE);
        Vector2 sSz = MeasureTextEx(font, sizeStr.c_str(), 12, 1);
        DrawTextEx(font, sizeStr.c_str(), { sw - sSz.x - 20, 180 }, 12, 1, DSAColors::TEXT_DIM);

        // Draw bracket
        float totalW = elements.empty() ? 100 : elements.size() * (ELEM_W + ELEM_GAP) - ELEM_GAP;
        float startX = sw / 2.0f - totalW / 2.0f;
        DrawTextEx(font, "[", { startX - 20, 250 }, 40, 1, ColorAlpha(DSAColors::ARRAY_COLOR, 0.7f));
        DrawTextEx(font, "]", { startX + totalW + 4, 250 }, 40, 1, ColorAlpha(DSAColors::ARRAY_COLOR, 0.7f));

        // Elements
        for (int i = 0; i < (int)elements.size(); i++) {
            auto& e = elements[i];
            float bobY = e.y + e.animOffset;

            // Glow halo
            if (e.glow > 0.01f) {
                DrawRectangle((int)(e.x - 6), (int)(bobY - 6),
                              (int)(ELEM_W + 12), (int)(ELEM_H + 12),
                              ColorAlpha(e.color, e.glow * 0.25f));
            }

            // Main box
            Color bg = e.highlighted ? ColorAlpha(e.color, 0.25f)
                     : (i == selectedIdx) ? ColorAlpha(e.color, 0.2f)
                     : ColorAlpha(DSAColors::BG_PANEL_SOLID, 0.9f);
            DrawRectangle((int)e.x, (int)bobY, (int)ELEM_W, (int)ELEM_H, bg);
            DrawRectangleLinesEx({ e.x, bobY, ELEM_W, ELEM_H }, 2,
                                 e.highlighted || i == selectedIdx ? e.color
                                 : ColorAlpha(e.color, 0.5f));

            // Value
            std::string vs = std::to_string(e.value);
            Vector2 vSz = MeasureTextEx(font, vs.c_str(), 20, 1);
            DrawTextEx(font, vs.c_str(),
                       { e.x + ELEM_W/2 - vSz.x/2, bobY + ELEM_H/2 - vSz.y/2 },
                       20, 1, e.color);

            // Index label below
            std::string idx = "[" + std::to_string(i) + "]";
            Vector2 iSz = MeasureTextEx(font, idx.c_str(), 11, 1);
            DrawTextEx(font, idx.c_str(),
                       { e.x + ELEM_W/2 - iSz.x/2, bobY + ELEM_H + 4 },
                       11, 1, DSAColors::TEXT_DIM);

            // Pointer arrow from index to element (on selection)
            if (i == selectedIdx) {
                DrawLineEx({ e.x + ELEM_W/2, bobY - 16 },
                           { e.x + ELEM_W/2, bobY - 2 }, 2, e.color);
                DrawTriangle(
                    { e.x + ELEM_W/2, bobY },
                    { e.x + ELEM_W/2 - 5, bobY - 8 },
                    { e.x + ELEM_W/2 + 5, bobY - 8 },
                    e.color
                );
            }
        }

        // Empty state
        if (elements.empty()) {
            DrawTextEx(font, "Array is empty. Click INSERT to add elements.",
                       { sw/2 - 190, 270 }, 14, 1, DSAColors::TEXT_DIM);
        }
    }

    void DrawControls(Font font, float sw, float sh) {
        float py = sh - 180;
        GlassPanel panel({ 20, py, sw - 40, 160 }, "OPERATIONS", themeColor);
        panel.Draw(font);

        float bw = 140, bh = 44, gap = 16;
        float totalBW = 5 * (bw + gap) - gap;
        float bx = sw/2 - totalBW/2;
        float by = py + 44;

        struct Op { std::string label; Color col; InputMode mode; std::string hint; };
        std::vector<Op> ops2 = {
            { "INSERT",    DSAColors::NEON_GREEN,  InputMode::INSERT,     "Add element to end" },
            { "SEARCH",    DSAColors::NEON_GOLD,   InputMode::SEARCH,     "Linear search" },
            { "DELETE",    DSAColors::NEON_RED,    InputMode::DELETE_IDX, "Delete by index" },
            { "SORT",      DSAColors::NEON_PURPLE, InputMode::NONE,       "Sort ascending" },
            { "CLEAR",     DSAColors::TEXT_DIM,    InputMode::NONE,       "Clear array" },
        };

        for (int i = 0; i < (int)ops2.size(); i++) {
            float bxi = bx + i * (bw + gap);
            CyberButton btn({ bxi, by, bw, bh }, ops2[i].label, ops2[i].col, 15);
            bool clicked = btn.Update(0.016f);
            btn.Draw(font);

            // Hint
            Vector2 hSz = MeasureTextEx(font, ops2[i].hint.c_str(), 10, 1);
            DrawTextEx(font, ops2[i].hint.c_str(),
                       { bxi + bw/2 - hSz.x/2, by + bh + 4 }, 10, 1,
                       ColorAlpha(ops2[i].col, 0.6f));

            if (clicked) {
                if (ops2[i].label == "SORT") {
                    DoSort();
                } else if (ops2[i].label == "CLEAR") {
                    elements.clear();
                    notifications.Push("Array cleared!", DSAColors::NEON_RED);
                    lastTC = "O(1)"; lastSC = "O(1)";
                } else {
                    inputMode = ops2[i].mode;
                    showInput = true;
                    inputBuf.clear();
                }
            }
        }

        // Input box
        if (showInput) {
            float ix = sw/2 - 160, iy = by + bh + 40;
            std::string prompt;
            if (inputMode == InputMode::INSERT)    prompt = "Enter value to insert:";
            if (inputMode == InputMode::SEARCH)    prompt = "Enter value to search:";
            if (inputMode == InputMode::DELETE_IDX) prompt = "Enter index to delete:";

            DrawTextEx(font, prompt.c_str(), { ix, iy }, 14, 1, themeColor);
            Rectangle inputR = { ix, iy + 20, 320, 36 };
            DrawRectangleRec(inputR, DSAColors::BG_PANEL_SOLID);
            DrawRectangleLinesEx(inputR, 2, themeColor);
            std::string disp = inputBuf + (fmod(GetTime(), 1.0) < 0.5 ? "|" : "");
            DrawTextEx(font, disp.c_str(), { ix + 10, iy + 28 }, 18, 1, DSAColors::TEXT_WHITE);
            DrawTextEx(font, "ENTER to confirm  |  ESC to cancel",
                       { ix, iy + 62 }, 11, 1, DSAColors::TEXT_DIM);
        }
    }

    void DrawInfoPanel(Font font, float sw, float sh) {
        float px = sw - 220, py = 150;
        GlassPanel panel({ px, py, 200, 220 }, "ARRAY INFO", themeColor);
        panel.Draw(font);

        float fy = py + 44;
        auto row = [&](const char* k, const std::string& v, Color col) {
            DrawTextEx(font, k,    { px + 12, fy }, 11, 1, DSAColors::TEXT_SECONDARY);
            DrawTextEx(font, v.c_str(), { px + 12, fy + 14 }, 14, 1, col);
            fy += 36;
        };

        if (!elements.empty()) {
            int mn = elements[0].value, mx = elements[0].value, sm = 0;
            for (auto& e : elements) {
                mn = std::min(mn, e.value);
                mx = std::max(mx, e.value);
                sm += e.value;
            }
            row("SIZE",   std::to_string(elements.size()), DSAColors::NEON_CYAN);
            row("MIN",    std::to_string(mn),               DSAColors::NEON_GREEN);
            row("MAX",    std::to_string(mx),               DSAColors::NEON_RED);
            row("SUM",    std::to_string(sm),               DSAColors::NEON_GOLD);
            row("LAST OP", lastOp.empty() ? "-" : lastOp,  themeColor);
        } else {
            DrawTextEx(font, "Empty array", { px + 12, fy }, 12, 1, DSAColors::TEXT_DIM);
        }
    }

    void DoSort() {
        if (elements.size() < 2) return;
        // Bubble sort with animation markers
        std::sort(elements.begin(), elements.end(),
                  [](const ArrayElement& a, const ArrayElement& b){ return a.value < b.value; });
        for (auto& e : elements) { e.glow = 0.8f; e.color = DSAColors::ARRAY_COLOR; }
        notifications.Push("Array sorted! (O(n log n))", DSAColors::NEON_PURPLE);
        lastTC = "O(n log n)"; lastSC = "O(1)"; lastOp = "SORT";
        GainScore(40.0f);
        particles.Emit({ (float)GetScreenWidth()/2, 280 }, DSAColors::NEON_PURPLE, 30, 150, 1.0f);
    }
};
