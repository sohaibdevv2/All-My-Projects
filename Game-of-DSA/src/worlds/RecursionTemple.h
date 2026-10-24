#pragma once
#include "World.h"
#include <vector>
#include <string>
#include <functional>

struct CallFrame {
    std::string funcName;
    std::string args;
    std::string returnVal;
    int   depth;
    float x, y;
    float alpha;
    float scale;
    Color color;
    bool  returning;
    bool  active;
};

class RecursionTempleWorld : public World {
public:
    std::vector<CallFrame> callStack;
    std::vector<CallFrame> history;

    // Fibonacci visualizer
    std::vector<long long> fibMemo;
    int  fibN      = 8;
    bool computing = false;
    float computeTimer = 0.0f;
    std::vector<std::pair<std::string,std::string>> computeLog;
    int  logStep   = 0;

    // Factorial
    std::vector<std::pair<int,long long>> factSteps;
    int factN     = 6;
    int factStep  = 0;
    bool factRunning = false;

    enum class Mode { FIBONACCI, FACTORIAL, HANOI } mode = Mode::FIBONACCI;

    // Tower of Hanoi
    struct Disk { int size; Color color; };
    std::vector<std::vector<Disk>> hanoi;  // 3 pegs
    std::vector<std::tuple<int,int,int,std::string>> hanoiMoves; // (disk,from,to,desc)
    int hanoiStep = 0;
    int hanoiN    = 3;
    bool hanoiRunning = false;
    float hanoiTimer = 0.0f;

    std::string inputBuf;
    bool showInput = false;

    void Init(GameContext&) override {
        worldName  = "RECURSION TEMPLE";
        themeColor = DSAColors::RECUR_COLOR;
        score = 0; ops = 0;
        callStack.clear(); history.clear();
        fibMemo.clear();
        computeLog.clear();
        InitHanoi(hanoiN);
    }

    void Update(GameContext& ctx, float dt) override {
        anim += dt;
        particles.Update(dt);
        notifications.Update(dt);

        for (auto& f : callStack) {
            f.alpha += (1.0f - f.alpha) * 5.0f * dt;
            f.scale += (1.0f - f.scale) * 6.0f * dt;
        }

        // Fibonacci compute steps
        if (computing) {
            computeTimer -= dt;
            if (computeTimer <= 0) {
                computeTimer = 0.3f;
                if (logStep < (int)computeLog.size()) {
                    auto [call, ret] = computeLog[logStep];
                    if (!ret.empty()) {
                        if (!callStack.empty()) {
                            callStack.back().returnVal = ret;
                            callStack.back().returning = true;
                            particles.Emit({ callStack.back().x, callStack.back().y },
                                          themeColor, 8, 60, 0.5f, 3.0f);
                        }
                        if (!callStack.empty()) callStack.pop_back();
                    } else {
                        AddFrame(call, (int)callStack.size());
                    }
                    logStep++;
                } else {
                    computing = false;
                    long long result = fibMemo[fibN];
                    notifications.Push("fib(" + std::to_string(fibN) + ") = " +
                                       std::to_string(result) + " computed!", DSAColors::NEON_GREEN);
                    GainScore(50.0f);
                    callStack.clear();
                }
            }
        }

        // Hanoi steps
        if (hanoiRunning) {
            hanoiTimer -= dt;
            if (hanoiTimer <= 0) {
                hanoiTimer = 0.5f;
                if (hanoiStep < (int)hanoiMoves.size()) {
                    auto [disk, from, to, desc] = hanoiMoves[hanoiStep];
                    // Move top of 'from' to 'to'
                    if (!hanoi[from].empty()) {
                        Disk d = hanoi[from].back();
                        hanoi[from].pop_back();
                        hanoi[to].push_back(d);
                        particles.Emit({ 200 + to * 200.0f, 350 }, themeColor, 8, 60, 0.5f, 3.0f);
                        notifications.Push("Move disk " + std::to_string(disk) + ": Peg " +
                                           std::to_string(from+1) + " → Peg " + std::to_string(to+1),
                                           themeColor);
                    }
                    hanoiStep++;
                } else {
                    hanoiRunning = false;
                    notifications.Push("Hanoi(" + std::to_string(hanoiN) + ") solved in " +
                                       std::to_string(hanoiMoves.size()) + " moves!", DSAColors::NEON_GREEN);
                    GainScore(80.0f);
                }
            }
        }

        // Factorial steps
        if (factRunning) {
            computeTimer -= dt;
            if (computeTimer <= 0) {
                computeTimer = 0.4f;
                if (factStep < (int)factSteps.size()) {
                    auto [n, v] = factSteps[factStep];
                    notifications.Push("factorial(" + std::to_string(n) + ") = " + std::to_string(v), themeColor);
                    factStep++;
                } else {
                    factRunning = false;
                    notifications.Push("factorial(" + std::to_string(factN) + ") complete!", DSAColors::NEON_GREEN);
                    GainScore(30.0f);
                }
            }
        }

        if (showInput) {
            int key = GetCharPressed();
            while (key > 0) {
                if (key >= '0' && key <= '9' && inputBuf.size() < 2) inputBuf += (char)key;
                key = GetCharPressed();
            }
            if (IsKeyPressed(KEY_BACKSPACE) && !inputBuf.empty()) inputBuf.pop_back();
            if (IsKeyPressed(KEY_ENTER)) {
                if (!inputBuf.empty()) {
                    int n = std::stoi(inputBuf);
                    if (mode == Mode::FIBONACCI)  StartFib(n);
                    else if (mode == Mode::FACTORIAL) StartFactorial(n);
                    else if (mode == Mode::HANOI) { hanoiN = std::min(n, 7); StartHanoi(hanoiN); }
                    inputBuf.clear();
                }
                showInput = false;
            }
            if (IsKeyPressed(KEY_ESCAPE)) { inputBuf.clear(); showInput = false; }
        }

        if (IsKeyPressed(KEY_ESCAPE) && !showInput) ctx.currentScreen = Screen::WORLD_SELECT;
    }

