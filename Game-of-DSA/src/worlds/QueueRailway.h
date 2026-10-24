#pragma once
#include "World.h"
#include <deque>
#include <vector>
#include <string>

struct TrainCar {
    int   value;
    float x, y;
    float targetX;
    float alpha;
    Color color;
    float glow;
    bool  dequeuing = false;
    float dequeueAnim = 0.0f; // 0..1
};

class QueueRailwayWorld : public World {
public:
    std::deque<TrainCar> queue;
    static constexpr int MAX_QUEUE = 8;
    static constexpr float CAR_W   = 90.0f;
    static constexpr float CAR_H   = 60.0f;

    float trainMotion = 0.0f; // animated track movement
    float stationPulse = 0.0f;
    bool  enqueueing = false;
    bool  dequeuing  = false;
    float dequeueX   = 0.0f;
    float dequeueAlpha = 1.0f;
    int   dequeuedVal = 0;

    std::string inputBuf;
    bool showInput = false;

    // Challenge: passenger queue simulation
    struct Passenger { int id; float waitTime; bool served; };
    std::vector<Passenger> passengers;
    float passengerTimer = 0.0f;
    int   passengersServed = 0;

    void Init(GameContext&) override {
        worldName  = "QUEUE RAILWAY";
        themeColor = DSAColors::QUEUE_COLOR;
        queue.clear();
        inputBuf.clear();
        showInput = false;
        score     = 0;
        ops       = 0;

        // Initial queue
        EnqueueVal(15, true);
        EnqueueVal(32, true);
        EnqueueVal(7,  true);
        EnqueueVal(61, true);

        passengers.clear();
        passengerTimer = 0.0f;
        passengersServed = 0;
    }

    void Update(GameContext& ctx, float dt) override {
        anim         += dt;
        trainMotion  += dt * 60.0f;
        stationPulse  = sinf(anim * 2.0f) * 0.5f + 0.5f;

        particles.Update(dt);
        notifications.Update(dt);

        float sw = (float)GetScreenWidth();
        float trackY = (float)GetScreenHeight() / 2.0f + 20.0f;

        // Compute car positions
        float totalW = queue.size() * (CAR_W + 12) - 12;
        float startX = sw / 2.0f - totalW / 2.0f + 50.0f; // offset toward back (REAR end)

        for (int i = 0; i < (int)queue.size(); i++) {
            queue[i].targetX = startX + i * (CAR_W + 12);
            queue[i].x       += (queue[i].targetX - queue[i].x) * 7.0f * dt;
            queue[i].y        = trackY - CAR_H / 2.0f;
            queue[i].glow     = fmaxf(0.0f, queue[i].glow - dt * 2.0f);

            // Dequeue animation
            if (i == 0 && dequeuing) {
                dequeueX    -= 200.0f * dt;
                dequeueAlpha = fmaxf(0.0f, dequeueAlpha - dt * 2.5f);
                if (dequeueAlpha <= 0.0f) {
                    queue.pop_front();
                    dequeuing = false;
                    particles.EmitBurst({ 80, trackY }, themeColor, 0, PI/2, 15, 180, 0.7f);
                    notifications.Push("DEQUEUE → " + std::to_string(dequeuedVal) + " departed!",
                                       themeColor);
                    GainScore(15.0f);
                    passengersServed++;
                }
            }
        }

        // Passenger simulation
        passengerTimer += dt;
        if (passengerTimer > 5.0f && (int)queue.size() < MAX_QUEUE) {
            passengerTimer = 0.0f;
            int newVal = 10 + rand() % 90;
            EnqueueVal(newVal);
            notifications.Push("New passenger #" + std::to_string(newVal) + " joins queue!",
                               DSAColors::NEON_GREEN);
        }

        // Input
        if (showInput) {
            int key = GetCharPressed();
            while (key > 0) {
                if (key >= '0' && key <= '9' && inputBuf.size() < 3) inputBuf += (char)key;
                key = GetCharPressed();
            }
            if (IsKeyPressed(KEY_BACKSPACE) && !inputBuf.empty()) inputBuf.pop_back();
            if (IsKeyPressed(KEY_ENTER)) {
                if (!inputBuf.empty()) EnqueueVal(std::stoi(inputBuf));
                inputBuf.clear(); showInput = false;
            }
            if (IsKeyPressed(KEY_ESCAPE)) { inputBuf.clear(); showInput = false; }
        }

        if (IsKeyPressed(KEY_ESCAPE) && !showInput) ctx.currentScreen = Screen::WORLD_SELECT;
    }

