#pragma once
#include "World.h"
#include <vector>
#include <string>
#include <list>
#include <optional>

class HashArenaWorld : public World {
public:
    static constexpr int TABLE_SIZE = 11; // prime

    struct HashEntry {
        int   key;
        int   value;
        bool  active;
        float glow;
        Color color;
    };

    // Chaining approach
    std::vector<std::list<HashEntry>> table;

    // Animation
    struct AnimPath {
        int   key;
        float x, y;
        float targetX, targetY;
        bool  active;
        Color color;
        float life;
    };
    std::vector<AnimPath> animPaths;

    std::string inputKeyBuf, inputValBuf;
    int activeInput = 0; // 0=key, 1=val
    bool showInput  = false;
    enum class InputMode { NONE, INSERT, SEARCH, DELETE } inputMode = InputMode::NONE;

    // Stats
    int   insertions    = 0;
    int   collisions    = 0;
    float loadFactor    = 0.0f;
    std::string lastSearch;
    bool  lastSearchFound = false;
    int   probeCount    = 0;

    void Init(GameContext&) override {
        worldName  = "HASH CYBER ARENA";
        themeColor = DSAColors::HASH_COLOR;
        table.assign(TABLE_SIZE, std::list<HashEntry>());
        animPaths.resize(10);
        score = 0; ops = 0;
        insertions = 0; collisions = 0;

        // Pre-populate
        for (auto [k, v] : std::vector<std::pair<int,int>>{ {12,100}, {25,200}, {36,300}, {5,50} })
            DoInsert(k, v, true);
    }

    void Update(GameContext& ctx, float dt) override {
        anim += dt;
        particles.Update(dt);
        notifications.Update(dt);

        // Animate paths
        for (auto& ap : animPaths) {
            if (!ap.active) continue;
            ap.x    += (ap.targetX - ap.x) * 7.0f * dt;
            ap.y    += (ap.targetY - ap.y) * 7.0f * dt;
            ap.life -= dt * 1.2f;
            if (ap.life <= 0) ap.active = false;
        }

        // Input
        if (showInput) {
            int key = GetCharPressed();
            while (key > 0) {
                std::string& buf = (activeInput == 0) ? inputKeyBuf : inputValBuf;
                if (key >= '0' && key <= '9' && buf.size() < 4) buf += (char)key;
                key = GetCharPressed();
            }
            if (IsKeyPressed(KEY_BACKSPACE)) {
                std::string& buf = (activeInput == 0) ? inputKeyBuf : inputValBuf;
                if (!buf.empty()) buf.pop_back();
            }
            if (IsKeyPressed(KEY_TAB) && inputMode == InputMode::INSERT)
                activeInput = 1 - activeInput;
            if (IsKeyPressed(KEY_ENTER)) ConfirmInput();
            if (IsKeyPressed(KEY_ESCAPE)) { showInput = false; inputKeyBuf.clear(); inputValBuf.clear(); }
        }

        if (IsKeyPressed(KEY_ESCAPE) && !showInput) ctx.currentScreen = Screen::WORLD_SELECT;

        // Compute load factor
        int total = 0;
        for (auto& bucket : table) total += bucket.size();
        loadFactor = (float)total / TABLE_SIZE;

        for (auto& bucket : table)
            for (auto& e : bucket)
                e.glow = fmaxf(0.0f, e.glow - dt * 1.5f);
    }

    void Draw(GameContext& ctx, Font font) override {
        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();

        // Cyber background
        for (int y = 0; y < (int)sh; y += 2) {
            float t = (float)y / sh;
            Color c = ColorLerp({ 3, 15, 5, 255 }, { 2, 8, 3, 255 }, t);
            DrawLine(0, y, (int)sw, y, c);
        }
        DrawCyberBackground(sw, sh);
        DrawHUD(font, ctx, sw, sh);
        DrawBackButton(font, ctx);

        DrawHashTable(font, sw, sh);
        DrawAnimPaths(font);
        DrawInfoPanel(font, sw, sh);
        DrawControls(font, sw, sh);
        DrawComplexityInfo(font, "O(1) avg", "O(n)", sw - 220, 60);

        particles.Draw();
        notifications.Draw(font, sw);
        DrawScanlines({ 0, 0, sw, sh }, 0.015f);
    }