    void Draw(GameContext& ctx, Font font) override {
        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();

        // Mystical pink background
        for (int y = 0; y < (int)sh; y += 2) {
            float t = (float)y / sh;
            Color c = ColorLerp({ 15, 5, 25, 255 }, { 8, 3, 15, 255 }, t);
            DrawLine(0, y, (int)sw, y, c);
        }
        DrawTempleBackground(sw, sh);
        DrawHUD(font, ctx, sw, sh);
        DrawBackButton(font, ctx);

        if (mode == Mode::FIBONACCI)  DrawFibVisualizer(font, sw, sh);
        if (mode == Mode::FACTORIAL)  DrawFactorialVisualizer(font, sw, sh);
        if (mode == Mode::HANOI)      DrawHanoiVisualizer(font, sw, sh);

        DrawCallStackPanel(font, sw, sh);
        DrawControls(font, sw, sh);
        DrawComplexityInfo(font,
                           mode == Mode::FIBONACCI  ? "O(2ⁿ)/O(n) memo" :
                           mode == Mode::FACTORIAL   ? "O(n)" : "O(2ⁿ)",
                           "O(n)", sw - 220, 60);

        particles.Draw();
        notifications.Draw(font, sw);
        DrawScanlines({ 0, 0, sw, sh }, 0.015f);
    }

    void Cleanup() override { particles.Clear(); }
    Screen GetID() const override { return Screen::WORLD_RECURSION_TEMPLE; }

private:
    void AddFrame(const std::string& call, int depth) {
        float sw = (float)GetScreenWidth();
        CallFrame f;
        f.funcName  = call;
        f.args      = "";
        f.returnVal = "";
        f.depth     = depth;
        f.x         = sw * 0.3f + depth * 30;
        f.y         = 200 + depth * 50.0f;
        f.alpha     = 0.0f;
        f.scale     = 0.5f;
        f.color     = ColorLerp(themeColor, DSAColors::NEON_PURPLE, (float)depth / 10.0f);
        f.returning = false;
        f.active    = true;
        callStack.push_back(f);
    }