    void Draw(GameContext& ctx, Font font) override {
        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();

        // Blue railway background
        for (int y = 0; y < (int)sh; y += 2) {
            float t = (float)y / sh;
            Color c = ColorLerp({ 5, 15, 35, 255 }, { 3, 8, 20, 255 }, t);
            DrawLine(0, y, (int)sw, y, c);
        }

        DrawHUD(font, ctx, sw, sh);
        DrawBackButton(font, ctx);

        float trackY = sh / 2.0f + 20.0f;
        DrawRailwayScene(font, sw, sh, trackY);
        DrawQueuePanel(font, sw, sh, trackY);
        DrawControlPanel(font, sw, sh);
        DrawInfoPanel(font, sw, sh);
        DrawComplexityInfo(font, "O(1)", "O(n)", sw - 220, 60);

        particles.Draw();
        notifications.Draw(font, sw);
        DrawScanlines({ 0, 0, sw, sh }, 0.015f);
    }

    void Cleanup() override { particles.Clear(); }
    Screen GetID() const override { return Screen::WORLD_QUEUE_RAILWAY; }

private:
    void EnqueueVal(int v, bool instant = false) {
        if ((int)queue.size() >= MAX_QUEUE) {
            notifications.Push("Queue is FULL! Max " + std::to_string(MAX_QUEUE), DSAColors::NEON_RED);
            return;
        }
        TrainCar car;
        car.value   = v;
        car.targetX = 900.0f; // starts off-screen right
        car.x       = instant ? 0.0f : 900.0f;
        car.alpha   = 1.0f;
        car.color   = ColorLerp(themeColor, DSAColors::NEON_PURPLE,
                                (float)queue.size() / MAX_QUEUE);
        car.glow    = 1.0f;
        queue.push_back(car);

        if (!instant) {
            notifications.Push("ENQUEUE " + std::to_string(v) + " → rear of queue", themeColor);
            GainScore(10.0f);
            ops++;
        }
    }

    void DoDequeue() {
        if (queue.empty()) {
            notifications.Push("Queue UNDERFLOW! Nothing to dequeue.", DSAColors::NEON_RED);
            return;
        }
        dequeuedVal  = queue.front().value;
        dequeueX     = queue.front().x;
        dequeueAlpha = 1.0f;
        dequeuing    = true;
        ops++;
    }

