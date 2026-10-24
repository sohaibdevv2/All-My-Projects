#pragma once
#include "raylib.h"
#include "GameState.h"
#include "../screens/Screen.h"
#include "../firebase/Firebase.h"
#include <memory>
#include <unordered_map>
#include <string>

class Game {
public:
    static constexpr int SCREEN_W = 1280;
    static constexpr int SCREEN_H = 720;
    static constexpr int FPS      = 60;
    static constexpr const char* TITLE = "GAME OF DSA — Algorithm Adventure Engine";

    Game();
    ~Game();

    void Run();

private:
    GameContext  ctx;
    Font         font;
    FirebaseClient firebase;

    std::unordered_map<Screen, std::unique_ptr<IScreen>> screens;
    IScreen* currentScreenPtr = nullptr;

    bool running = true;

    void Init();
    void RegisterScreens();
    void Update(float dt);
    void Draw();
    void Cleanup();
    void HandleScreenTransition();

    // Transition effect
    float transitionAlpha = 0.0f;
    float transitionDir   = 0.0f; // 1=fading out, -1=fading in
    Screen pendingScreen  = Screen::MAIN_MENU;
    bool   inTransition   = false;
    float  transitionTime = 0.0f;
    static constexpr float TRANSITION_SPEED = 3.5f;
};