    void StartFib(int n) {
        fibN = std::min(n, 12);
        callStack.clear(); computeLog.clear(); logStep = 0;
        fibMemo.assign(fibN + 1, -1);
        computing = true; computeTimer = 0.2f;

        // Generate call/return log
        std::function<long long(int)> fib = [&](int k) -> long long {
            computeLog.push_back({ "fib(" + std::to_string(k) + ")", "" });
            if (k <= 1) {
                computeLog.push_back({ "", std::to_string(k) });
                fibMemo[k] = k;
                return k;
            }
            if (fibMemo[k] != -1) {
                computeLog.push_back({ "", std::to_string(fibMemo[k]) + " (memo)" });
                return fibMemo[k];
            }
            long long result = fib(k-1) + fib(k-2);
            fibMemo[k] = result;
            computeLog.push_back({ "", std::to_string(result) });
            return result;
        };
        fib(fibN);
        notifications.Push("Computing fib(" + std::to_string(fibN) + ") with recursion...", themeColor);
    }

    void StartFactorial(int n) {
        factN = std::min(n, 12);
        factSteps.clear(); factStep = 0;
        callStack.clear();
        std::function<long long(int)> fact = [&](int k) -> long long {
            if (k <= 1) { factSteps.push_back({ k, 1 }); return 1; }
            long long res = k * fact(k - 1);
            factSteps.push_back({ k, res });
            return res;
        };
        fact(factN);
        factRunning  = true;
        computeTimer = 0.3f;
        notifications.Push("Computing factorial(" + std::to_string(factN) + ")...", themeColor);
    }

    void InitHanoi(int n) {
        hanoi.assign(3, std::vector<Disk>());
        Color cols[] = { DSAColors::NEON_RED, DSAColors::NEON_ORANGE, DSAColors::NEON_GOLD,
                         DSAColors::NEON_GREEN, DSAColors::NEON_CYAN, DSAColors::NEON_PURPLE, DSAColors::NEON_PINK };
        for (int i = n - 1; i >= 0; i--)
            hanoi[0].push_back({ i + 1, cols[i % 7] });
        hanoiMoves.clear(); hanoiStep = 0; hanoiRunning = false;
    }

    void StartHanoi(int n) {
        hanoiN = std::min(n, 7);
        InitHanoi(hanoiN);
        hanoiMoves.clear();
        std::function<void(int,int,int,int)> solve = [&](int d, int from, int to, int aux) {
            if (d <= 0) return;
            solve(d-1, from, aux, to);
            hanoiMoves.push_back({ d, from, to, "" });
            solve(d-1, aux, to, from);
        };
        solve(hanoiN, 0, 2, 1);
        hanoiRunning = true; hanoiTimer = 0.4f;
        notifications.Push("Solving Hanoi(" + std::to_string(hanoiN) + ")... " +
                           std::to_string(hanoiMoves.size()) + " moves", themeColor);
    }

    void DrawTempleBackground(float sw, float sh) {
        // Pillars
        for (int p = 0; p < 6; p++) {
            float px = p * sw/6 + 20;
            DrawRectangle((int)px, 60, 20, (int)(sh - 60),
                          ColorAlpha({ 30, 10, 50, 255 }, 0.4f));
            DrawRectangle((int)px - 5, 60, 30, 20,
                          ColorAlpha(themeColor, 0.1f));
        }
        // Magic circles
        for (int c = 0; c < 3; c++) {
            float cr = 50 + c * 30;
            float cx = sw/2, cy = sh/2;
            DrawCircleLines((int)cx, (int)cy, cr,
                            ColorAlpha(themeColor, sinf(anim + c) * 0.1f + 0.08f));
        }
    }

