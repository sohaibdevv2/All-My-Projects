#pragma once
#include "World.h"
#include <vector>
#include <algorithm>
#include <functional>
#include <string>

class SortingArenaWorld : public World {
public:
    struct Bar {
        float value;
        float displayH;  // animated height
        Color color;
        bool  comparing;
        bool  sorted;
        float glow;
    };

    std::vector<Bar> bars;
    static constexpr int NUM_BARS  = 30;
    static constexpr float MIN_VAL = 10.0f;
    static constexpr float MAX_VAL = 100.0f;

    // Step-by-step sort
    std::vector<std::pair<int,int>> sortSteps; // pairs of indices to compare/swap
    std::vector<bool>               isSwaps;
    int   stepIdx   = 0;
    float stepTimer = 0.0f;
    float stepSpeed = 0.08f; // seconds per step
    bool  playing   = false;
    bool  done      = false;

    std::string currentAlgo    = "NONE";
    long long   totalComparisons = 0;
    long long   totalSwaps       = 0;
    float       elapsedTime      = 0.0f;

    // Race mode: two algorithms side by side
    bool raceMode = false;

    void Init(GameContext&) override {
        worldName  = "SORTING ARENA";
        themeColor = DSAColors::SORT_COLOR;
        Randomize();
        score = 0; ops = 0;
    }

    void Update(GameContext& ctx, float dt) override {
        anim += dt;
        particles.Update(dt);
        notifications.Update(dt);

        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();
        float barW = (sw - 80) / NUM_BARS;
        float baseY = sh - 220;

        // Animate bar heights
        for (auto& b : bars) {
            float targetH = b.value / MAX_VAL * (baseY - 120);
            b.displayH   += (targetH - b.displayH) * 10.0f * dt;
            b.glow        = fmaxf(0.0f, b.glow - dt * 3.0f);
        }

        // Step through sort
        if (playing && !done) {
            elapsedTime += dt;
            stepTimer   -= dt;
            if (stepTimer <= 0) {
                stepTimer = stepSpeed;
                if (stepIdx < (int)sortSteps.size()) {
                    // Reset previous comparing
                    for (auto& b : bars) b.comparing = false;

                    auto [i, j] = sortSteps[stepIdx];
                    bool isSwap = isSwaps[stepIdx];

                    bars[i].comparing = true;
                    bars[j].comparing = true;
                    bars[i].glow = 1.0f;
                    bars[j].glow = 1.0f;

                    if (isSwap) {
                        std::swap(bars[i].value, bars[j].value);
                        totalSwaps++;
                        particles.Emit(
                            { 40 + i * barW + barW/2, baseY - bars[i].displayH },
                            DSAColors::NEON_GOLD, 6, 80, 0.4f, 3.0f
                        );
                    } else {
                        totalComparisons++;
                    }

                    stepIdx++;
                } else {
                    // Done
                    playing = false;
                    done    = true;
                    for (auto& b : bars) { b.sorted = true; b.comparing = false; b.glow = 0.5f; }
                    notifications.Push(currentAlgo + " complete! Swaps: " +
                                       std::to_string(totalSwaps) + " Comparisons: " +
                                       std::to_string(totalComparisons), DSAColors::NEON_GREEN);
                    GainScore(100.0f);
                    particles.Emit({ sw/2, sh/2 }, DSAColors::NEON_CYAN, 40, 200, 1.5f);
                }
            }
        }

        if (IsKeyPressed(KEY_SPACE) && !sortSteps.empty()) playing = !playing;
        if (IsKeyPressed(KEY_ESCAPE) && !playing) ctx.currentScreen = Screen::WORLD_SELECT;
    }

    void Draw(GameContext& ctx, Font font) override {
        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();

        // Colosseum background
        for (int y = 0; y < (int)sh; y += 2) {
            float t = (float)y / sh;
            Color c = ColorLerp({ 5, 20, 25, 255 }, { 3, 10, 15, 255 }, t);
            DrawLine(0, y, (int)sw, y, c);
        }
        DrawArena(sw, sh);
        DrawHUD(font, ctx, sw, sh);
        DrawBackButton(font, ctx);

        float baseY = sh - 220;
        DrawBars(font, sw, sh, baseY);
        DrawControls(font, sw, sh);
        DrawStatsPanel(font, sw, sh);
        DrawComplexityInfo(font, GetTimeComplexity(), GetSpaceComplexity(), sw - 220, 60);

        particles.Draw();
        notifications.Draw(font, sw);
        DrawScanlines({ 0, 0, sw, sh }, 0.015f);
    }