    void DrawRailwayScene(Font font, float sw, float sh, float trackY) {
        // Sky / background
        DrawRectangleGradientV(0, 52, (int)sw, (int)(trackY - 70),
                               { 5, 15, 40, 255 }, { 10, 25, 55, 200 });

        // City skyline silhouette
        for (int b = 0; b < 20; b++) {
            float bx = b * (sw / 20.0f);
            float bh = 40.0f + sinf(b * 1.3f) * 30.0f;
            DrawRectangle((int)bx, (int)(trackY - 90 - bh), (int)(sw / 22.0f), (int)bh,
                          ColorAlpha({ 15, 30, 60, 255 }, 0.8f));
            // Windows
            for (int wx = 0; wx < 2; wx++)
                for (int wy = 0; wy < 3; wy++) {
                    bool lit = (rand() % 4 != 0) || fmod(anim, 5.0) > 4.5;
                    DrawRectangle((int)(bx + 4 + wx * 8), (int)(trackY - 80 - bh + wy * 12 + 4),
                                  5, 5, ColorAlpha(DSAColors::NEON_GOLD, lit ? 0.5f : 0.05f));
                }
        }

        // Ground
        DrawRectangle(0, (int)(trackY + CAR_H/2 + 5), (int)sw, (int)(sh - trackY - CAR_H/2 - 5),
                      { 15, 25, 50, 255 });

        // Railway tracks
        float t1 = trainMotion;
        for (float x = fmodf(-t1, 30.0f) - 30; x < sw + 30; x += 30) {
            DrawRectangle((int)x, (int)(trackY + CAR_H/2 + 2), 20, 8,
                          ColorAlpha({ 60, 70, 80, 255 }, 0.8f));
        }
        DrawLineEx({ 0, trackY + CAR_H/2 + 2 }, { sw, trackY + CAR_H/2 + 2 }, 4,
                   ColorAlpha(DSAColors::TEXT_DIM, 0.5f));
        DrawLineEx({ 0, trackY + CAR_H/2 + 12 }, { sw, trackY + CAR_H/2 + 12 }, 4,
                   ColorAlpha(DSAColors::TEXT_DIM, 0.5f));

        // FRONT station (dequeue side)
        DrawRectangle(0, (int)(trackY - CAR_H), 90, (int)(CAR_H + 30),
                      ColorAlpha(DSAColors::QUEUE_COLOR, 0.1f));
        DrawRectangleLinesEx({ 0, trackY - CAR_H, 90, CAR_H + 30 }, 1,
                             ColorAlpha(DSAColors::QUEUE_COLOR, 0.5f));
        DrawTextEx(font, "FRONT\n(DEQUEUE)", { 4, trackY - CAR_H + 5 }, 11, 1, DSAColors::QUEUE_COLOR);

        // REAR station (enqueue side)
        DrawRectangle((int)(sw - 100), (int)(trackY - CAR_H), 100, (int)(CAR_H + 30),
                      ColorAlpha(DSAColors::NEON_PURPLE, 0.1f));
        DrawRectangleLinesEx({ sw - 100, trackY - CAR_H, 100, CAR_H + 30 }, 1,
                             ColorAlpha(DSAColors::NEON_PURPLE, 0.5f));
        DrawTextEx(font, "REAR\n(ENQUEUE)", { sw - 96, trackY - CAR_H + 5 }, 11, 1, DSAColors::NEON_PURPLE);

        // Direction arrow
        DrawLineEx({ sw/2 - 80, trackY - 30 }, { sw/2 + 80, trackY - 30 }, 2, themeColor);
        DrawTriangle({ sw/2 - 80, trackY - 30 },
                     { sw/2 - 70, trackY - 38 },
                     { sw/2 - 70, trackY - 22 }, themeColor);
        DrawTextEx(font, "→ FLOW", { sw/2 - 25, trackY - 44 }, 11, 1, themeColor);

        // Train cars
        for (int i = 0; i < (int)queue.size(); i++) {
            auto& car = queue[i];
            float cx = (i == 0 && dequeuing) ? dequeueX : car.x;
            float cy = car.y;
            float ca = (i == 0 && dequeuing) ? dequeueAlpha : 1.0f;

            // Glow
            if (car.glow > 0.01f)
                DrawRectangle((int)(cx - 4), (int)(cy - 4), (int)(CAR_W + 8), (int)(CAR_H + 8),
                              ColorAlpha(car.color, car.glow * 0.3f * ca));

            // Body
            DrawRectangle((int)cx, (int)cy, (int)CAR_W, (int)CAR_H,
                          ColorAlpha(ColorLerp(DSAColors::BG_PANEL_SOLID, car.color, 0.2f), ca));
            DrawRectangleLinesEx({ cx, cy, CAR_W, CAR_H }, 2, ColorAlpha(car.color, ca));

            // Window
            DrawRectangle((int)(cx + 8), (int)(cy + 8), (int)(CAR_W - 16), 20,
                          ColorAlpha(car.color, 0.15f * ca));
            DrawRectangleLinesEx({ cx + 8, cy + 8, CAR_W - 16, 20 }, 1,
                                 ColorAlpha(car.color, 0.4f * ca));

            // Wheels
            DrawCircle((int)(cx + 15), (int)(cy + CAR_H + 4), 8,
                       ColorAlpha({ 80, 80, 80, 255 }, ca));
            DrawCircle((int)(cx + CAR_W - 15), (int)(cy + CAR_H + 4), 8,
                       ColorAlpha({ 80, 80, 80, 255 }, ca));

            // Value
            std::string vs = std::to_string(car.value);
            Vector2 vSz = MeasureTextEx(font, vs.c_str(), 20, 1);
            DrawTextEx(font, vs.c_str(),
                       { cx + CAR_W/2 - vSz.x/2, cy + CAR_H/2 - vSz.y/2 + 4 },
                       20, 1, ColorAlpha(car.color, ca));

            // Index
            std::string idx = "[" + std::to_string(i) + "]";
            Vector2 iSz = MeasureTextEx(font, idx.c_str(), 10, 1);
            DrawTextEx(font, idx.c_str(), { cx + CAR_W/2 - iSz.x/2, cy - 16 },
                       10, 1, ColorAlpha(DSAColors::TEXT_DIM, ca));
        }
    }