    void DrawFibVisualizer(Font font, float sw, float sh) {
        float py = 120;
        GlassPanel panel({ 240, py, sw - 260, 200 }, "FIBONACCI RECURSION TREE", themeColor);
        panel.Draw(font);

        // Draw pre-computed fib values
        float fy = py + 46;
        DrawTextEx(font, "fib sequence:", { 260, fy }, 12, 1, DSAColors::TEXT_SECONDARY);
        for (int i = 0; i <= fibN && i < (int)fibMemo.size(); i++) {
            if (fibMemo[i] >= 0) {
                std::string s = "f(" + std::to_string(i) + ")=" + std::to_string(fibMemo[i]);
                Color c = i == fibN ? DSAColors::NEON_GOLD : themeColor;
                DrawTextEx(font, s.c_str(), { 260 + i * 70.0f, fy + 20 }, 12, 1, ColorAlpha(c, 0.9f));
            }
        }

        // Recursive depth visual
        fy += 60;
        for (int i = 0; i < (int)callStack.size() && i < 8; i++) {
            auto& f = callStack[i];
            float fx = 260 + i * 28;
            DrawRectangle((int)fx, (int)fy, 22, 30,
                          ColorAlpha(f.color, f.alpha * 0.6f));
            DrawRectangleLinesEx({ fx, fy, 22, 30 }, 1, ColorAlpha(f.color, f.alpha));
            DrawTextEx(font, "▐", { fx + 5, fy + 8 }, 12, 1,
                       ColorAlpha(f.returning ? DSAColors::NEON_GREEN : DSAColors::TEXT_WHITE, f.alpha));
        }
        if (!callStack.empty()) {
            std::string cur = "Call: " + callStack.back().funcName;
            DrawTextEx(font, cur.c_str(), { 260, fy + 38 }, 13, 1, themeColor);
        }
    }

    void DrawFactorialVisualizer(Font font, float sw, float sh) {
        float py = 120;
        GlassPanel panel({ 240, py, sw - 260, 160 }, "FACTORIAL RECURSION", themeColor);
        panel.Draw(font);

        std::string expr;
        for (int i = factN; i >= 1; i--) {
            expr += std::to_string(i) + (i > 1 ? " × " : "");
        }
        DrawTextEx(font, ("Expression: " + expr).c_str(), { 260, py + 46 }, 14, 1, themeColor);

        for (int i = 0; i < (int)factSteps.size() && i <= factStep; i++) {
            auto [n, v] = factSteps[i];
            std::string s = "factorial(" + std::to_string(n) + ") = " + std::to_string(v);
            Color col = (i == factStep - 1) ? DSAColors::NEON_GOLD : ColorAlpha(themeColor, 0.6f);
            DrawTextEx(font, s.c_str(), { 260, py + 70 + i * 18.0f }, 12, 1, col);
        }
    }

    void DrawHanoiVisualizer(Font font, float sw, float sh) {
        float py = 120, ph = 260;
        float pegY = py + ph - 20;
        float spacing = sw / 4.0f;

        GlassPanel panel({ 240, py, sw - 260, ph }, "TOWER OF HANOI", themeColor);
        panel.Draw(font);

        Color pegCol = ColorAlpha(themeColor, 0.5f);
        const char* labels[] = { "PEG 1 (Source)", "PEG 2 (Aux)", "PEG 3 (Dest)" };

        for (int p = 0; p < 3; p++) {
            float px = 240 + spacing * (p + 0.5f);
            // Peg
            DrawLineEx({ px, pegY }, { px, py + 46 }, 4, pegCol);
            // Base
            DrawRectangle((int)(px - 50), (int)(pegY), 100, 8, pegCol);
            DrawTextEx(font, labels[p], { px - 50, pegY + 12 }, 10, 1, ColorAlpha(themeColor, 0.7f));

            // Disks
            for (int d = 0; d < (int)hanoi[p].size(); d++) {
                auto& disk = hanoi[p][d];
                float dw = 20 + disk.size * 16.0f;
                float dy = pegY - (d + 1) * 18.0f;
                DrawRectangle((int)(px - dw/2), (int)dy, (int)dw, 14,
                              ColorAlpha(disk.color, 0.8f));
                DrawRectangleLinesEx({ px - dw/2, dy, dw, 14 }, 1,
                                     ColorAlpha(disk.color, 1.0f));
                DrawTextEx(font, std::to_string(disk.size).c_str(),
                           { px - 5, dy + 2 }, 10, 1, DSAColors::TEXT_WHITE);
            }
        }

        // Progress
        if (!hanoiMoves.empty()) {
            std::string prog = "Move " + std::to_string(hanoiStep) + "/" +
                               std::to_string(hanoiMoves.size());
            DrawTextEx(font, prog.c_str(), { 260, py + ph - 22 }, 12, 1, themeColor);
            ProgressBar pb({ 380, py + ph - 18, 200, 10 }, themeColor);
            pb.SetValue((float)hanoiStep / hanoiMoves.size());
            pb.displayValue = (float)hanoiStep / hanoiMoves.size();
            pb.Draw(font);
        }
    }

