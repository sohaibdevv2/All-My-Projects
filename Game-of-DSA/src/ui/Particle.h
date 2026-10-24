#pragma once
#include "raylib.h"
#include "raymath.h"
#include "../core/Colors.h"
#include <vector>
#include <cstdlib>
#include <cmath>

struct Particle {
    Vector2 pos;
    Vector2 vel;
    Color   color;
    float   size;
    float   life;      // 0..1, dies at 0
    float   decay;     // life reduction per second
    float   alpha;
    bool    active = false;
};

class ParticleSystem {
public:
    std::vector<Particle> particles;
    int maxParticles;

    ParticleSystem(int max = 500) : maxParticles(max) {
        particles.resize(max);
    }

    void Emit(Vector2 pos, Color color, int count = 10,
              float speed = 120.0f, float life = 1.5f, float size = 4.0f) {
        for (int i = 0; i < count; i++) {
            for (auto& p : particles) {
                if (!p.active) {
                    float angle = ((float)rand() / (float)RAND_MAX) * 2.0f * PI;
                    float spd   = speed * (0.3f + (float)rand() / (float)RAND_MAX * 0.7f);
                    p.pos   = pos;
                    p.vel   = { cosf(angle) * spd, sinf(angle) * spd };
                    p.color = color;
                    p.size  = size * (0.5f + (float)rand() / (float)RAND_MAX * 0.5f);
                    p.life  = life * (0.7f + (float)rand() / (float)RAND_MAX * 0.3f);
                    p.decay = 1.0f / p.life;
                    p.alpha = 1.0f;
                    p.active = true;
                    break;
                }
            }
        }
    }

    // Directional burst
    void EmitBurst(Vector2 pos, Color color, float dirAngle, float spread,
                   int count = 15, float speed = 200.0f, float life = 1.0f) {
        for (int i = 0; i < count; i++) {
            for (auto& p : particles) {
                if (!p.active) {
                    float angle = dirAngle + (((float)rand() / (float)RAND_MAX) - 0.5f) * spread;
                    float spd   = speed * (0.4f + (float)rand() / (float)RAND_MAX * 0.6f);
                    p.pos   = pos;
                    p.vel   = { cosf(angle) * spd, sinf(angle) * spd };
                    p.color = color;
                    p.size  = 5.0f * (0.5f + (float)rand() / (float)RAND_MAX * 0.5f);
                    p.life  = life;
                    p.decay = 1.0f / p.life;
                    p.alpha = 1.0f;
                    p.active = true;
                    break;
                }
            }
        }
    }

    // Floating sparkles (for backgrounds)
    void EmitSparkle(Vector2 pos, Color color) {
        for (auto& p : particles) {
            if (!p.active) {
                float angle = ((float)rand() / (float)RAND_MAX) * 2.0f * PI;
                float spd   = 20.0f + (float)rand() / (float)RAND_MAX * 40.0f;
                p.pos   = pos;
                p.vel   = { cosf(angle) * spd, sinf(angle) * spd - 30.0f };
                p.color = color;
                p.size  = 2.0f + (float)rand() / (float)RAND_MAX * 3.0f;
                p.life  = 2.0f + (float)rand() / (float)RAND_MAX * 2.0f;
                p.decay = 1.0f / p.life;
                p.alpha = 1.0f;
                p.active = true;
                return;
            }
        }
    }

    void Update(float dt) {
        for (auto& p : particles) {
            if (!p.active) continue;
            p.life -= p.decay * dt;
            if (p.life <= 0.0f) { p.active = false; continue; }
            p.alpha = p.life;
            p.pos.x += p.vel.x * dt;
            p.pos.y += p.vel.y * dt;
            p.vel.y += 60.0f * dt; // gravity
            p.size  *= (1.0f - dt * 0.5f);
        }
    }

    void Draw() const {
        for (const auto& p : particles) {
            if (!p.active) continue;
            Color c = ColorAlpha(p.color, p.alpha * 0.9f);
            DrawCircleV(p.pos, p.size, c);
            // Glow effect
            Color glow = ColorAlpha(p.color, p.alpha * 0.3f);
            DrawCircleV(p.pos, p.size * 2.0f, glow);
        }
    }

    void Clear() {
        for (auto& p : particles) p.active = false;
    }

    int ActiveCount() const {
        int n = 0;
        for (const auto& p : particles) if (p.active) n++;
        return n;
    }
};

// Background floating particles for atmosphere
class BackgroundParticles {
public:
    struct BgParticle {
        Vector2 pos;
        float   speed;
        float   size;
        float   alpha;
        float   phase;  // for pulsing
        Color   color;
    };

    std::vector<BgParticle> pts;
    float screenW, screenH;

    BackgroundParticles(float w, float h, int count = 80) : screenW(w), screenH(h) {
        pts.resize(count);
        Color colors[] = {
            DSAColors::NEON_CYAN, DSAColors::NEON_PINK,
            DSAColors::NEON_PURPLE, DSAColors::NEON_GREEN
        };
        for (auto& p : pts) {
            p.pos   = { (float)(rand() % (int)w), (float)(rand() % (int)h) };
            p.speed = 10.0f + (float)rand() / (float)RAND_MAX * 20.0f;
            p.size  = 1.0f + (float)rand() / (float)RAND_MAX * 2.5f;
            p.alpha = 0.2f + (float)rand() / (float)RAND_MAX * 0.5f;
            p.phase = (float)rand() / (float)RAND_MAX * PI * 2.0f;
            p.color = colors[rand() % 4];
        }
    }

    void Update(float dt) {
        static float t = 0; t += dt;
        for (auto& p : pts) {
            p.pos.y -= p.speed * dt;
            if (p.pos.y < -5) {
                p.pos.y = screenH + 5;
                p.pos.x = (float)(rand() % (int)screenW);
            }
            p.alpha = 0.15f + 0.25f * sinf(t * 1.5f + p.phase);
        }
    }

    void Draw() const {
        for (const auto& p : pts) {
            Color c = ColorAlpha(p.color, p.alpha);
            DrawCircleV(p.pos, p.size, c);
        }
    }
};
