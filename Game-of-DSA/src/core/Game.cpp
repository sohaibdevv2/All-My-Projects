#include "Game.h"
#include "../screens/SplashScreen.h"
#include "../screens/MainMenu.h"
#include "../screens/WorldSelect.h"
#include "../screens/LoginScreen.h"
#include "../worlds/ArrayForest.h"
#include "../worlds/StackVolcano.h"
#include "../worlds/QueueRailway.h"
#include "../worlds/TreeKingdom.h"
#include "../worlds/GraphCity.h"
#include "../worlds/SortingArena.h"
#include "../worlds/RecursionTemple.h"
#include "../worlds/HashArena.h"
#include "../ui/UIComponents.h"
#include "../ui/Particle.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
static Game* g_game = nullptr;
static void EmscriptenLoop() {
    if (g_game) {
        float dt = GetFrameTime();
        g_game->Run();
    }
}
#endif

Game::Game() {}
Game::~Game() { Cleanup(); }

void Game::Init() {
    SetConfigFlags(FLAG_MSAA_4X_HINT | FLAG_WINDOW_RESIZABLE);
    InitWindow(SCREEN_W, SCREEN_H, TITLE);
    SetTargetFPS(FPS);
    InitAudioDevice();

    // Load font - use built-in default as fallback
    font = GetFontDefault();

    // Set default player
    ctx.player.username = "Player";
    ctx.player.level    = 1;
    ctx.player.xp       = 0;
    ctx.player.coins    = 100;

    RegisterScreens();

    ctx.currentScreen = Screen::SPLASH;
    HandleScreenTransition();
}

void Game::RegisterScreens() {
    // Splash
    screens[Screen::SPLASH] = std::make_unique<SplashScreen>();

    // Main navigation
    screens[Screen::MAIN_MENU]    = std::make_unique<MainMenuScreen>();
    screens[Screen::WORLD_SELECT] = std::make_unique<WorldSelectScreen>();
    screens[Screen::LOGIN]        = std::make_unique<LoginScreen>();

    // DSA Worlds
    screens[Screen::WORLD_ARRAY_FOREST]    = std::make_unique<ArrayForestWorld>();
    screens[Screen::WORLD_STACK_VOLCANO]   = std::make_unique<StackVolcanoWorld>();
    screens[Screen::WORLD_QUEUE_RAILWAY]   = std::make_unique<QueueRailwayWorld>();
    screens[Screen::WORLD_TREE_KINGDOM]    = std::make_unique<TreeKingdomWorld>();
    screens[Screen::WORLD_GRAPH_CITY]      = std::make_unique<GraphCityWorld>();
    screens[Screen::WORLD_SORTING_ARENA]   = std::make_unique<SortingArenaWorld>();
    screens[Screen::WORLD_RECURSION_TEMPLE]= std::make_unique<RecursionTempleWorld>();
    screens[Screen::WORLD_HASH_ARENA]      = std::make_unique<HashArenaWorld>();

    // Setup Firebase for login screen
    if (auto* ls = dynamic_cast<LoginScreen*>(screens[Screen::LOGIN].get()))
        ls->SetFirebase(&firebase);
}

void Game::HandleScreenTransition() {
    if (screens.count(ctx.currentScreen)) {
        if (currentScreenPtr) currentScreenPtr->Cleanup();
        currentScreenPtr = screens[ctx.currentScreen].get();
        currentScreenPtr->Init(ctx);
    }
}

void Game::Run() {
#ifdef __EMSCRIPTEN__
    g_game = this;
    Init();
    emscripten_set_main_loop(EmscriptenLoop, 0, 1);
#else
    Init();
    Screen lastScreen = ctx.currentScreen;

    while (!WindowShouldClose() && ctx.currentScreen != Screen::EXIT) {
        float dt = GetFrameTime();
        dt = Clamp(dt, 0.0f, 0.05f); // cap at 50ms

        // Screen change detection
        if (ctx.currentScreen != lastScreen) {
            inTransition    = true;
            transitionDir   = 1.0f;
            pendingScreen   = ctx.currentScreen;
            ctx.currentScreen = lastScreen; // revert until transition done
        }

        // Handle transition
        if (inTransition) {
            transitionAlpha += transitionDir * TRANSITION_SPEED * dt;
            if (transitionDir > 0 && transitionAlpha >= 1.0f) {
                transitionAlpha   = 1.0f;
                transitionDir     = -1.0f;
                ctx.currentScreen = pendingScreen;
                HandleScreenTransition();
                lastScreen        = ctx.currentScreen;
            } else if (transitionDir < 0 && transitionAlpha <= 0.0f) {
                transitionAlpha = 0.0f;
                inTransition    = false;
            }
        } else {
            lastScreen = ctx.currentScreen;
        }

        // Update and draw
        BeginDrawing();
        if (currentScreenPtr) {
            currentScreenPtr->Update(ctx, dt);
            currentScreenPtr->Draw(ctx, font);
        } else {
            ClearBackground(DSAColors::BG_DARK);
        }

        // Transition overlay
        if (transitionAlpha > 0.001f) {
            DrawRectangle(0, 0, GetScreenWidth(), GetScreenHeight(),
                          ColorAlpha(BLACK, transitionAlpha));
        }

        // FPS display (dev)
        if (ctx.settings.showFPS) {
            DrawFPS(GetScreenWidth() - 90, 10);
        }

        EndDrawing();
    }

    Cleanup();
#endif
}

void Game::Update(float dt) {
    if (currentScreenPtr) currentScreenPtr->Update(ctx, dt);
}

void Game::Draw() {
    BeginDrawing();
    if (currentScreenPtr) currentScreenPtr->Draw(ctx, font);
    EndDrawing();
}

void Game::Cleanup() {
    for (auto& [id, screen] : screens) if (screen) screen->Cleanup();
    if (IsFontReady(font)) UnloadFont(font);
    CloseAudioDevice();
    CloseWindow();
}
