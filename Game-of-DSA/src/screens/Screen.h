#pragma once
#include "raylib.h"
#include "../core/GameState.h"
#include "../ui/UIComponents.h"
#include "../ui/Particle.h"

// Abstract base class for all game screens
class IScreen {
public:
    virtual ~IScreen() = default;
    virtual void Init(GameContext& ctx)   = 0;
    virtual void Update(GameContext& ctx, float dt) = 0;
    virtual void Draw(GameContext& ctx, Font font)  = 0;
    virtual void Cleanup()                = 0;
    virtual Screen GetID() const          = 0;
};