    void Cleanup() override { particles.Clear(); }
    Screen GetID() const override { return Screen::WORLD_HASH_ARENA; }

private:
    int HashFn(int key) { return ((key % TABLE_SIZE) + TABLE_SIZE) % TABLE_SIZE; }

    void DoInsert(int key, int value, bool silent = false) {
        int idx = HashFn(key);

        // Check collision
        bool coll = !table[idx].empty();
        for (auto& e : table[idx]) {
            if (e.key == key) {
                e.value = value;
                e.glow  = 1.0f;
                if (!silent) notifications.Push("Updated key " + std::to_string(key), DSAColors::NEON_GOLD);
                return;
            }
        }

        HashEntry e;
        e.key    = key;
        e.value  = value;
        e.active = true;
        e.glow   = 1.0f;
        e.color  = ColorLerp(themeColor, DSAColors::NEON_PURPLE, (float)idx / TABLE_SIZE);
        table[idx].push_back(e);
        insertions++;

        if (coll) { collisions++; if (!silent) notifications.Push("COLLISION at bucket " + std::to_string(idx) + "! Chained.", DSAColors::NEON_RED); }
        else if (!silent) notifications.Push("Inserted key=" + std::to_string(key) + " val=" + std::to_string(value) + " → bucket[" + std::to_string(idx) + "]", themeColor);

        EmitPath(key, idx);
        if (!silent) { GainScore(10.0f); ops++; }
    }

    void DoSearch(int key) {
        int idx = HashFn(key);
        probeCount = 0;
        lastSearch = std::to_string(key);
        lastSearchFound = false;
        for (auto& e : table[idx]) {
            probeCount++;
            e.glow = 0.8f;
            particles.Emit(GetBucketPos(idx), DSAColors::NEON_GOLD, 5, 50, 0.4f, 3.0f);
            if (e.key == key) {
                lastSearchFound = true;
                e.glow = 1.0f;
                e.color = DSAColors::NEON_GREEN;
                notifications.Push("FOUND! key=" + std::to_string(key) + " val=" + std::to_string(e.value) +
                                   " in " + std::to_string(probeCount) + " probe(s)", DSAColors::NEON_GREEN);
                GainScore(20.0f); ops++;
                return;
            }
        }
        notifications.Push("NOT FOUND: key=" + std::to_string(key) + " (bucket[" + std::to_string(idx) + "] searched)", DSAColors::NEON_RED);
        ops++;
    }

    void DoDelete(int key) {
        int idx = HashFn(key);
        for (auto it = table[idx].begin(); it != table[idx].end(); ++it) {
            if (it->key == key) {
                particles.Emit(GetBucketPos(idx), DSAColors::NEON_RED, 12, 80, 0.6f, 4.0f);
                table[idx].erase(it);
                notifications.Push("Deleted key=" + std::to_string(key) + " from bucket[" + std::to_string(idx) + "]", DSAColors::NEON_RED);
                GainScore(10.0f); ops++;
                return;
            }
        }
        notifications.Push("Key " + std::to_string(key) + " not found for deletion", DSAColors::NEON_RED);
    }

    Vector2 GetBucketPos(int idx) {
        float sw = (float)GetScreenWidth();
        float tableX = 240, tableW = sw - 260;
        float rowH = 44;
        return { tableX + tableW/2, 140 + idx * rowH + rowH/2 };
    }

    void EmitPath(int key, int bucket) {
        float sw = (float)GetScreenWidth();
        for (auto& ap : animPaths) {
            if (!ap.active) {
                ap.key     = key;
                ap.x       = sw/2;
                ap.y       = 80;
                ap.targetX = GetBucketPos(bucket).x;
                ap.targetY = GetBucketPos(bucket).y;
                ap.color   = themeColor;
                ap.life    = 1.5f;
                ap.active  = true;
                return;
            }
        }
    }

    void ConfirmInput() {
        showInput = false;
        if (inputMode == InputMode::INSERT) {
            if (!inputKeyBuf.empty()) DoInsert(std::stoi(inputKeyBuf), inputValBuf.empty() ? 0 : std::stoi(inputValBuf));
        } else if (inputMode == InputMode::SEARCH) {
            if (!inputKeyBuf.empty()) DoSearch(std::stoi(inputKeyBuf));
        } else if (inputMode == InputMode::DELETE) {
            if (!inputKeyBuf.empty()) DoDelete(std::stoi(inputKeyBuf));
        }
        inputKeyBuf.clear(); inputValBuf.clear();
        inputMode = InputMode::NONE;
    }

