#pragma once
#include "Screen.h"
#include "../firebase/Firebase.h"
#include <string>
#include <array>

class LoginScreen : public IScreen {
public:
    enum class Mode { LOGIN, REGISTER };
    Mode  mode = Mode::LOGIN;

    // Input fields
    std::string email, password, username;
    int activeField = 0; // 0=email,1=pass,2=username(register)

    std::string statusMsg;
    Color       statusColor;
    float       statusTimer = 0.0f;

    bool  loading = false;
    float loadAnim = 0.0f;
    float anim = 0.0f;

    ParticleSystem particles;

    FirebaseClient* firebase = nullptr;

    LoginScreen() : particles(150) {}
    void SetFirebase(FirebaseClient* fb) { firebase = fb; }

    void Init(GameContext&) override {
        email.clear(); password.clear(); username.clear();
        statusMsg.clear(); loading = false; anim = 0; activeField = 0;
    }

    void Update(GameContext& ctx, float dt) override {
        anim += dt;
        loadAnim += dt * 4.0f;
        if (statusTimer > 0) statusTimer -= dt;

        // Background particles
        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();
        if (rand() % 4 == 0)
            particles.EmitSparkle({ (float)(rand() % (int)sw), sh }, DSAColors::NEON_PURPLE);
        particles.Update(dt);

        // Keyboard input handling
        int key = GetCharPressed();
        while (key > 0) {
            if (!loading) {
                std::string& field = activeField == 0 ? email
                                  : activeField == 1 ? password
                                  : username;
                if (key >= 32 && key <= 125 && field.size() < 64)
                    field += (char)key;
            }
            key = GetCharPressed();
        }
        if (IsKeyPressed(KEY_BACKSPACE) && !loading) {
            std::string& field = activeField == 0 ? email
                              : activeField == 1 ? password
                              : username;
            if (!field.empty()) field.pop_back();
        }
        if (IsKeyPressed(KEY_TAB) && !loading) {
            int nFields = (mode == Mode::LOGIN) ? 2 : 3;
            activeField = (activeField + 1) % nFields;
        }
        if (IsKeyPressed(KEY_ENTER) && !loading) {
            DoSubmit(ctx);
        }
    }

    void Draw(GameContext&, Font font) override {
        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();
        ClearBackground(DSAColors::BG_DARK);

        // Gradient bg
        for (int y = 0; y < (int)sh; y += 2) {
            float t = (float)y / sh;
            Color c = ColorLerp(DSAColors::BG_DARK, DSAColors::BG_MID, t * 0.5f);
            DrawLine(0, y, (int)sw, y, c);
        }
        particles.Draw();

        // Panel
        float pw = 480, ph = (mode == Mode::LOGIN) ? 420 : 500;
        float px = sw/2 - pw/2, py = sh/2 - ph/2;
        float slideIn = Ease::OutCubic(Clamp(anim / 0.5f, 0.0f, 1.0f));
        py = sh/2 - ph/2 + (1.0f - slideIn) * 60;

        GlassPanel panel({ px, py, pw, ph },
                         mode == Mode::LOGIN ? "PLAYER LOGIN" : "CREATE ACCOUNT",
                         DSAColors::NEON_PURPLE);
        panel.Draw(font);

        float fy = py + 60;
        Color accent = DSAColors::NEON_PURPLE;

        // Fields
        if (mode == Mode::REGISTER) {
            DrawField(font, "USERNAME", username, px + 30, fy, pw - 60, activeField == 2, accent, false);
            fy += 80;
        }
        DrawField(font, "EMAIL", email, px + 30, fy, pw - 60, activeField == 0, accent, false);
        fy += 80;
        DrawField(font, "PASSWORD", password, px + 30, fy, pw - 60, activeField == 1, accent, true);
        fy += 90;

        // Submit button
        CyberButton submitBtn({ px + 30, fy, pw - 60, 48 },
                              loading ? "PROCESSING..." : (mode == Mode::LOGIN ? "SIGN IN" : "CREATE ACCOUNT"),
                              accent, 18);
        submitBtn.hoverAnim = 0;
        submitBtn.Draw(font);
        if (!loading && CheckCollisionPointRec(GetMousePosition(), submitBtn.rect) &&
            IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) {
            // handled in Update via DoSubmit
        }

        // Mode toggle
        fy += 60;
        const char* toggleMsg = mode == Mode::LOGIN
            ? "No account?  CREATE ONE"
            : "Have account?  SIGN IN";
        Vector2 tSz = MeasureTextEx(font, toggleMsg, 14, 1);
        Color tCol = CheckCollisionPointRec(GetMousePosition(), { px + pw/2 - tSz.x/2 - 5, fy - 5, tSz.x + 10, 24 })
                     ? DSAColors::NEON_CYAN : DSAColors::TEXT_SECONDARY;
        DrawTextEx(font, toggleMsg, { px + pw/2 - tSz.x/2, fy }, 14, 1, tCol);

        // Check toggle click
        if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON) &&
            CheckCollisionPointRec(GetMousePosition(), { px + pw/2 - tSz.x/2 - 5, fy - 5, tSz.x + 10, 24 })) {
            mode = (mode == Mode::LOGIN) ? Mode::REGISTER : Mode::LOGIN;
            activeField = 0;
        }

        // Guest button
        fy += 35;
        const char* guestTxt = "Continue as Guest";
        Vector2 gSz = MeasureTextEx(font, guestTxt, 13, 1);
        Color gCol = CheckCollisionPointRec(GetMousePosition(), { px + pw/2 - gSz.x/2 - 5, fy - 5, gSz.x + 10, 24 })
                     ? DSAColors::NEON_GREEN : DSAColors::TEXT_DIM;
        DrawTextEx(font, guestTxt, { px + pw/2 - gSz.x/2, fy }, 13, 1, gCol);
        if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON) &&
            CheckCollisionPointRec(GetMousePosition(), { px + pw/2 - gSz.x/2 - 5, fy - 5, gSz.x + 10, 24 })) {
            // handled in Update
        }

        // Loading spinner
        if (loading) {
            float cx = px + pw/2, cy2 = fy + 30;
            for (int i = 0; i < 8; i++) {
                float angle = loadAnim + i * PI / 4;
                float r = 14;
                float a = (float)i / 8.0f;
                DrawCircle((int)(cx + cosf(angle)*r), (int)(cy2 + sinf(angle)*r),
                           3, ColorAlpha(accent, a));
            }
        }

        // Status message
        if (!statusMsg.empty() && statusTimer > 0) {
            float alpha = Clamp(statusTimer / 0.5f, 0.0f, 1.0f);
            Vector2 sSz = MeasureTextEx(font, statusMsg.c_str(), 14, 1);
            DrawTextEx(font, statusMsg.c_str(), { sw/2 - sSz.x/2, py + ph + 16 },
                       14, 1, ColorAlpha(statusColor, alpha));
        }

        // Field click detection
        if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON) && !loading) {
            float fy2 = py + 60;
            if (mode == Mode::REGISTER) {
                if (CheckCollisionPointRec(GetMousePosition(), { px+30, fy2+20, pw-60, 32 })) activeField = 2;
                fy2 += 80;
            }
            if (CheckCollisionPointRec(GetMousePosition(), { px+30, fy2+20, pw-60, 32 })) activeField = 0;
            fy2 += 80;
            if (CheckCollisionPointRec(GetMousePosition(), { px+30, fy2+20, pw-60, 32 })) activeField = 1;
            fy2 += 90;
            if (CheckCollisionPointRec(GetMousePosition(), { px+30, fy2, pw-60, 48 })) { /* submit handled in Update */ }
        }
    }

    void Cleanup() override {}
    Screen GetID() const override { return Screen::LOGIN; }