    void Cleanup() override { particles.Clear(); }
    Screen GetID() const override { return Screen::WORLD_SORTING_ARENA; }

private:
    void Randomize() {
        bars.clear();
        Color colors[] = {
            DSAColors::NEON_CYAN, DSAColors::NEON_PINK, DSAColors::NEON_GREEN,
            DSAColors::NEON_PURPLE, DSAColors::NEON_GOLD, DSAColors::NEON_ORANGE
        };
        for (int i = 0; i < NUM_BARS; i++) {
            Bar b;
            b.value    = MIN_VAL + (float)rand() / RAND_MAX * (MAX_VAL - MIN_VAL);
            b.displayH = 0;
            b.color    = colors[rand() % 6];
            b.comparing = false;
            b.sorted    = false;
            b.glow      = 0;
            bars.push_back(b);
        }
        sortSteps.clear();
        isSwaps.clear();
        stepIdx = 0;
        playing = done = false;
        totalComparisons = totalSwaps = 0;
        elapsedTime = 0.0f;
        currentAlgo = "NONE";
    }

    void PrepareBubbleSort() {
        currentAlgo = "BUBBLE SORT";
        std::vector<float> arr;
        for (auto& b : bars) arr.push_back(b.value);
        sortSteps.clear(); isSwaps.clear();
        int n = arr.size();
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - i - 1; j++) {
                sortSteps.push_back({ j, j+1 });
                isSwaps.push_back(false);
                if (arr[j] > arr[j+1]) {
                    sortSteps.push_back({ j, j+1 });
                    isSwaps.push_back(true);
                    std::swap(arr[j], arr[j+1]);
                }
            }
        stepIdx = 0; playing = false; done = false;
        totalComparisons = totalSwaps = 0;
        notifications.Push("Bubble Sort prepared. Press PLAY or SPACE.", themeColor);
    }

    void PrepareSelectionSort() {
        currentAlgo = "SELECTION SORT";
        std::vector<float> arr;
        for (auto& b : bars) arr.push_back(b.value);
        sortSteps.clear(); isSwaps.clear();
        int n = arr.size();
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                sortSteps.push_back({ minIdx, j });
                isSwaps.push_back(false);
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            if (minIdx != i) {
                sortSteps.push_back({ i, minIdx });
                isSwaps.push_back(true);
                std::swap(arr[i], arr[minIdx]);
            }
        }
        stepIdx = 0; playing = false; done = false;
        totalComparisons = totalSwaps = 0;
        notifications.Push("Selection Sort prepared. Press PLAY or SPACE.", themeColor);
    }

    void PrepareInsertionSort() {
        currentAlgo = "INSERTION SORT";
        std::vector<float> arr;
        for (auto& b : bars) arr.push_back(b.value);
        sortSteps.clear(); isSwaps.clear();
        int n = arr.size();
        for (int i = 1; i < n; i++) {
            int j = i;
            while (j > 0 && arr[j-1] > arr[j]) {
                sortSteps.push_back({ j-1, j });
                isSwaps.push_back(true);
                std::swap(arr[j-1], arr[j]);
                j--;
            }
        }
        stepIdx = 0; playing = false; done = false;
        totalComparisons = totalSwaps = 0;
        notifications.Push("Insertion Sort prepared. Press PLAY or SPACE.", themeColor);
    }

    void DrawArena(float sw, float sh) {
        // Arena walls
        DrawRectangle(0, (int)(sh - 60), (int)sw, 60, { 20, 30, 35, 255 });
        DrawLineEx({ 0, sh - 60 }, { sw, sh - 60 }, 2, ColorAlpha(themeColor, 0.4f));

        // Crowd silhouettes
        for (int c = 0; c < 40; c++) {
            float cx = c * sw/40 + 8;
            float ch = 20 + sinf(c * 1.7f + anim * 0.5f) * 8;
            DrawRectangle((int)cx, (int)(sh - 62 - ch), 12, (int)ch,
                          ColorAlpha({ 30, 40, 50, 255 }, 0.7f));
        }

        // Arena floor
        DrawLineEx({ 40, sh - 220 }, { sw - 40, sh - 220 }, 1, ColorAlpha(themeColor, 0.2f));
    }

    void DrawBars(Font font, float sw, float sh, float baseY) {
        float barW = (sw - 80.0f) / NUM_BARS;
        float gap  = barW * 0.12f;

        for (int i = 0; i < (int)bars.size(); i++) {
            auto& b = bars[i];
            float bx = 40 + i * barW;
            float bh = b.displayH;

            Color col = b.sorted    ? ColorLerp(b.color, DSAColors::NEON_GREEN, 0.5f)
                      : b.comparing ? DSAColors::NEON_GOLD
                      : b.color;

            if (b.glow > 0.01f) {
                DrawRectangle((int)(bx + gap/2 - 2), (int)(baseY - bh - 2),
                              (int)(barW - gap + 4), (int)(bh + 4),
                              ColorAlpha(col, b.glow * 0.3f));
            }

            DrawRectangle((int)(bx + gap/2), (int)(baseY - bh),
                          (int)(barW - gap), (int)bh, ColorAlpha(col, 0.8f));

            // Top glow
            DrawRectangle((int)(bx + gap/2), (int)(baseY - bh),
                          (int)(barW - gap), 3, ColorAlpha(col, 0.9f));
        }

        // Step progress bar
        if (!sortSteps.empty()) {
            float pct = (float)stepIdx / sortSteps.size();
            DrawRectangle(40, (int)(baseY + 8), (int)((sw - 80) * pct), 4,
                          ColorAlpha(themeColor, 0.8f));
            DrawRectangleLinesEx({ 40, baseY + 8, sw - 80, 4 }, 1,
                                 ColorAlpha(themeColor, 0.3f));
        }
    }

    void DrawControls(Font font, float sw, float sh) {
        float py = sh - 170;
        GlassPanel panel({ 20, py, sw - 40, 150 }, "SORTING ALGORITHMS", themeColor);
        panel.Draw(font);

        float bw = 150, bh = 42, gap = 14;
        float totalBW = 5 * (bw + gap) - gap;
        float bx = sw/2 - totalBW/2;
        float by = py + 44;

        struct Op { std::string lbl; Color col; };
        std::vector<Op> ops2 = {
            { "BUBBLE",    DSAColors::NEON_CYAN },
            { "SELECTION", DSAColors::NEON_PURPLE },
            { "INSERTION", DSAColors::NEON_PINK },
            { playing ? "PAUSE ⏸" : "PLAY ▶", DSAColors::NEON_GREEN },
            { "RANDOMIZE", DSAColors::TEXT_SECONDARY },
        };

        for (int i = 0; i < (int)ops2.size(); i++) {
            CyberButton btn({ bx + i*(bw+gap), by, bw, bh }, ops2[i].lbl, ops2[i].col, 14);
            if (btn.Update(0.016f)) {
                if (ops2[i].lbl == "BUBBLE")    PrepareBubbleSort();
                else if (ops2[i].lbl == "SELECTION") PrepareSelectionSort();
                else if (ops2[i].lbl == "INSERTION") PrepareInsertionSort();
                else if (ops2[i].lbl.find("PLAY") != std::string::npos || ops2[i].lbl.find("PAUSE") != std::string::npos) {
                    if (!sortSteps.empty()) playing = !playing;
                }
                else if (ops2[i].lbl == "RANDOMIZE") Randomize();
            }
            btn.Draw(font);
        }

        // Speed slider label
        std::string speedStr = "Speed: " + std::to_string((int)(1.0f/stepSpeed)) + "x";
        DrawTextEx(font, speedStr.c_str(), { bx, by + bh + 12 }, 12, 1, DSAColors::TEXT_SECONDARY);

        // Speed buttons
        CyberButton slower({ bx + 80, by + bh + 8, 60, 24 }, "SLOWER", DSAColors::TEXT_DIM, 11);
        CyberButton faster({ bx + 148, by + bh + 8, 60, 24 }, "FASTER", themeColor, 11);
        if (slower.Update(0.016f)) stepSpeed = fminf(stepSpeed * 2.0f, 0.5f);
        if (faster.Update(0.016f)) stepSpeed = fmaxf(stepSpeed / 2.0f, 0.01f);
        slower.Draw(font); faster.Draw(font);
    }

    void DrawStatsPanel(Font font, float sw, float sh) {
        GlassPanel panel({ 20, 60, 220, 180 }, "SORT STATS", themeColor);
        panel.Draw(font);
        float fy = 104;
        auto row = [&](const char* k, const std::string& v, Color col) {
            DrawTextEx(font, k, { 32, fy }, 11, 1, DSAColors::TEXT_SECONDARY);
            DrawTextEx(font, v.c_str(), { 32, fy + 14 }, 14, 1, col);
            fy += 32;
        };
        row("ALGORITHM",   currentAlgo,                          themeColor);
        row("COMPARISONS", std::to_string(totalComparisons),     DSAColors::NEON_CYAN);
        row("SWAPS",       std::to_string(totalSwaps),           DSAColors::NEON_ORANGE);
        row("STEPS LEFT",  std::to_string(sortSteps.empty() ? 0 : (int)sortSteps.size() - stepIdx),
                                                                 DSAColors::NEON_GOLD);
    }

    std::string GetTimeComplexity() const {
        if (currentAlgo == "BUBBLE SORT")    return "O(n²)";
        if (currentAlgo == "SELECTION SORT") return "O(n²)";
        if (currentAlgo == "INSERTION SORT") return "O(n²)";
        if (currentAlgo == "MERGE SORT")     return "O(n log n)";
        if (currentAlgo == "QUICK SORT")     return "O(n log n)";
        return "—";
    }

    std::string GetSpaceComplexity() const {
        if (currentAlgo == "MERGE SORT") return "O(n)";
        return "O(1)";
    }
};