    void DrawCyberBackground(float sw, float sh) {
        // Digital rain effect
        for (int c = 0; c < 30; c++) {
            float cx = c * sw/30 + fmodf(c * 37.1f, sw/30);
            for (int r = 0; r < 15; r++) {
                float cy = fmodf(anim * 80 + r * 40 + c * 200, sh);
                DrawTextEx(GetFontDefault(),
                           std::to_string((int)(fmodf(cx + cy + anim * 30, 9) + 1)).c_str(),
                           { cx, cy }, 10, 1, ColorAlpha(themeColor, 0.06f));
            }
        }
        // Hash formula display
        DrawTextEx(GetFontDefault(), "hash(k) = k mod 11",
                   { 240, 110 }, 13, 1, ColorAlpha(themeColor, 0.4f));
    }

    void DrawHashTable(Font font, float sw, float sh) {
        float tableX = 240, tableW = sw - 260;
        float rowH   = 44;
        float startY = 130;

        GlassPanel panel({ tableX - 10, startY, tableW + 20, TABLE_SIZE * rowH + 16 },
                         "HASH TABLE (Chaining)", themeColor);
        panel.Draw(font);

        for (int i = 0; i < TABLE_SIZE; i++) {
            float ry = startY + 8 + i * rowH;

            // Index cell
            Color idxCol = table[i].empty() ? ColorAlpha(themeColor, 0.1f) : ColorAlpha(themeColor, 0.25f);
            DrawRectangle((int)tableX, (int)ry, 60, (int)(rowH - 2), idxCol);
            DrawRectangleLinesEx({ tableX, ry, 60, rowH - 2 }, 1, ColorAlpha(themeColor, 0.5f));
            DrawTextEx(font, ("[" + std::to_string(i) + "]").c_str(),
                       { tableX + 8, ry + 12 }, 14, 1, themeColor);

            // Chain entries
            float ex = tableX + 68;
            for (auto& entry : table[i]) {
                float ew = 120;
                Color ec = entry.glow > 0.01f ? entry.color : ColorAlpha(entry.color, 0.7f);
                if (entry.glow > 0.01f)
                    DrawRectangle((int)(ex - 3), (int)(ry - 3), (int)(ew + 6), (int)(rowH + 4),
                                  ColorAlpha(entry.color, entry.glow * 0.3f));
                DrawRectangle((int)ex, (int)ry, (int)ew, (int)(rowH - 2),
                              ColorAlpha(entry.color, 0.15f));
                DrawRectangleLinesEx({ ex, ry, ew, rowH - 2 }, 2, ec);

                std::string kv = std::to_string(entry.key) + "→" + std::to_string(entry.value);
                DrawTextEx(font, kv.c_str(), { ex + 8, ry + 12 }, 13, 1, ec);
                DrawLineEx({ ex + ew, ry + rowH/2 - 1 }, { ex + ew + 14, ry + rowH/2 - 1 }, 1,
                            ColorAlpha(themeColor, 0.5f));
                ex += ew + 18;
            }
            if (table[i].empty()) {
                DrawTextEx(font, "NULL", { tableX + 68, ry + 12 }, 12, 1,
                           ColorAlpha(DSAColors::TEXT_DIM, 0.4f));
            }
        }

        // Load factor bar
        float lfy = startY + TABLE_SIZE * rowH + 22;
        DrawTextEx(font, ("Load factor: " + std::to_string(loadFactor).substr(0,4)).c_str(),
                   { tableX, lfy }, 12, 1, DSAColors::TEXT_SECONDARY);
        ProgressBar lb({ tableX + 140, lfy + 1, 200, 14 },
                       loadFactor > 0.7f ? DSAColors::NEON_RED : DSAColors::NEON_GREEN, true);
        lb.SetValue(loadFactor);
        lb.displayValue = loadFactor;
        lb.Draw(font);
    }

    void DrawAnimPaths(Font font) {
        for (auto& ap : animPaths) {
            if (!ap.active) continue;
            float a = Clamp(ap.life / 1.5f, 0.0f, 1.0f);
            DrawCircle((int)ap.x, (int)ap.y, 12, ColorAlpha(ap.color, a * 0.6f));
            DrawTextEx(font, std::to_string(ap.key).c_str(), { ap.x - 6, ap.y - 7 }, 12, 1,
                       ColorAlpha(DSAColors::TEXT_WHITE, a));
            // Trail
            DrawLineEx({ ap.x, ap.y }, { ap.targetX, ap.targetY }, 1,
                       ColorAlpha(ap.color, a * 0.2f));
        }
    }