private:
    void DrawField(Font font, const char* label, const std::string& value,
                   float x, float y, float w, bool active, Color accent, bool password_field) {
        DrawTextEx(font, label, { x, y }, 11, 2, DSAColors::TEXT_SECONDARY);
        Rectangle r = { x, y + 18, w, 34 };
        DrawRectangleRec(r, DSAColors::BG_PANEL_SOLID);
        DrawRectangleLinesEx(r, active ? 2 : 1,
                             active ? accent : ColorAlpha(accent, 0.3f));
        if (active) {
            DrawRectangleLinesEx({ r.x-1, r.y-1, r.width+2, r.height+2 }, 1,
                                 ColorAlpha(accent, 0.2f));
        }

        std::string display = password_field ? std::string(value.size(), '*') : value;
        if (active) display += (fmod(GetTime(), 1.0) < 0.5 ? "|" : "");

        DrawTextEx(font, display.c_str(), { x + 10, y + 26 }, 15, 1, DSAColors::TEXT_PRIMARY);
    }

    void SetStatus(const std::string& msg, Color col, float duration = 4.0f) {
        statusMsg   = msg;
        statusColor = col;
        statusTimer = duration;
    }

    void DoSubmit(GameContext& ctx) {
        if (loading) return;
        if (mode == Mode::LOGIN) {
            if (email.empty() || password.empty()) {
                SetStatus("Please fill in email and password", DSAColors::NEON_RED);
                return;
            }
            loading = true;
            if (firebase) {
                firebase->SignIn(email, password, [this, &ctx](bool ok, const json& resp) {
                    loading = false;
                    if (ok) {
                        ctx.player.isLoggedIn = true;
                        ctx.player.uid   = firebase->localId;
                        ctx.player.email = email;
                        ctx.currentScreen = Screen::MAIN_MENU;
                    } else {
                        std::string err = resp.value("error", json{}).value("message", "Sign in failed");
                        SetStatus(err, DSAColors::NEON_RED);
                    }
                });
            } else {
                // Demo mode without Firebase
                loading = false;
                ctx.player.isLoggedIn = true;
                ctx.player.username   = email;
                ctx.player.email      = email;
                ctx.currentScreen     = Screen::MAIN_MENU;
            }
        } else {
            if (username.empty() || email.empty() || password.empty()) {
                SetStatus("Please fill in all fields", DSAColors::NEON_RED);
                return;
            }
            if (password.size() < 6) {
                SetStatus("Password must be at least 6 characters", DSAColors::NEON_RED);
                return;
            }
            loading = true;
            if (firebase) {
                firebase->SignUp(email, password, username, [this, &ctx](bool ok, const json& resp) {
                    loading = false;
                    if (ok) {
                        ctx.player.isLoggedIn = true;
                        ctx.player.uid      = firebase->localId;
                        ctx.player.username = username;
                        ctx.player.email    = email;
                        ctx.currentScreen   = Screen::MAIN_MENU;
                    } else {
                        std::string err = resp.value("error", json{}).value("message", "Sign up failed");
                        SetStatus(err, DSAColors::NEON_RED);
                    }
                });
            } else {
                loading = false;
                ctx.player.isLoggedIn = true;
                ctx.player.username   = username;
                ctx.player.email      = email;
                ctx.currentScreen     = Screen::MAIN_MENU;
            }
        }
    }
};