    void DrawQueuePanel(Font font, float sw, float sh, float trackY) {
        // Queue state text visualization below tracks
        float py = trackY + CAR_H/2 + 30;
        GlassPanel panel({ 20, py, sw - 40, 50 }, "", themeColor);
        panel.Draw(font);

        DrawTextEx(font, "QUEUE: [", { 34, py + 16 }, 15, 1, themeColor);
        std::string qStr;
        for (int i = 0; i < (int)queue.size(); i++) {
            qStr += std::to_string(queue[i].value);
            if (i < (int)queue.size() - 1) qStr += ", ";
        }
        qStr += " ]  ← FRONT";
        DrawTextEx(font, qStr.c_str(), { 116, py + 16 }, 15, 1, DSAColors::TEXT_PRIMARY);
    }

    void DrawControlPanel(Font font, float sw, float sh) {
        float py = sh - 130;
        GlassPanel panel({ 20, py, sw - 40, 110 }, "QUEUE OPERATIONS", themeColor);
        panel.Draw(font);

        float bw = 160, bh = 44, gap = 20;
        float totalBW = 4 * (bw + gap) - gap;
        float bx = sw/2 - totalBW/2;
        float by = py + 44;

        struct Op { std::string lbl; Color col; std::string hint; };
        std::vector<Op> ops2 = {
            { "ENQUEUE", DSAColors::NEON_GREEN,  "Add to rear" },
            { "DEQUEUE", DSAColors::NEON_RED,    "Remove from front" },
            { "PEEK",    DSAColors::NEON_GOLD,   "View front" },
            { "CLEAR",   DSAColors::TEXT_DIM,    "Empty queue" },
        };

        for (int i = 0; i < (int)ops2.size(); i++) {
            CyberButton btn({ bx + i*(bw+gap), by, bw, bh }, ops2[i].lbl, ops2[i].col, 15);
            if (btn.Update(0.016f)) {
                if (ops2[i].lbl == "ENQUEUE") { showInput = true; inputBuf.clear(); }
                else if (ops2[i].lbl == "DEQUEUE") DoDequeue();
                else if (ops2[i].lbl == "PEEK") {
                    if (!queue.empty())
                        notifications.Push("PEEK → Front = " + std::to_string(queue.front().value),
                                           DSAColors::NEON_GOLD);
                    else notifications.Push("Queue is empty!", DSAColors::NEON_RED);
                } else if (ops2[i].lbl == "CLEAR") {
                    queue.clear();
                    notifications.Push("Queue cleared!", DSAColors::NEON_RED);
                }
            }
            btn.Draw(font);

            Vector2 hSz = MeasureTextEx(font, ops2[i].hint.c_str(), 10, 1);
            DrawTextEx(font, ops2[i].hint.c_str(),
                       { bx + i*(bw+gap) + bw/2 - hSz.x/2, by + bh + 4 },
                       10, 1, ColorAlpha(ops2[i].col, 0.6f));
        }

        if (showInput) {
            float ix = sw/2 - 160, iy = by - 70;
            DrawRectangle((int)ix - 10, (int)iy - 8, 340, 64, DSAColors::BG_PANEL_SOLID);
            DrawRectangleLinesEx({ ix-10, iy-8, 340, 64 }, 2, themeColor);
            DrawTextEx(font, "Enter value to ENQUEUE:", { ix, iy }, 13, 1, themeColor);
            Rectangle ir = { ix, iy + 20, 320, 32 };
            DrawRectangleRec(ir, DSAColors::BG_DARK);
            DrawRectangleLinesEx(ir, 2, themeColor);
            std::string disp = inputBuf + (fmod(GetTime(), 1.0) < 0.5 ? "|" : "");
            DrawTextEx(font, disp.c_str(), { ix + 8, iy + 27 }, 17, 1, DSAColors::TEXT_WHITE);
        }
    }

    void DrawInfoPanel(Font font, float sw, float) {
        GlassPanel panel({ 20, 60, 200, 160 }, "QUEUE STATE", themeColor);
        panel.Draw(font);
        float fy = 104;
        auto row = [&](const char* k, const std::string& v, Color col) {
            DrawTextEx(font, k, { 32, fy }, 11, 1, DSAColors::TEXT_SECONDARY);
            DrawTextEx(font, v.c_str(), { 32, fy + 14 }, 14, 1, col);
            fy += 30;
        };
        row("SIZE",  std::to_string(queue.size()),                                  DSAColors::NEON_CYAN);
        row("FRONT", queue.empty() ? "EMPTY" : std::to_string(queue.front().value), DSAColors::NEON_GREEN);
        row("REAR",  queue.empty() ? "EMPTY" : std::to_string(queue.back().value),  DSAColors::NEON_ORANGE);
        row("SERVED",std::to_string(passengersServed),                              DSAColors::NEON_GOLD);
    }
};