    void DrawInfoPanel(Font font, float sw, float) {
        GlassPanel panel({ 20, 60, 210, 200 }, "HASH STATS", themeColor);
        panel.Draw(font);
        float fy = 104;
        auto row = [&](const char* k, const std::string& v, Color col) {
            DrawTextEx(font, k, { 32, fy }, 11, 1, DSAColors::TEXT_SECONDARY);
            DrawTextEx(font, v.c_str(), { 32, fy + 14 }, 14, 1, col);
            fy += 32;
        };
        int total = 0;
        for (auto& b : table) total += b.size();
        row("TABLE SIZE", std::to_string(TABLE_SIZE),               DSAColors::NEON_CYAN);
        row("ENTRIES",    std::to_string(total),                    themeColor);
        row("COLLISIONS", std::to_string(collisions),               collisions > 0 ? DSAColors::NEON_RED : DSAColors::NEON_GREEN);
        row("LAST SEARCH",lastSearch.empty() ? "-" : lastSearch,   DSAColors::NEON_GOLD);
        row("PROBES",     std::to_string(probeCount),               DSAColors::NEON_CYAN);
    }

    void DrawControls(Font font, float sw, float sh) {
        float py = sh - 105;
        GlassPanel panel({ 20, py, sw - 40, 85 }, "HASH OPERATIONS", themeColor);
        panel.Draw(font);

        float bw = 145, bh = 42, gap = 14;
        float totalBW = 4 * (bw + gap) - gap;
        float bx = sw/2 - totalBW/2;
        float by = py + 24;

        struct Op { std::string lbl; Color col; InputMode m; };
        std::vector<Op> ops2 = {
            { "INSERT K/V",  DSAColors::NEON_GREEN,  InputMode::INSERT },
            { "SEARCH",      DSAColors::NEON_GOLD,   InputMode::SEARCH },
            { "DELETE",      DSAColors::NEON_RED,    InputMode::DELETE },
            { "CLEAR ALL",   DSAColors::TEXT_DIM,    InputMode::NONE },
        };

        for (int i = 0; i < (int)ops2.size(); i++) {
            CyberButton btn({ bx + i*(bw+gap), by, bw, bh }, ops2[i].lbl, ops2[i].col, 13);
            if (btn.Update(0.016f)) {
                if (ops2[i].lbl == "CLEAR ALL") {
                    table.assign(TABLE_SIZE, std::list<HashEntry>());
                    insertions = collisions = 0;
                    notifications.Push("Hash table cleared!", DSAColors::NEON_RED);
                } else {
                    inputMode = ops2[i].m;
                    showInput = true;
                    inputKeyBuf.clear(); inputValBuf.clear();
                    activeInput = 0;
                }
            }
            btn.Draw(font);
        }

        if (showInput) {
            float ix = sw/2 - 200, iy = by - 90;
            DrawRectangle((int)ix - 10, (int)iy - 8, 420, 84, DSAColors::BG_PANEL_SOLID);
            DrawRectangleLinesEx({ ix-10, iy-8, 420, 84 }, 2, themeColor);

            auto drawField = [&](const char* lbl, const std::string& buf, float x, float y, bool active) {
                DrawTextEx(font, lbl, { x, y }, 12, 1, active ? themeColor : DSAColors::TEXT_SECONDARY);
                Rectangle r = { x, y + 16, 100, 28 };
                DrawRectangleRec(r, DSAColors::BG_DARK);
                DrawRectangleLinesEx(r, active ? 2 : 1, active ? themeColor : ColorAlpha(themeColor, 0.3f));
                std::string d = buf + (active && fmod(GetTime(), 1.0) < 0.5 ? "|" : "");
                DrawTextEx(font, d.c_str(), { x + 6, y + 22 }, 14, 1, DSAColors::TEXT_WHITE);
            };

            drawField("KEY", inputKeyBuf, ix, iy, activeInput == 0);
            if (inputMode == InputMode::INSERT)
                drawField("VALUE (TAB)", inputValBuf, ix + 120, iy, activeInput == 1);
        }
    }
};