    void DrawCallStackPanel(Font font, float sw, float sh) {
        GlassPanel panel({ 20, 60, 210, sh - 230 }, "CALL STACK", themeColor);
        panel.Draw(font);
        float fy = 104;
        DrawTextEx(font, "← stack top", { 32, fy - 14 }, 10, 1, DSAColors::TEXT_DIM);
        for (int i = (int)callStack.size() - 1; i >= 0 && fy < sh - 240; i--) {
            auto& f = callStack[i];
            DrawRectangle(32, (int)fy, 180, 28, ColorAlpha(f.color, f.alpha * 0.2f));
            DrawRectangleLinesEx({ 32, fy, 180, 28 }, 1, ColorAlpha(f.color, f.alpha * 0.6f));
            DrawTextEx(font, f.funcName.c_str(), { 40, fy + 8 }, 12, 1,
                       ColorAlpha(f.color, f.alpha));
            if (!f.returnVal.empty())
                DrawTextEx(font, ("→ " + f.returnVal).c_str(), { 120, fy + 8 }, 11, 1,
                           ColorAlpha(DSAColors::NEON_GREEN, f.alpha));
            fy += 32;
        }
    }

    void DrawControls(Font font, float sw, float sh) {
        float py = sh - 100;
        GlassPanel panel({ 20, py, sw - 40, 80 }, "RECURSION MODES", themeColor);
        panel.Draw(font);

        float bw = 160, bh = 42, gap = 16;
        float totalBW = 4 * (bw + gap) - gap;
        float bx = sw/2 - totalBW/2;
        float by = py + 22;

        struct Op { std::string lbl; Color col; Mode m; };
        std::vector<Op> ops2 = {
            { "FIBONACCI",  DSAColors::NEON_PINK,   Mode::FIBONACCI },
            { "FACTORIAL",  DSAColors::NEON_PURPLE,  Mode::FACTORIAL },
            { "HANOI",      DSAColors::NEON_CYAN,   Mode::HANOI },
            { "COMPUTE N",  DSAColors::NEON_GREEN,  mode },
        };

        for (int i = 0; i < (int)ops2.size(); i++) {
            bool active = (i < 3 && ops2[i].m == mode);
            CyberButton btn({ bx + i*(bw+gap), by, bw, bh }, ops2[i].lbl,
                            active ? DSAColors::NEON_GOLD : ops2[i].col, 14);
            if (btn.Update(0.016f)) {
                if (i < 3) {
                    mode = ops2[i].m;
                    callStack.clear(); computeLog.clear();
                    hanoiRunning = false; factRunning = false; computing = false;
                } else {
                    showInput = true; inputBuf.clear();
                }
            }
            btn.Draw(font);
        }

        if (showInput) {
            float ix = sw/2 - 150, iy = by - 70;
            DrawRectangle((int)ix - 10, (int)iy - 8, 320, 64, DSAColors::BG_PANEL_SOLID);
            DrawRectangleLinesEx({ ix-10, iy-8, 320, 64 }, 2, themeColor);
            std::string prompt = "Enter n for " + std::string(mode == Mode::FIBONACCI ? "fib" : mode == Mode::FACTORIAL ? "factorial" : "hanoi") + ":";
            DrawTextEx(font, prompt.c_str(), { ix, iy }, 13, 1, themeColor);
            Rectangle ir = { ix, iy + 20, 300, 32 };
            DrawRectangleRec(ir, DSAColors::BG_DARK);
            DrawRectangleLinesEx(ir, 2, themeColor);
            std::string disp = inputBuf + (fmod(GetTime(), 1.0) < 0.5 ? "|" : "");
            DrawTextEx(font, disp.c_str(), { ix + 8, iy + 27 }, 17, 1, DSAColors::TEXT_WHITE);
        }
    }
};
